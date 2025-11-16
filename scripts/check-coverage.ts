#!/usr/bin/env bun

import { readFileSync, existsSync } from 'fs';

const THRESHOLDS = {
  lines: 70,
  functions: 70,
  branches: 65,
  statements: 70,
};

const coverageFiles = [
  'apps/api/coverage/coverage-summary.json',
  'packages/adapters/coverage/coverage-summary.json',
];

let totalLines = 0;
let totalCoveredLines = 0;
let totalFunctions = 0;
let totalCoveredFunctions = 0;
let totalBranches = 0;
let totalCoveredBranches = 0;
let totalStatements = 0;
let totalCoveredStatements = 0;

console.log('\n📊 Checking Coverage Thresholds...\n');

for (const file of coverageFiles) {
  if (!existsSync(file)) {
    console.warn(`⚠️  Coverage file not found: ${file}`);
    console.warn(`   Run "bun run test:coverage" first to generate coverage reports.\n`);
    continue;
  }

  const coverage = JSON.parse(readFileSync(file, 'utf-8'));
  const total = coverage.total;

  totalLines += total.lines.total;
  totalCoveredLines += total.lines.covered;
  totalFunctions += total.functions.total;
  totalCoveredFunctions += total.functions.covered;
  totalBranches += total.branches.total;
  totalCoveredBranches += total.branches.covered;
  totalStatements += total.statements.total;
  totalCoveredStatements += total.statements.covered;

  console.log(`✓ Loaded coverage from: ${file}`);
}

if (totalLines === 0) {
  console.error('\n❌ No coverage data found!');
  console.error('   Please run "bun run test:coverage" before checking thresholds.\n');
  process.exit(1);
}

const linesPct = (totalCoveredLines / totalLines) * 100;
const functionsPct = (totalCoveredFunctions / totalFunctions) * 100;
const branchesPct = (totalCoveredBranches / totalBranches) * 100;
const statementsPct = (totalCoveredStatements / totalStatements) * 100;

console.log('\n📈 Overall Coverage:');
console.log(`   Lines:      ${linesPct.toFixed(2)}% (${totalCoveredLines}/${totalLines})`);
console.log(`   Functions:  ${functionsPct.toFixed(2)}% (${totalCoveredFunctions}/${totalFunctions})`);
console.log(`   Branches:   ${branchesPct.toFixed(2)}% (${totalCoveredBranches}/${totalBranches})`);
console.log(`   Statements: ${statementsPct.toFixed(2)}% (${totalCoveredStatements}/${totalStatements})`);

const failures: string[] = [];

if (linesPct < THRESHOLDS.lines) {
  failures.push(`Lines: ${linesPct.toFixed(2)}% < ${THRESHOLDS.lines}%`);
}
if (functionsPct < THRESHOLDS.functions) {
  failures.push(`Functions: ${functionsPct.toFixed(2)}% < ${THRESHOLDS.functions}%`);
}
if (branchesPct < THRESHOLDS.branches) {
  failures.push(`Branches: ${branchesPct.toFixed(2)}% < ${THRESHOLDS.branches}%`);
}
if (statementsPct < THRESHOLDS.statements) {
  failures.push(`Statements: ${statementsPct.toFixed(2)}% < ${THRESHOLDS.statements}%`);
}

if (failures.length > 0) {
  console.log('\n🎯 Required Thresholds:');
  console.log(`   Lines:      ${THRESHOLDS.lines}%`);
  console.log(`   Functions:  ${THRESHOLDS.functions}%`);
  console.log(`   Branches:   ${THRESHOLDS.branches}%`);
  console.log(`   Statements: ${THRESHOLDS.statements}%`);

  console.error('\n❌ Coverage thresholds not met:');
  failures.forEach(f => console.error(`   ${f}`));
  console.error('');
  process.exit(1);
}

console.log('\n✅ All coverage thresholds met!\n');
process.exit(0);
