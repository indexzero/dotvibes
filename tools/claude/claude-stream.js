#!/usr/bin/env node

/**
 * Claude Session Stream TUI
 *
 * Live terminal interface for browsing and observing Claude Code sessions
 * directly from ~/.claude/projects/
 *
 * Usage:
 *   node scripts/claude-stream.js
 *
 * Controls:
 *   Up/Down, j/k  - Navigate
 *   Enter, l      - Select/Expand
 *   h, b          - Go back
 *   q, Esc        - Quit
 *   r             - Refresh session list
 *   /             - Search (TODO)
 */

import { readFileSync, readdirSync, statSync, existsSync, watchFile, unwatchFile } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';
import { stdin, stdout } from 'node:process';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const CLAUDE_DIR = join(homedir(), '.claude');
const PROJECTS_DIR = join(CLAUDE_DIR, 'projects');

// ============================================================================
// ANSI Escape Codes and Terminal Utilities
// ============================================================================

const ESC = '\x1b';
const CSI = `${ESC}[`;

const ansi = {
  hideCursor: `${CSI}?25l`,
  showCursor: `${CSI}?25h`,
  moveTo: (row, col) => `${CSI}${row};${col}H`,
  clearScreen: `${CSI}2J`,
  clearLine: `${CSI}2K`,
  altScreen: `${CSI}?1049h`,
  mainScreen: `${CSI}?1049l`,
  fg: (code) => `${CSI}38;5;${code}m`,
  bg: (code) => `${CSI}48;5;${code}m`,
  reset: `${CSI}0m`,
  bold: `${CSI}1m`,
  dim: `${CSI}2m`,
  italic: `${CSI}3m`,
  underline: `${CSI}4m`,
  inverse: `${CSI}7m`,
  colors: {
    sessionMain: 39,
    sessionAgent: 141,
    projectDir: 220,
    branchName: 114,
    userMsg: 39,
    assistantMsg: 213,
    thinkingMsg: 245,
    toolMsg: 172,
    border: 240,
    borderActive: 75,
    statusBar: 236,
    highlight: 226,
    white: 15,
    gray: 245,
    darkGray: 238,
  }
};

// ============================================================================
// JSONL Session Parser
// ============================================================================

/**
 * Parse a JSONL session file and extract metadata + messages
 */
function parseJsonlFile(filePath) {
  const fileName = basename(filePath, '.jsonl');
  const isAgent = fileName.startsWith('agent-');

  const result = {
    filePath,
    fileName,
    isAgent,
    agentId: isAgent ? fileName.replace('agent-', '') : null,
    metadata: {
      project: null,
      branch: null,
      sessionId: null,
      start: null,
      end: null,
      messageCount: 0,
      cwd: null,
    },
    messages: [],
  };

  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (e) {
    return result;
  }

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      // Extract metadata from first entries
      if (entry.cwd && !result.metadata.cwd) result.metadata.cwd = entry.cwd;
      if (entry.gitBranch && !result.metadata.branch) result.metadata.branch = entry.gitBranch;
      if (entry.sessionId && !result.metadata.sessionId) result.metadata.sessionId = entry.sessionId;
      if (entry.timestamp) {
        if (!result.metadata.start) result.metadata.start = entry.timestamp;
        result.metadata.end = entry.timestamp;
      }

      // Extract messages
      if (entry.type === 'user' && entry.message?.content) {
        result.metadata.messageCount++;
        result.messages.push({
          type: 'user',
          timestamp: entry.timestamp,
          content: extractContent(entry.message.content),
        });
      } else if (entry.type === 'assistant' && entry.message?.content) {
        result.metadata.messageCount++;
        const parsed = parseAssistantContent(entry.message.content);
        if (parsed.text || parsed.thinking || parsed.tools.length > 0) {
          result.messages.push({
            type: 'assistant',
            timestamp: entry.timestamp,
            ...parsed,
          });
        }
      } else if (entry.type === 'summary' && entry.summary) {
        result.messages.push({
          type: 'summary',
          timestamp: entry.timestamp,
          content: entry.summary,
        });
      }
    } catch (e) {
      // Skip malformed lines
    }
  }

  // Derive project from cwd
  if (result.metadata.cwd) {
    result.metadata.project = result.metadata.cwd;
  }

  return result;
}

