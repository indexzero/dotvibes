#!/usr/bin/env node

import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import the ESLint config directly
const eslintConfig = (await import('./eslint.config.js')).default;

// Load the XO ESLint config from JSON
const xoESLintConfig = JSON.parse(await fs.readFile(join(__dirname, 'xo-eslint-config.json'), 'utf8'));

// Extract all rules from ESLint config
function extractESLintRules(config) {
  const rules = {};

  // Get rules from the main config object
  if (config[0] && config[0].rules) {
    Object.assign(rules, config[0].rules);
  }

  return rules;
}

// Extract all rules from XO's ESLint config
function extractXORules(config) {
  return config.rules || {};
}

// Format rule value for display
function formatRuleValue(value) {
  if (value === 'off' || value === 0) return '❌';
  if (value === 'warn' || value === 1) return '⚠️';
  if (value === 'error' || value === 2) return '✅';
  if (Array.isArray(value)) {
    const level = value[0];
    const config = value.slice(1);
    const levelSymbol = level === 'error' || level === 2 ? '✅' :
                       level === 'warn' || level === 1 ? '⚠️' : '❌';
    if (config.length === 0) return levelSymbol;

    // Format the config in a readable way
    const configStr = JSON.stringify(config)
      .replace(/^\[|\]$/g, '')
      .replace(/,/g, ', ')
      .substring(0, 100); // Limit length for readability

    if (configStr.length > 100) {
      return `${levelSymbol} \`[...]\``;
    }
    return `${levelSymbol} \`[${configStr}]\``;
  }
  return '✅';
}

// Get documentation link for a rule
function getRuleLink(ruleName) {
  // Plugin rules
  if (ruleName.startsWith('import/')) {
    const rule = ruleName.replace('import/', '');
    return `https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/${rule}.md`;
  }
  if (ruleName.startsWith('node/')) {
    const rule = ruleName.replace('node/', '');
    return `https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/${rule}.md`;
  }
  if (ruleName.startsWith('unicorn/')) {
    const rule = ruleName.replace('unicorn/', '');
    return `https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/${rule}.md`;
  }
  if (ruleName.startsWith('jsdoc/')) {
    const rule = ruleName.replace('jsdoc/', '');
    return `https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/${rule}.md`;
  }
  if (ruleName.startsWith('@stylistic/')) {
    const rule = ruleName.replace('@stylistic/', '');
    return `https://eslint.style/rules/default/${rule}`;
  }
  if (ruleName.startsWith('node-import/')) {
    return `https://github.com/weiran-zsd/eslint-plugin-node-import`;
  }
  if (ruleName.startsWith('n/')) {
    const rule = ruleName.replace('n/', '');
    return `https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/${rule}.md`;
  }
  if (ruleName.startsWith('ava/')) {
    const rule = ruleName.replace('ava/', '');
    return `https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/${rule}.md`;
  }
  if (ruleName.startsWith('promise/')) {
    const rule = ruleName.replace('promise/', '');
    return `https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/${rule}.md`;
  }
  if (ruleName.startsWith('eslint-comments/')) {
    const rule = ruleName.replace('eslint-comments/', '');
    return `https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/master/docs/rules/${rule}.md`;
  }

  // Core ESLint rules
  return `https://eslint.org/docs/latest/rules/${ruleName}`;
}

// Group rules by plugin for better organization
function groupRules(rules) {
  const groups = {
    core: [],
    '@stylistic': [],
    'ava': [],
    'eslint-comments': [],
    'import': [],
    'jsdoc': [],
    'n': [],
    'node': [],
    'node-import': [],
    'promise': [],
    'unicorn': [],
    'other': []
  };

  for (const rule of rules) {
    if (rule.startsWith('@stylistic/')) {
      groups['@stylistic'].push(rule);
    } else if (rule.includes('/')) {
      const plugin = rule.split('/')[0];
      if (groups[plugin]) {
        groups[plugin].push(rule);
      } else {
        groups.other.push(rule);
      }
    } else {
      groups.core.push(rule);
    }
  }

  // Remove empty groups
  for (const key of Object.keys(groups)) {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  }

  return groups;
}

