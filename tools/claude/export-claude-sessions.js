#!/usr/bin/env node

/**
 * Export Claude Code sessions from ~/.claude/projects to plain text files.
 *
 * Usage:
 *   node scripts/export-claude-sessions.js [output-dir]
 *
 * Default output: ./claude-sessions-export/
 *
 * Structure preserved:
 *   output-dir/
 *     <project-path>/
 *       <session-uuid>.txt
 *       agent-<id>.txt
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline';
import { createReadStream } from 'node:fs';

const CLAUDE_DIR = join(homedir(), '.claude');
const PROJECTS_DIR = join(CLAUDE_DIR, 'projects');

/**
 * Parse a JSONL session file and extract conversation text
 */
async function parseSessionFile(filePath) {
  const lines = [];
  const fileStream = createReadStream(filePath);
  const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      lines.push(entry);
    } catch (e) {
      // Skip malformed lines
    }
  }
  return lines;
}

/**
 * Format a message entry to plain text
 */
function formatMessage(entry) {
  const parts = [];
  const timestamp = entry.timestamp ? new Date(entry.timestamp).toISOString() : '';

  if (entry.type === 'user' && entry.message?.content) {
    parts.push(`\n${'='.repeat(80)}`);
    parts.push(`USER [${timestamp}]`);
    parts.push(`${'='.repeat(80)}`);

    const content = entry.message.content;
    if (typeof content === 'string') {
      parts.push(content);
    } else if (Array.isArray(content)) {
      // Handle multi-part content (text + images, etc.)
      for (const part of content) {
        if (part.type === 'text') {
          parts.push(part.text);
        } else if (part.type === 'tool_result') {
          parts.push(`[Tool Result: ${part.tool_use_id}]`);
          if (typeof part.content === 'string') {
            parts.push(part.content);
          }
        }
      }
    }
  } else if (entry.type === 'assistant' && entry.message?.content) {
    parts.push(`\n${'-'.repeat(80)}`);
    parts.push(`ASSISTANT [${timestamp}]`);
    parts.push(`${'-'.repeat(80)}`);

    const content = entry.message.content;
    if (typeof content === 'string') {
      parts.push(content);
    } else if (Array.isArray(content)) {
      for (const part of content) {
        if (part.type === 'text') {
          parts.push(part.text);
        } else if (part.type === 'tool_use') {
          parts.push(`\n[Tool: ${part.name}]`);
          if (part.input) {
            // Summarize tool inputs
            const inputStr = JSON.stringify(part.input, null, 2);
            if (inputStr.length > 500) {
              parts.push(inputStr.substring(0, 500) + '...[truncated]');
            } else {
              parts.push(inputStr);
            }
          }
        } else if (part.type === 'thinking') {
          parts.push(`\n[Thinking]\n${part.thinking}`);
        }
      }
    }
  } else if (entry.type === 'summary') {
    parts.push(`\n${'#'.repeat(80)}`);
    parts.push(`SUMMARY [${timestamp}]`);
    parts.push(`${'#'.repeat(80)}`);
    if (entry.summary) {
      parts.push(entry.summary);
    }
  }

  return parts.join('\n');
}

/**
 * Extract metadata from session entries
 */
function extractMetadata(entries) {
  const meta = {
    project: null,
    branch: null,
    sessionId: null,
    startTime: null,
    endTime: null,
    messageCount: 0
  };

  for (const entry of entries) {
    if (entry.cwd && !meta.project) meta.project = entry.cwd;
    if (entry.gitBranch && !meta.branch) meta.branch = entry.gitBranch;
    if (entry.sessionId && !meta.sessionId) meta.sessionId = entry.sessionId;
    if (entry.timestamp) {
      if (!meta.startTime) meta.startTime = entry.timestamp;
      meta.endTime = entry.timestamp;
    }
    if (entry.type === 'user' || entry.type === 'assistant') {
      meta.messageCount++;
    }
  }

  return meta;
}

/**
 * Convert session entries to plain text
 */