/**
 * Extract text content from user message
 */
function extractContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .filter(p => p.type === 'text')
      .map(p => p.text)
      .join('\n');
  }
  return '';
}

/**
 * Parse assistant message content into components
 */
function parseAssistantContent(content) {
  const result = { text: '', thinking: '', tools: [] };

  if (typeof content === 'string') {
    result.text = content;
    return result;
  }

  if (Array.isArray(content)) {
    for (const part of content) {
      if (part.type === 'text') {
        result.text += (result.text ? '\n' : '') + part.text;
      } else if (part.type === 'thinking') {
        result.thinking = part.thinking || '';
      } else if (part.type === 'tool_use') {
        result.tools.push({
          name: part.name,
          input: part.input,
        });
      }
    }
  }

  return result;
}

/**
 * Stream parse a JSONL file for real-time viewing
 */
async function* streamJsonlFile(filePath) {
  const fileStream = createReadStream(filePath);
  const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      yield JSON.parse(line);
    } catch (e) {
      // Skip malformed
    }
  }
}

// ============================================================================
// Session Discovery
// ============================================================================

/**
 * Discover all sessions from ~/.claude/projects
 * Builds a proper hierarchy: org → repo → branch → session → agents
 */
function discoverSessions() {
  const tree = {
    type: 'root',
    label: 'Sessions',
    children: [],
    expanded: true,
  };

  if (!existsSync(PROJECTS_DIR)) {
    return tree;
  }

  const projectDirs = readdirSync(PROJECTS_DIR).filter(f => {
    const fullPath = join(PROJECTS_DIR, f);
    return statSync(fullPath).isDirectory() && !f.startsWith('.');
  });

  // Collect all sessions with their hierarchy info
  const orgMap = new Map(); // org -> repoMap -> branchMap -> sessions

  for (const projectDirName of projectDirs) {
    const projectPath = join(PROJECTS_DIR, projectDirName);
    const files = readdirSync(projectPath).filter(f => f.endsWith('.jsonl'));

    if (files.length === 0) continue;

    // Get actual project path from first session's cwd field
    let fullProjectPath = null;
    for (const file of files) {
      if (fullProjectPath) break;
      try {
        const content = readFileSync(join(projectPath, file), 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          const entry = JSON.parse(line);
          if (entry.cwd) {
            fullProjectPath = entry.cwd;
            break;
          }
        }
      } catch (e) {
        // Skip
      }
    }

    if (!fullProjectPath) continue;

    // Parse path to extract org and repo
    // e.g., /Users/cjr/Git/indexzero/npm-diff-worker -> org=indexzero, repo=npm-diff-worker
    // e.g., /Users/cjr/Git/chainguard-dev/ecosystems-rebuilder.js-worktrees/mustgofaster
    //       -> org=chainguard-dev, repo=ecosystems-rebuilder.js-worktrees/mustgofaster
    const parts = fullProjectPath.split('/').filter(Boolean);
    const gitIdx = parts.findIndex(p => p === 'Git');

    let org, repo;
    if (gitIdx >= 0 && parts.length > gitIdx + 1) {
      org = parts[gitIdx + 1] || 'other';
      repo = parts.slice(gitIdx + 2).join('/') || org;
    } else {
      // Fallback for non-Git paths
      org = 'other';
      repo = parts.slice(-2).join('/') || fullProjectPath;
    }

    // Parse all sessions
    const sessions = [];
    const agents = [];

    for (const file of files) {
      const filePath = join(projectPath, file);
      const session = parseJsonlFile(filePath);
      session.fullProjectPath = fullProjectPath;

      if (session.isAgent) {
        agents.push(session);
      } else {
        sessions.push(session);
      }
    }

    // Build hierarchy: org -> repo -> branch -> sessions
    if (!orgMap.has(org)) {
      orgMap.set(org, new Map());
    }
    const repoMap = orgMap.get(org);

    if (!repoMap.has(repo)) {
      repoMap.set(repo, { branches: new Map(), agents: [], fullPath: fullProjectPath });
    }
    const repoData = repoMap.get(repo);

    // Group sessions by branch
    for (const session of sessions) {
      const branch = session.metadata.branch || 'unknown';
      if (!repoData.branches.has(branch)) {
        repoData.branches.set(branch, []);
      }
      repoData.branches.get(branch).push(session);
    }

    // Collect agents
    repoData.agents.push(...agents);
  }

  // Build tree from hierarchy
  for (const [org, repoMap] of orgMap) {
    const orgNode = {
      type: 'org',
      label: org,
      children: [],
      expanded: false,
      sessionCount: 0,
    };

    for (const [repo, repoData] of repoMap) {
      const repoNode = {
        type: 'repo',
        label: repo,
        fullPath: repoData.fullPath,
        children: [],
        expanded: false,
        sessionCount: 0,
        agentCount: repoData.agents.length,
      };

      // Add branch nodes
      for (const [branch, sessions] of repoData.branches) {
        const branchNode = {
          type: 'branch',
          label: branch,
          children: [],
          expanded: false,
        };

        // Sort sessions by start time (newest first)
        sessions.sort((a, b) => {
          const timeA = a.metadata.start || '';
          const timeB = b.metadata.start || '';
          return timeB.localeCompare(timeA);
        });

        for (const session of sessions) {
          const sessionNode = {
            type: 'session',
            label: formatSessionLabel(session),
            session,
            children: [],
            expanded: false,
          };

          // Find agents that belong to this session (by time overlap)
          const sessionStart = session.metadata.start ? new Date(session.metadata.start).getTime() : 0;
          const sessionEnd = session.metadata.end ? new Date(session.metadata.end).getTime() : Date.now();

          const relatedAgents = repoData.agents.filter(agent => {
            const agentStart = agent.metadata.start ? new Date(agent.metadata.start).getTime() : 0;
            return agentStart >= sessionStart && agentStart <= sessionEnd;
          });

          for (const agent of relatedAgents) {
            sessionNode.children.push({
              type: 'agent',
              label: formatAgentLabel(agent),
              session: agent,
              children: [],
              expanded: false,
            });
          }

          branchNode.children.push(sessionNode);
          repoNode.sessionCount++;
          orgNode.sessionCount++;
        }

        if (branchNode.children.length > 0) {
          repoNode.children.push(branchNode);
        }
      }

      // Add orphan agents
      const assignedAgentIds = new Set();
      for (const branch of repoNode.children) {
        for (const session of branch.children) {
          for (const agent of session.children) {
            assignedAgentIds.add(agent.session.agentId);
          }
        }
      }

      const orphanAgents = repoData.agents.filter(a => !assignedAgentIds.has(a.agentId));
      if (orphanAgents.length > 0) {
        const orphanBranch = {
          type: 'branch',
          label: '(agents)',
          children: orphanAgents.map(agent => ({
            type: 'agent',
            label: formatAgentLabel(agent),
            session: agent,
            children: [],
            expanded: false,
          })),
          expanded: false,
        };
        repoNode.children.push(orphanBranch);
      }

      // Sort branches (main/master first, then alphabetically)
      repoNode.children.sort((a, b) => {
        if (a.label === 'main' || a.label === 'master') return -1;
        if (b.label === 'main' || b.label === 'master') return 1;
        return a.label.localeCompare(b.label);
      });

      if (repoNode.children.length > 0) {
        orgNode.children.push(repoNode);
      }
    }

    // Sort repos by session count
    orgNode.children.sort((a, b) => b.sessionCount - a.sessionCount);

    if (orgNode.children.length > 0) {
      tree.children.push(orgNode);
    }
  }

  // Sort orgs by session count
  tree.children.sort((a, b) => b.sessionCount - a.sessionCount);

  return tree;
}