async function main() {
  console.log('Analyzing lint configurations...\n');

  // Get rules from both configs
  const eslintRules = extractESLintRules(eslintConfig);
  const xoRules = extractXORules(xoESLintConfig);

  console.log(`Found ${Object.keys(eslintRules).length} ESLint rules`);
  console.log(`Found ${Object.keys(xoRules).length} XO rules`);

  // Combine all unique rule names
  const allRules = new Set([
    ...Object.keys(eslintRules),
    ...Object.keys(xoRules)
  ]);

  // Group and sort rules
  const groupedRules = groupRules(Array.from(allRules));

  // Calculate statistics
  const stats = {
    total: allRules.size,
    eslintOnly: 0,
    xoOnly: 0,
    both: 0,
    conflicts: 0
  };

  for (const rule of allRules) {
    const hasEslint = eslintRules[rule] !== undefined;
    const hasXo = xoRules[rule] !== undefined;

    if (hasEslint && hasXo) {
      stats.both++;
      if (JSON.stringify(eslintRules[rule]) !== JSON.stringify(xoRules[rule])) {
        stats.conflicts++;
      }
    } else if (hasEslint) {
      stats.eslintOnly++;
    } else {
      stats.xoOnly++;
    }
  }

  // Generate markdown table
  let markdown = `# Complete ESLint vs XO Rules Comparison

Generated on: ${new Date().toISOString()}

## Legend
- ✅ = Rule enabled (error level)
- ⚠️ = Rule enabled (warning level)
- ❌ = Rule explicitly disabled
- Configuration values shown in brackets when customized
- Empty cell = Rule not configured in this config

## Summary Statistics

- **Total unique rules**: ${stats.total}
- **ESLint config rules**: ${Object.keys(eslintRules).length}
- **XO config rules**: ${Object.keys(xoRules).length}
- **Rules in both configs**: ${stats.both}
- **ESLint-only rules**: ${stats.eslintOnly}
- **XO-only rules**: ${stats.xoOnly}
- **Conflicting rules**: ${stats.conflicts}

## Complete Rules Table

| Rule Name | eslint.config.js | xo.config.js | Documentation |
|-----------|------------------|--------------|---------------|
`;

  // Add rules by group
  for (const [groupName, rules] of Object.entries(groupedRules)) {
    // Sort rules within each group
    rules.sort();

    // Add group header
    const displayName = groupName === 'core' ? 'Core ESLint Rules' :
                       groupName === 'other' ? 'Other Plugin Rules' :
                       `Plugin: ${groupName}`;
    markdown += `| **${displayName}** | | | |\n`;

    // Add each rule
    for (const rule of rules) {
      const eslintValue = eslintRules[rule];
      const xoValue = xoRules[rule];

      const eslintDisplay = eslintValue !== undefined ? formatRuleValue(eslintValue) : '';
      const xoDisplay = xoValue !== undefined ? formatRuleValue(xoValue) : '';
      const link = `[📖](${getRuleLink(rule)})`;

      // Highlight conflicting rules
      const isConflict = eslintValue !== undefined && xoValue !== undefined &&
                        JSON.stringify(eslintValue) !== JSON.stringify(xoValue);
      const ruleName = isConflict ? `**\`${rule}\`**` : `\`${rule}\``;

      markdown += `| ${ruleName} | ${eslintDisplay} | ${xoDisplay} | ${link} |\n`;
    }
  }

  // Add detailed differences section
  markdown += `
## Detailed Analysis

### Rules Only in eslint.config.js (${stats.eslintOnly})
`;

  const eslintOnlyRules = Array.from(allRules).filter(r =>
    eslintRules[r] !== undefined && xoRules[r] === undefined
  );

  for (const rule of eslintOnlyRules.sort()) {
    markdown += `- \`${rule}\`: ${formatRuleValue(eslintRules[rule])}\n`;
  }

  markdown += `
### Conflicting Rules (${stats.conflicts})

These rules are configured differently in each config:
`;

  const conflictingRules = Array.from(allRules).filter(r => {
    const e = eslintRules[r];
    const x = xoRules[r];
    return e !== undefined && x !== undefined && JSON.stringify(e) !== JSON.stringify(x);
  });

  for (const rule of conflictingRules.sort()) {
    markdown += `- \`${rule}\`:\n`;
    markdown += `  - ESLint: ${formatRuleValue(eslintRules[rule])}\n`;
    markdown += `  - XO: ${formatRuleValue(xoRules[rule])}\n`;
  }

  if (stats.xoOnly > 50) {
    markdown += `
### XO-Only Rules (${stats.xoOnly})

XO includes ${stats.xoOnly} additional rules not present in the ESLint config.
The most notable categories include:

`;

    // Count by plugin for XO-only rules
    const xoOnlyByPlugin = {};
    for (const rule of allRules) {
      if (eslintRules[rule] === undefined && xoRules[rule] !== undefined) {
        const plugin = rule.includes('/') ? rule.split('/')[0] : 'core';
        xoOnlyByPlugin[plugin] = (xoOnlyByPlugin[plugin] || 0) + 1;
      }
    }

    for (const [plugin, count] of Object.entries(xoOnlyByPlugin).sort((a, b) => b[1] - a[1])) {
      markdown += `- **${plugin}**: ${count} rules\n`;
    }

    markdown += `
See the full table above for complete details.`;
  } else {
    markdown += `
### XO-Only Rules (${stats.xoOnly})
`;

    const xoOnlyRules = Array.from(allRules).filter(r =>
      eslintRules[r] === undefined && xoRules[r] !== undefined
    );

    for (const rule of xoOnlyRules.sort()) {
      markdown += `- \`${rule}\`: ${formatRuleValue(xoRules[rule])}\n`;
    }
  }

  // Write to compare.md
  await fs.writeFile(join(__dirname, 'compare.md'), markdown);

  console.log('\n✅ Comparison table written to compare.md');
  console.log(`📊 Analyzed ${stats.total} total unique rules`);
  console.log(`🔍 ${stats.both} rules configured in both (${stats.conflicts} conflicts)`);
  console.log(`📝 ${stats.eslintOnly} ESLint-only rules`);
  console.log(`🎯 ${stats.xoOnly} XO-only rules`);
}

main().catch(console.error);