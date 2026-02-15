#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const { workspace, context_window, cost, model, transcript_path } = data;
  const cwd = workspace?.current_dir || process.cwd();

  // Colors
  const orange = '\x1b[38;5;172m';
  const yellow = '\x1b[38;5;190m';
  const green = '\x1b[38;5;82m';
  const red = '\x1b[38;5;196m';
  const cyan = '\x1b[38;5;87m';
  const dim = '\x1b[2m';
  const reset = '\x1b[0m';

  const parts = [];

  // Git branch
  let branch = '';
  let dirty = false;
  try {
    branch = execSync('git branch --no-color 2>/dev/null', { cwd, encoding: 'utf8' })
      .split('\n')
      .find(line => line.startsWith('*'))
      ?.replace('* ', '') || '';
    if (branch) {
      const status = execSync('git status --porcelain 2>/dev/null', { cwd, encoding: 'utf8' });
      dirty = status.trim().length > 0;
    }
  } catch {}

  if (branch) {
    parts.push(`${orange}${branch}${dirty ? '*' : ''}${reset}`);
  }

  // Token counts (cumulative for session)
  const fmt = n => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M`
                 : n >= 1000 ? `${Math.round(n / 1000)}k`
                 : `${n}`;

  if (context_window?.total_input_tokens !== undefined && context_window?.total_output_tokens !== undefined) {
    const inTok = fmt(context_window.total_input_tokens);
    const outTok = fmt(context_window.total_output_tokens);
    parts.push(`${dim}${inTok}/${outTok}${reset}`);
  }

  // Model with cost
  if (model?.display_name) {
    const dollars = cost?.total_cost_usd !== undefined ? Math.ceil(cost.total_cost_usd) : 0;
    parts.push(`${dim}${model.display_name}($${dollars})${reset}`);
  }

  process.stdout.write(parts.join(' '));
});