function formatSessionLabel(session) {
  const id = session.metadata.sessionId || session.fileName;
  const shortId = id.substring(0, 8);
  const msgs = session.metadata.messageCount || 0;
  const time = session.metadata.start ? formatTime(session.metadata.start) : '';
  return `${shortId} (${msgs}m) ${time}`;
}

function formatAgentLabel(agent) {
  const id = agent.agentId || agent.fileName;
  const msgs = agent.metadata.messageCount || 0;
  return `${id} (${msgs}m)`;
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

// ============================================================================
// Text Utilities
// ============================================================================

function truncateWords(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

function wrapText(text, width) {
  const lines = [];
  const paragraphs = text.split('\n');

  for (const para of paragraphs) {
    if (para.length <= width) {
      lines.push(para);
      continue;
    }

    const words = para.split(' ');
    let line = '';
    for (const word of words) {
      if (line.length + word.length + 1 <= width) {
        line += (line ? ' ' : '') + word;
      } else {
        if (line) lines.push(line);
        line = word.length > width ? word.substring(0, width - 3) + '...' : word;
      }
    }
    if (line) lines.push(line);
  }

  return lines;
}

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// ============================================================================
// TUI Application
// ============================================================================

class SessionBrowser {
  constructor() {
    this.tree = null;
    this.flatList = [];
    this.selectedIndex = 0;
    this.scrollOffset = 0;
    this.viewMode = 'tree'; // 'tree' | 'viewer'
    this.viewerContent = [];
    this.viewerScroll = 0;
    this.streamingInterval = null;
    this.streamingIndex = 0;
    this.watchedFile = null;
    this.width = stdout.columns || 120;
    this.height = stdout.rows || 40;
    this.leftPanelWidth = Math.min(45, Math.floor(this.width * 0.4));
    this.totalSessions = 0;
  }

  async run() {
    this.setupTerminal();
    this.refresh();
    this.render();
    await this.inputLoop();
  }

  setupTerminal() {
    stdout.write(ansi.altScreen + ansi.hideCursor);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    process.on('SIGWINCH', () => {
      this.width = stdout.columns || 120;
      this.height = stdout.rows || 40;
      this.leftPanelWidth = Math.min(45, Math.floor(this.width * 0.4));
      this.render();
    });

    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => {
      this.cleanup();
      process.exit(0);
    });
  }

  cleanup() {
    if (this.streamingInterval) clearInterval(this.streamingInterval);
    if (this.watchedFile) unwatchFile(this.watchedFile);
    stdout.write(ansi.showCursor + ansi.mainScreen);
    stdin.setRawMode(false);
  }

  refresh() {
    this.tree = discoverSessions();
    this.flattenTree();
    this.totalSessions = this.countSessions(this.tree);
  }

  countSessions(node) {
    let count = 0;
    if (node.type === 'session' || node.type === 'agent') count = 1;
    if (node.children) {
      for (const child of node.children) {
        count += this.countSessions(child);
      }
    }
    return count;
  }

  flattenTree() {
    this.flatList = [];
    this.flattenNode(this.tree, 0);
  }

  flattenNode(node, depth) {
    this.flatList.push({ node, depth });
    if (node.expanded && node.children) {
      for (const child of node.children) {
        this.flattenNode(child, depth + 1);
      }
    }
  }

  render() {
    let output = ansi.clearScreen + ansi.moveTo(1, 1);

    // Title bar
    const title = ' Claude Session Browser ';
    const titlePad = Math.floor((this.width - title.length) / 2);
    output += ansi.bg(ansi.colors.statusBar) + ansi.fg(6) + ansi.bold;
    output += ' '.repeat(titlePad) + title + ' '.repeat(this.width - titlePad - title.length);
    output += ansi.reset + '\n';

    if (this.viewMode === 'tree') {
      output += this.renderTreeView();
    } else {
      output += this.renderViewer();
    }

    // Status bar
    output += ansi.moveTo(this.height, 1);
    output += ansi.bg(ansi.colors.statusBar) + ansi.fg(ansi.colors.white);

    let status;
    if (this.viewMode === 'tree') {
      const pos = `${this.selectedIndex + 1}/${this.flatList.length}`;
      const help = `${ansi.fg(ansi.colors.gray)}j/k:Nav Enter:Open Space:Expand h:Back r:Refresh q:Quit`;
      status = ` ${pos}` + ' '.repeat(Math.max(0, this.width - pos.length - stripAnsi(help).length - 2)) + help + ' ';
    } else {
      const pos = `Line ${this.viewerScroll + 1}/${this.viewerContent.length}`;
      const streaming = this.streamingInterval ? ` [STREAMING]` : '';
      const help = `${ansi.fg(ansi.colors.gray)}j/k:Scroll PgUp/Dn:Page s:Skip b:Back q:Quit`;
      status = ` ${pos}${streaming}` + ' '.repeat(Math.max(0, this.width - pos.length - streaming.length - stripAnsi(help).length - 2)) + help + ' ';
    }
    output += status + ansi.reset;

    stdout.write(output);
  }

  renderTreeView() {
    let output = '';
    const contentHeight = this.height - 3;
    const rightWidth = this.width - this.leftPanelWidth - 3;

    // Headers
    output += ansi.moveTo(3, 1);
    output += ansi.fg(ansi.colors.border) + '│' + ansi.reset;
    output += ansi.fg(14) + ansi.bold + ' Sessions ' + ansi.reset;
    output += ansi.dim + `(${this.totalSessions} total)` + ansi.reset;
    output += ' '.repeat(Math.max(0, this.leftPanelWidth - 22));
    output += ansi.fg(ansi.colors.border) + '│' + ansi.reset;
    output += ansi.fg(14) + ansi.bold + ' Preview' + ansi.reset;

    // Ensure selected is visible
    if (this.selectedIndex < this.scrollOffset) {
      this.scrollOffset = this.selectedIndex;
    } else if (this.selectedIndex >= this.scrollOffset + contentHeight) {
      this.scrollOffset = this.selectedIndex - contentHeight + 1;
    }

    // Tree items
    for (let i = 0; i < contentHeight; i++) {
      const idx = this.scrollOffset + i;
      const row = 4 + i;

      output += ansi.moveTo(row, 1);
      output += ansi.fg(ansi.colors.border) + '│' + ansi.reset;

      if (idx < this.flatList.length) {
        const { node, depth } = this.flatList[idx];
        const isSelected = idx === this.selectedIndex;

        if (isSelected) {
          output += ansi.bg(4) + ansi.fg(15);
        }

        const indent = '  '.repeat(depth);
        const expandIcon = node.children?.length > 0 ? (node.expanded ? 'v ' : '> ') : '  ';

        let icon = '';
        let labelColor = '';
        switch (node.type) {
          case 'root':
            icon = '@ ';
            labelColor = ansi.fg(ansi.colors.white);
            break;
          case 'org':
            icon = '@ ';
            labelColor = ansi.fg(ansi.colors.projectDir);
            break;
          case 'repo':
            icon = '# ';
            labelColor = ansi.fg(ansi.colors.sessionMain);
            break;
          case 'branch':
            icon = '~ ';
            labelColor = ansi.fg(ansi.colors.branchName);
            break;
          case 'session':
            icon = 'o ';
            labelColor = ansi.fg(ansi.colors.gray);
            break;
          case 'agent':
            icon = '* ';
            labelColor = ansi.fg(ansi.colors.sessionAgent);
            break;
        }

        const prefix = indent + (isSelected ? '' : ansi.fg(ansi.colors.gray)) + expandIcon + ansi.reset;
        const label = (isSelected ? '' : labelColor) + icon + node.label + ansi.reset;
        const line = prefix + label;
        const visibleLen = stripAnsi(line).length;

        output += line;
        output += ' '.repeat(Math.max(0, this.leftPanelWidth - visibleLen - 1));
        output += ansi.reset;
      } else {
        output += ' '.repeat(this.leftPanelWidth - 1);
      }

      output += ansi.fg(ansi.colors.border) + '│' + ansi.reset;

      // Preview pane
      const preview = this.getPreview(rightWidth);
      if (i < preview.length) {
        output += preview[i];
      }
    }

    return output;
  }

  getPreview(width) {
    const lines = [];
    const selected = this.flatList[this.selectedIndex]?.node;

    if (!selected || selected.type === 'root') {
      lines.push(ansi.dim + 'Select a session to preview' + ansi.reset);
      lines.push('');
      lines.push(ansi.dim + 'Navigate with j/k or arrows' + ansi.reset);
      lines.push(ansi.dim + 'Press Enter to view full session' + ansi.reset);
      return lines;
    }

    if (selected.type === 'org') {
      lines.push(ansi.fg(ansi.colors.projectDir) + ansi.bold + '@ ' + selected.label + ansi.reset);
      lines.push('');
      lines.push(`Repos: ${selected.children?.length || 0}`);
      lines.push(`Sessions: ${selected.sessionCount}`);
      return lines;
    }

    if (selected.type === 'repo') {
      lines.push(ansi.fg(ansi.colors.sessionMain) + ansi.bold + '# ' + selected.label + ansi.reset);
      lines.push(ansi.dim + selected.fullPath + ansi.reset);
      lines.push('');
      lines.push(`Branches: ${selected.children?.length || 0}`);
      lines.push(`Sessions: ${selected.sessionCount}`);
      lines.push(`Agents: ${selected.agentCount}`);
      return lines;
    }

    if (selected.type === 'branch') {
      lines.push(ansi.fg(ansi.colors.branchName) + ansi.bold + '~ ' + selected.label + ansi.reset);
      lines.push('');
      lines.push(`Sessions: ${selected.children?.length || 0}`);
      return lines;
    }

    // Session or agent preview
    const session = selected.session;
    if (!session) return lines;

    // Header
    const typeLabel = selected.type === 'agent' ? 'Agent' : 'Session';
    lines.push(ansi.bold + typeLabel + ': ' + ansi.reset + (session.metadata.sessionId || session.fileName));

    if (session.metadata.branch) {
      lines.push(ansi.fg(ansi.colors.branchName) + 'Branch: ' + session.metadata.branch + ansi.reset);
    }

    lines.push(ansi.dim + `Messages: ${session.metadata.messageCount}` + ansi.reset);

    if (session.metadata.start) {
      lines.push(ansi.dim + `Started: ${formatTime(session.metadata.start)}` + ansi.reset);
    }

    lines.push('');
    lines.push(ansi.underline + 'Last 3 messages:' + ansi.reset);
    lines.push('');

    // Last 3 messages (250 word truncation)
    const lastMessages = session.messages.slice(-3);
    for (const msg of lastMessages) {
      const prefix = msg.type === 'user'
        ? ansi.fg(ansi.colors.userMsg) + '>> '
        : ansi.fg(ansi.colors.assistantMsg) + '<< ';

      lines.push(prefix + ansi.bold + msg.type.toUpperCase() + ansi.reset);

      let content = msg.content || msg.text || '';
      if (msg.thinking) {
        content = '[thinking] ' + msg.thinking.substring(0, 100) + '...';
      }
      if (msg.tools?.length > 0) {
        content = '[' + msg.tools.map(t => t.name).join(', ') + '] ' + content;
      }

      content = truncateWords(content, 250);
      const wrapped = wrapText(content, width - 2);
      for (const line of wrapped.slice(0, 6)) {
        lines.push('  ' + ansi.dim + line + ansi.reset);
      }
      if (wrapped.length > 6) {
        lines.push('  ' + ansi.dim + '...' + ansi.reset);
      }
      lines.push('');
    }

    return lines;
  }

  renderViewer() {
    let output = '';
    const contentHeight = this.height - 3;

    // Viewer header
    output += ansi.moveTo(3, 1);
    const session = this.flatList[this.selectedIndex]?.node?.session;
    const title = session
      ? `Session: ${session.metadata.sessionId || session.fileName} [${session.metadata.branch || 'unknown'}]`
      : 'Session Viewer';
    output += ansi.fg(14) + ansi.bold + ' ' + title + ansi.reset;

    // Content
    for (let i = 0; i < contentHeight; i++) {
      const lineIdx = this.viewerScroll + i;
      output += ansi.moveTo(4 + i, 1);

      if (lineIdx < this.viewerContent.length) {
        const line = this.viewerContent[lineIdx];
        output += line.substring(0, this.width);
      }
    }

    return output;
  }

  openSession() {
    const selected = this.flatList[this.selectedIndex]?.node;
    if (!selected?.session) return;

    this.viewMode = 'viewer';
    this.viewerContent = [];
    this.viewerScroll = 0;
    this.streamingIndex = 0;

    const session = selected.session;
    const messages = session.messages;

    // Show last 5 messages immediately
    const immediate = messages.slice(-5);
    const toStream = messages.slice(0, -5);

    for (const msg of immediate) {
      this.appendMessage(msg);
    }

    // Stream remaining messages
    if (toStream.length > 0) {
      let streamIdx = 0;
      this.streamingInterval = setInterval(() => {
        if (streamIdx >= toStream.length) {
          clearInterval(this.streamingInterval);
          this.streamingInterval = null;
          this.render();
          return;
        }

        // Prepend to viewerContent (older messages at top)
        const msg = toStream[toStream.length - 1 - streamIdx];
        this.prependMessage(msg);
        streamIdx++;
        this.render();
      }, 50);
    }

    // Watch file for live updates
    if (existsSync(session.filePath)) {
      this.watchedFile = session.filePath;
      let lastSize = statSync(session.filePath).size;

      watchFile(session.filePath, { interval: 1000 }, (curr) => {
        if (curr.size > lastSize) {
          // File grew - reload and show new content
          lastSize = curr.size;
          const updated = parseJsonlFile(session.filePath);
          const newMessages = updated.messages.slice(session.messages.length);
          for (const msg of newMessages) {
            this.appendMessage(msg);
          }
          session.messages = updated.messages;
          this.render();
        }
      });
    }

    this.render();
  }

  appendMessage(msg) {
    const lines = this.formatMessage(msg);
    this.viewerContent.push(...lines);
    // Auto-scroll to bottom for new messages
    this.viewerScroll = Math.max(0, this.viewerContent.length - (this.height - 4));
  }

  prependMessage(msg) {
    const lines = this.formatMessage(msg);
    this.viewerContent.unshift(...lines);
  }

  formatMessage(msg) {
    const lines = [];
    const width = this.width - 4;

    // Header
    let header;
    if (msg.type === 'user') {
      header = ansi.fg(ansi.colors.userMsg) + ansi.bold + '═══ USER ' +
               ansi.reset + ansi.dim + (msg.timestamp ? `[${new Date(msg.timestamp).toLocaleTimeString()}]` : '') +
               ansi.reset + ' ' + '═'.repeat(Math.max(0, width - 25));
    } else if (msg.type === 'assistant') {
      header = ansi.fg(ansi.colors.assistantMsg) + ansi.bold + '─── ASSISTANT ' +
               ansi.reset + ansi.dim + (msg.timestamp ? `[${new Date(msg.timestamp).toLocaleTimeString()}]` : '') +
               ansi.reset + ' ' + '─'.repeat(Math.max(0, width - 30));
    } else {
      header = ansi.fg(ansi.colors.thinkingMsg) + '### ' + msg.type.toUpperCase() + ansi.reset;
    }
    lines.push(header);

    // Thinking block (collapsed)
    if (msg.thinking) {
      lines.push(ansi.fg(ansi.colors.thinkingMsg) + ansi.italic +
                 '[thinking: ' + msg.thinking.substring(0, 80).replace(/\n/g, ' ') + '...]' +
                 ansi.reset);
    }

    // Tool calls
    if (msg.tools?.length > 0) {
      for (const tool of msg.tools) {
        lines.push(ansi.fg(ansi.colors.toolMsg) + '  [Tool: ' + tool.name + ']' + ansi.reset);
      }
    }

    // Content
    const content = msg.content || msg.text || '';
    if (content) {
      const wrapped = wrapText(content, width);
      for (const line of wrapped) {
        lines.push('  ' + line);
      }
    }

    lines.push('');
    return lines;
  }

  closeViewer() {
    this.viewMode = 'tree';
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
      this.streamingInterval = null;
    }
    if (this.watchedFile) {
      unwatchFile(this.watchedFile);
      this.watchedFile = null;
    }
    this.render();
  }

  skipStreaming() {
    if (!this.streamingInterval) return;

    clearInterval(this.streamingInterval);
    this.streamingInterval = null;

    const session = this.flatList[this.selectedIndex]?.node?.session;
    if (!session) return;

    // Load all messages
    this.viewerContent = [];
    for (const msg of session.messages) {
      const lines = this.formatMessage(msg);
      this.viewerContent.push(...lines);
    }
    this.viewerScroll = Math.max(0, this.viewerContent.length - (this.height - 4));
    this.render();
  }

  toggleExpand() {
    const item = this.flatList[this.selectedIndex];
    if (!item) return;

    if (item.node.children?.length > 0) {
      item.node.expanded = !item.node.expanded;
      this.flattenTree();
      this.render();
    } else if (item.node.session) {
      this.openSession();
    }
  }

  select() {
    const item = this.flatList[this.selectedIndex];
    if (!item) return;

    if (item.node.session) {
      this.openSession();
    } else if (item.node.children?.length > 0) {
      item.node.expanded = true;
      this.flattenTree();
      this.render();
    }
  }

  goBack() {
    if (this.viewMode === 'viewer') {
      this.closeViewer();
      return;
    }

    // Collapse current or go to parent
    const item = this.flatList[this.selectedIndex];
    if (item?.node.expanded) {
      item.node.expanded = false;
      this.flattenTree();
      this.render();
    } else if (item && item.depth > 0) {
      // Find parent
      for (let i = this.selectedIndex - 1; i >= 0; i--) {
        if (this.flatList[i].depth < item.depth) {
          this.selectedIndex = i;
          this.render();
          break;
        }
      }
    }
  }

  async inputLoop() {
    for await (const key of stdin) {
      if (key === '\x03' || key === 'q' || key === '\x1b') {
        // Ctrl+C, q, or Escape
        if (this.viewMode === 'viewer') {
          this.closeViewer();
        } else {
          this.cleanup();
          process.exit(0);
        }
      } else if (key === 'j' || key === '\x1b[B') {
        // Down
        if (this.viewMode === 'tree') {
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.flatList.length - 1);
        } else {
          this.viewerScroll = Math.min(this.viewerScroll + 1, Math.max(0, this.viewerContent.length - (this.height - 4)));
        }
        this.render();
      } else if (key === 'k' || key === '\x1b[A') {
        // Up
        if (this.viewMode === 'tree') {
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        } else {
          this.viewerScroll = Math.max(this.viewerScroll - 1, 0);
        }
        this.render();
      } else if (key === '\r' || key === 'l') {
        // Enter or l
        if (this.viewMode === 'tree') {
          this.select();
        }
      } else if (key === ' ') {
        // Space - toggle expand
        if (this.viewMode === 'tree') {
          this.toggleExpand();
        }
      } else if (key === 'h' || key === 'b') {
        // h or b - go back
        this.goBack();
      } else if (key === 'r') {
        // Refresh
        if (this.viewMode === 'tree') {
          this.refresh();
          this.render();
        }
      } else if (key === 's') {
        // Skip streaming
        if (this.viewMode === 'viewer') {
          this.skipStreaming();
        }
      } else if (key === '\x1b[5~') {
        // Page Up
        if (this.viewMode === 'viewer') {
          this.viewerScroll = Math.max(0, this.viewerScroll - (this.height - 6));
          this.render();
        }
      } else if (key === '\x1b[6~') {
        // Page Down
        if (this.viewMode === 'viewer') {
          this.viewerScroll = Math.min(
            Math.max(0, this.viewerContent.length - (this.height - 4)),
            this.viewerScroll + (this.height - 6)
          );
          this.render();
        }
      } else if (key === 'G') {
        // Go to end
        if (this.viewMode === 'tree') {
          this.selectedIndex = this.flatList.length - 1;
        } else {
          this.viewerScroll = Math.max(0, this.viewerContent.length - (this.height - 4));
        }
        this.render();
      } else if (key === 'g') {
        // Go to start
        if (this.viewMode === 'tree') {
          this.selectedIndex = 0;
          this.scrollOffset = 0;
        } else {
          this.viewerScroll = 0;
        }
        this.render();
      }
    }
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  if (!existsSync(PROJECTS_DIR)) {
    console.error(`Claude projects directory not found: ${PROJECTS_DIR}`);
    console.error('');
    console.error('Make sure you have Claude Code installed and have run at least one session.');
    process.exit(1);
  }

  const browser = new SessionBrowser();
  await browser.run();
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
