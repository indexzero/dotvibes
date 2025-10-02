#!/usr/bin/env node

import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import xo from 'xo';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Import the ESLint config directly
const eslintConfig = (await import('./eslint.config.js')).default;

// Import the XO config
const xoConfigFile = (await import('./xo.config.js')).default;

// Extract all rules from ESLint config
function extractESLintRules(config) {
  const rules = {};

  // Get rules from the main config object
  if (config[0] && config[0].rules) {
    Object.assign(rules, config[0].rules);
  }

  return rules;
}

// Get XO's complete ESLint configuration including all defaults
async function getXOCompleteRules() {
  try {
    // Create a temporary test file to get XO's config
    const testFile = join(__dirname, 'temp-test.js');
    await fs.writeFile(testFile, '// test file\n');

    // Get XO's options with our config
    const options = await xo.getOptions({
      cwd: __dirname,
      ...xoConfigFile
    });

    // Clean up
    await fs.unlink(testFile);

    // Extract all rules from XO's resolved config
    const allRules = {};

    // XO returns an array of configs (for different file patterns)
    // We need to merge all the rules
    if (options.eslintConfig && Array.isArray(options.eslintConfig)) {
      for (const config of options.eslintConfig) {
        if (config.rules) {
          Object.assign(allRules, config.rules);
        }
      }
    } else if (options.rules) {
      Object.assign(allRules, options.rules);
    }

    // Also check if there's a baseConfig
    if (options.baseConfig && options.baseConfig.rules) {
      Object.assign(allRules, options.baseConfig.rules);
    }

    return allRules;
  } catch (error) {
    console.error('Error getting XO config:', error);

    // Fallback: try to get it via CLI
    try {
      const { stdout } = await execAsync('npx xo --print-config temp.js', {
        cwd: __dirname
      });
      const config = JSON.parse(stdout);
      return config.rules || {};
    } catch (cliError) {
      console.error('CLI fallback also failed:', cliError);
      return {};
    }
  }
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
    // Format the config more concisely
    const configStr = JSON.stringify(config).replace(/^\[|\]$/g, '');
    return `${levelSymbol} \`${configStr}\``;
  }
  return '✅';
}

// Get documentation link for a rule
function getRuleLink(ruleName) {
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
  // Core ESLint rules
  return `https://eslint.org/docs/latest/rules/${ruleName}`;
}

