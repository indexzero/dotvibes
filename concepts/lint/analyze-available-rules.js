#!/usr/bin/env node

import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import node from 'eslint-plugin-node';
import nodeImport from 'eslint-plugin-node-import';

// Get all available rules from each plugin
function getPluginRules(plugin, prefix) {
  const rules = [];

  if (plugin.rules) {
    for (const ruleName of Object.keys(plugin.rules)) {
      rules.push(`${prefix}/${ruleName}`);
    }
  }

  return rules;
}

console.log('Available rules from ESLint plugins:\n');

// Get rules from each plugin
const importRules = getPluginRules(importPlugin, 'import');
const jsdocRules = getPluginRules(jsdoc, 'jsdoc');
const nodeRules = getPluginRules(node, 'node');
const nodeImportRules = getPluginRules(nodeImport, 'node-import');

console.log(`eslint-plugin-import: ${importRules.length} rules available`);
console.log(`eslint-plugin-jsdoc: ${jsdocRules.length} rules available`);
console.log(`eslint-plugin-node: ${nodeRules.length} rules available`);
console.log(`eslint-plugin-node-import: ${nodeImportRules.length} rules available`);

const totalAvailable = importRules.length + jsdocRules.length + nodeRules.length + nodeImportRules.length;
console.log(`\nTotal plugin rules available: ${totalAvailable}`);

// Import the ESLint config to see which are actually configured
const eslintConfig = (await import('./eslint.config.js')).default;
const configuredRules = Object.keys(eslintConfig[0].rules || {});

console.log(`Total rules configured in eslint.config.js: ${configuredRules.length}`);

// Check which plugin rules are configured vs available
const configuredImport = configuredRules.filter(r => r.startsWith('import/')).length;
const configuredJsdoc = configuredRules.filter(r => r.startsWith('jsdoc/')).length;
const configuredNode = configuredRules.filter(r => r.startsWith('node/')).length;
const configuredNodeImport = configuredRules.filter(r => r.startsWith('node-import/')).length;

console.log('\nPlugin rule usage:');
console.log(`- import: ${configuredImport}/${importRules.length} configured`);
console.log(`- jsdoc: ${configuredJsdoc}/${jsdocRules.length} configured`);
console.log(`- node: ${configuredNode}/${nodeRules.length} configured`);
console.log(`- node-import: ${configuredNodeImport}/${nodeImportRules.length} configured`);

console.log('\n---');
console.log('This explains the difference:');
console.log('- ESLint config: Only explicitly configures 22 rules');
console.log('- XO config: Comes with 428 rules pre-configured');
console.log(`- The ESLint config COULD configure ${totalAvailable}+ plugin rules but chooses not to`);
console.log('- XO takes an opinionated "batteries included" approach with extensive defaults');