function sessionToText(entries, filePath) {
  const meta = extractMetadata(entries);

  const header = [
    `${'#'.repeat(80)}`,
    `# CLAUDE CODE SESSION EXPORT`,
    `${'#'.repeat(80)}`,
    ``,
    `File: ${filePath}`,
    `Project: ${meta.project || 'Unknown'}`,
    `Branch: ${meta.branch || 'Unknown'}`,
    `Session ID: ${meta.sessionId || basename(filePath, '.jsonl')}`,
    `Start: ${meta.startTime || 'Unknown'}`,
    `End: ${meta.endTime || 'Unknown'}`,
    `Messages: ${meta.messageCount}`,
    ``,
    `${'#'.repeat(80)}`,
    ``
  ].join('\n');

  const messages = entries
    .filter(e => e.type === 'user' || e.type === 'assistant' || e.type === 'summary')
    .map(formatMessage)
    .filter(m => m.trim())
    .join('\n');

  return header + messages;
}

/**
 * Process a single project directory
 */
async function processProject(projectDir, outputBase) {
  const projectName = basename(projectDir);
  const outputDir = join(outputBase, projectName);

  // Find all .jsonl files
  const files = readdirSync(projectDir).filter(f => f.endsWith('.jsonl'));

  if (files.length === 0) return { processed: 0, skipped: 0 };

  mkdirSync(outputDir, { recursive: true });

  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = join(projectDir, file);
    const outputPath = join(outputDir, file.replace('.jsonl', '.txt'));

    try {
      const entries = await parseSessionFile(filePath);

      // Skip empty or metadata-only sessions
      const hasMessages = entries.some(e => e.type === 'user' || e.type === 'assistant');
      if (!hasMessages) {
        skipped++;
        continue;
      }

      const text = sessionToText(entries, filePath);
      writeFileSync(outputPath, text, 'utf8');
      processed++;

      console.log(`  Exported: ${file} -> ${basename(outputPath)}`);
    } catch (e) {
      console.error(`  Error processing ${file}: ${e.message}`);
      skipped++;
    }
  }

  return { processed, skipped };
}

/**
 * Export global history.jsonl
 */
async function exportGlobalHistory(outputBase) {
  const historyPath = join(CLAUDE_DIR, 'history.jsonl');
  if (!existsSync(historyPath)) {
    console.log('No global history.jsonl found');
    return;
  }

  const outputPath = join(outputBase, 'history.txt');
  const entries = await parseSessionFile(historyPath);

  const lines = [
    `${'#'.repeat(80)}`,
    `# CLAUDE CODE GLOBAL HISTORY`,
    `${'#'.repeat(80)}`,
    ``,
    `Total entries: ${entries.length}`,
    ``,
  ];

  for (const entry of entries) {
    if (entry.display && entry.timestamp) {
      const date = new Date(entry.timestamp).toISOString();
      const project = entry.project || 'Unknown';
      lines.push(`[${date}] ${project}`);
      lines.push(`  ${entry.display.substring(0, 200)}${entry.display.length > 200 ? '...' : ''}`);
      lines.push('');
    }
  }

  writeFileSync(outputPath, lines.join('\n'), 'utf8');
  console.log(`Exported global history: ${outputPath}`);
}

/**
 * Main export function
 */
async function main() {
  const outputBase = process.argv[2] || './claude-sessions-export';

  console.log(`Claude Session Exporter`);
  console.log(`=======================`);
  console.log(`Source: ${PROJECTS_DIR}`);
  console.log(`Output: ${outputBase}`);
  console.log('');

  if (!existsSync(PROJECTS_DIR)) {
    console.error(`Projects directory not found: ${PROJECTS_DIR}`);
    process.exit(1);
  }

  mkdirSync(outputBase, { recursive: true });

  // Export global history
  await exportGlobalHistory(outputBase);
  console.log('');

  // Process each project
  const projects = readdirSync(PROJECTS_DIR)
    .filter(f => !f.startsWith('.'))
    .filter(f => statSync(join(PROJECTS_DIR, f)).isDirectory());

  let totalProcessed = 0;
  let totalSkipped = 0;

  for (const project of projects) {
    console.log(`Processing: ${project}`);
    const { processed, skipped } = await processProject(
      join(PROJECTS_DIR, project),
      outputBase
    );
    totalProcessed += processed;
    totalSkipped += skipped;
  }

  console.log('');
  console.log(`${'='.repeat(40)}`);
  console.log(`Export complete!`);
  console.log(`  Sessions exported: ${totalProcessed}`);
  console.log(`  Sessions skipped: ${totalSkipped}`);
  console.log(`  Output directory: ${outputBase}`);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