// Create a simplified config string for complex configurations
function simplifyConfig(value) {
  if (!Array.isArray(value)) return formatRuleValue(value);

  const [level, ...config] = value;
  const levelSymbol = level === 'error' || level === 2 ? '✅' :
                     level === 'warn' || level === 1 ? '⚠️' : '❌';

  if (config.length === 0) return levelSymbol;

  // Special handling for common patterns
  if (config.length === 1) {
    const cfg = config[0];
    if (typeof cfg === 'string') {
      return `${levelSymbol} \`'${cfg}'\``;
    }
    if (typeof cfg === 'number') {
      return `${levelSymbol} \`${cfg}\``;
    }
    if (typeof cfg === 'object' && cfg !== null) {
      // For objects, show key properties
      const keys = Object.keys(cfg);
      if (keys.length <= 3) {
        const shortCfg = JSON.stringify(cfg).replace(/"/g, "'");
        if (shortCfg.length <= 50) {
          return `${levelSymbol} \`${shortCfg}\``;
        }
      }
      return `${levelSymbol} \`{${keys.join(', ')}}\``;
    }
  }

  // For multiple configs, just show the count
  return `${levelSymbol} \`[${config.length} configs]\``;
}

async function main() {
  console.log('Analyzing lint configurations...\n');
  console.log('Extracting ESLint rules...');

  // Get rules from both configs
  const eslintRules = extractESLintRules(eslintConfig);
  console.log(`Found ${Object.keys(eslintRules).length} ESLint rules`);

  console.log('Extracting XO rules (this may take a moment)...');
  const xoRules = await getXOCompleteRules();
  console.log(`Found ${Object.keys(xoRules).length} XO rules`);

  // Combine all unique rule names
  const allRules = new Set([
    ...Object.keys(eslintRules),
    ...Object.keys(xoRules)
  ]);

  // Sort rules alphabetically, but group by plugin
  const sortedRules = Array.from(allRules).sort((a, b) => {
    // Extract plugin names
    const getPrefix = (rule) => {
      if (rule.includes('/')) return rule.split('/')[0];
      if (rule.startsWith('@')) return rule.split('/')[0];
      return ''; // Core ESLint rules
    };

    const prefixA = getPrefix(a);
    const prefixB = getPrefix(b);

    // Sort by prefix first, then by rule name
    if (prefixA !== prefixB) {
      // Core rules first
      if (prefixA === '') return -1;
      if (prefixB === '') return 1;
      return prefixA.localeCompare(prefixB);
    }
    return a.localeCompare(b);
  });

  // Generate markdown table
  let markdown = `# Complete ESLint vs XO Rules Comparison

Generated on: ${new Date().toISOString()}

## Legend
- ✅ = Rule enabled (error level)
- ⚠️ = Rule enabled (warning level)
- ❌ = Rule explicitly disabled
- Configuration values shown in backticks when customized
- Empty cell = Rule not configured in this config

## Summary Statistics

- **Total unique rules**: ${sortedRules.length}
- **ESLint config rules**: ${Object.keys(eslintRules).length}
- **XO config rules**: ${Object.keys(xoRules).length}
- **Rules in both configs**: ${sortedRules.filter(r => eslintRules[r] !== undefined && xoRules[r] !== undefined).length}
- **ESLint-only rules**: ${sortedRules.filter(r => eslintRules[r] !== undefined && xoRules[r] === undefined).length}
- **XO-only rules**: ${sortedRules.filter(r => eslintRules[r] === undefined && xoRules[r] !== undefined).length}

## Complete Rules Table

| Rule Name | eslint.config.js | xo.config.js | Documentation |
|-----------|------------------|--------------|---------------|
`;

  let currentPrefix = '';
  for (const rule of sortedRules) {
    // Add section headers for plugin groups
    const prefix = rule.includes('/') ? rule.split('/')[0] : (rule.startsWith('@') ? rule.split('/')[0] : 'core');
    if (prefix !== currentPrefix) {
      currentPrefix = prefix;
      // Add a visual separator
      const prefixName = prefix === 'core' ? 'Core ESLint Rules' : `Plugin: ${prefix}`;
      markdown += `| **${prefixName}** | | | |\n`;
    }

    const eslintValue = eslintRules[rule];
    const xoValue = xoRules[rule];

    const eslintDisplay = eslintValue !== undefined ? simplifyConfig(eslintValue) : '';
    const xoDisplay = xoValue !== undefined ? simplifyConfig(xoValue) : '';
    const link = `[📖](${getRuleLink(rule)})`;

    markdown += `| \`${rule}\` | ${eslintDisplay} | ${xoDisplay} | ${link} |\n`;
  }

  markdown += `
## Key Differences

### Rules Only in eslint.config.js
${sortedRules.filter(r => eslintRules[r] !== undefined && xoRules[r] === undefined).map(r => `- \`${r}\``).join('\n') || 'None'}

### Rules Only in xo.config.js
${sortedRules.filter(r => eslintRules[r] === undefined && xoRules[r] !== undefined).map(r => `- \`${r}\``).join('\n').substring(0, 2000) + (sortedRules.filter(r => eslintRules[r] === undefined && xoRules[r] !== undefined).length > 20 ? '\n... and more' : '') || 'None'}

### Conflicting Rules (Different Settings)
${sortedRules.filter(r => {
  const e = eslintRules[r];
  const x = xoRules[r];
  if (e === undefined || x === undefined) return false;
  return JSON.stringify(e) !== JSON.stringify(x);
}).map(r => `- \`${r}\`: ESLint=${simplifyConfig(eslintRules[r])} vs XO=${simplifyConfig(xoRules[r])}`).join('\n') || 'None'}
`;

  // Write to compare.md
  await fs.writeFile(join(__dirname, 'compare.md'), markdown);
  console.log('\n✅ Comparison table written to compare.md');
  console.log(`📊 Analyzed ${sortedRules.length} total unique rules`);
  console.log(`🔍 ${sortedRules.filter(r => eslintRules[r] !== undefined && xoRules[r] !== undefined).length} rules configured in both`);
  console.log(`📝 ${sortedRules.filter(r => eslintRules[r] !== undefined && xoRules[r] === undefined).length} ESLint-only rules`);
  console.log(`🎯 ${sortedRules.filter(r => eslintRules[r] === undefined && xoRules[r] !== undefined).length} XO-only rules`);
}

main().catch(console.error);