#!/usr/bin/env node

const { marked } = require('marked');
const fs = require('fs');

const md = fs.readFileSync(process.argv[2] || 'convo.md', 'utf8');

// Wrap user prompts (❯ and continuation lines) in a special div
const processed = md.replace(/(^❯[^\n]*(?:\n  [^\n]*)*)/gm, (match) => {
  // Join soft-wrapped lines, but keep ⎿ lines separate
  const lines = match.split('\n');
  let result = lines[0]; // Start with the ❯ line
  const subItems = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('⎿')) {
      subItems.push(line.trim());
    } else {
      // Join soft-wrapped continuation to previous line
      result += ' ' + line.trim();
    }
  }

  let html = '<div class="user-prompt">' + result;
  if (subItems.length > 0) {
    html += '<div class="sub-items">' + subItems.join('<br>') + '</div>';
  }
  html += '</div>';
  return html;
});

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.2.0/dist/fonts/geist-mono/style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css">
<style>
body, .markdown-body, code, pre {
  font-family: 'Geist Mono', monospace !important;
}
body {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: #0d1117;
  color: #c9d1d9;
}
.markdown-body {
  background: #0d1117;
  color: #c9d1d9;
}
.user-prompt {
  background: #010409;
  border-left: 3px solid #58a6ff;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 6px;
  white-space: pre-wrap;
}
.user-prompt > *:last-child { margin-bottom: 0; }
.user-prompt > *:first-child { margin-top: 0; }
.sub-items {
  margin-top: 0.5rem;
  opacity: 0.7;
  font-size: 0.9em;
}
details { margin: 1rem 0; }
summary { cursor: pointer; opacity: 0.7; }
</style>
</head>
<body class="markdown-body">
${marked.parse(processed)}
</body>
</html>`;

process.stdout.write(html);
