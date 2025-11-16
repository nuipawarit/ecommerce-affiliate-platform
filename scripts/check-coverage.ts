#!/usr/bin/env bun

import { readFileSync, existsSync } from 'fs';

const THRESHOLDS = {
  lines: 50,
  functions: 65,
  branches: 65,
  statements: 50,
};

const coverageFiles = [
  'apps/api/coverage/lcov.info',
  'packages/adapters/coverage/lcov.info',
];

interface CoverageData {
  lines: { total: number; covered: number };
  functions: { total: number; covered: number };
  branches: { total: number; covered: number };
  statements: { total: number; covered: number };
}

function parseLcov(content: string): CoverageData {
  const lines = content.split('\n');
  let totalLines = 0;
  let coveredLines = 0;
  let totalFunctions = 0;
  let coveredFunctions = 0;
  let totalBranches = 0;
  let coveredBranches = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('LF:')) {
      totalLines += parseInt(trimmed.substring(3), 10);
    } else if (trimmed.startsWith('LH:')) {
      coveredLines += parseInt(trimmed.substring(3), 10);
    } else if (trimmed.startsWith('FNF:')) {
      totalFunctions += parseInt(trimmed.substring(4), 10);
    } else if (trimmed.startsWith('FNH:')) {
      coveredFunctions += parseInt(trimmed.substring(4), 10);
    } else if (trimmed.startsWith('BRF:')) {
      totalBranches += parseInt(trimmed.substring(4), 10);
    } else if (trimmed.startsWith('BRH:')) {
      coveredBranches += parseInt(trimmed.substring(4), 10);
    }
  }

  return {
    lines: { total: totalLines, covered: coveredLines },
    functions: { total: totalFunctions, covered: coveredFunctions },
    branches: { total: totalBranches, covered: coveredBranches },
    statements: { total: totalLines, covered: coveredLines },
  };
}

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

  const content = readFileSync(file, 'utf-8');
  const coverage = parseLcov(content);

  totalLines += coverage.lines.total;
  totalCoveredLines += coverage.lines.covered;
  totalFunctions += coverage.functions.total;
  totalCoveredFunctions += coverage.functions.covered;
  totalBranches += coverage.branches.total;
  totalCoveredBranches += coverage.branches.covered;
  totalStatements += coverage.statements.total;
  totalCoveredStatements += coverage.statements.covered;

  console.log(`✓ Loaded coverage from: ${file}`);
}

if (totalLines === 0) {
  console.error('\n❌ No coverage data found!');
  console.error('   Please run "bun run test:coverage" before checking thresholds.\n');
  process.exit(1);
}

const linesPct = (totalCoveredLines / totalLines) * 100;
const functionsPct = (totalCoveredFunctions / totalFunctions) * 100;
const branchesPct = totalBranches > 0 ? (totalCoveredBranches / totalBranches) * 100 : 100;
const statementsPct = (totalCoveredStatements / totalStatements) * 100;

console.log('\n📈 Overall Coverage:');
console.log(`   Lines:      ${linesPct.toFixed(2)}% (${totalCoveredLines}/${totalLines})`);
console.log(`   Functions:  ${functionsPct.toFixed(2)}% (${totalCoveredFunctions}/${totalFunctions})`);
if (totalBranches > 0) {
  console.log(`   Branches:   ${branchesPct.toFixed(2)}% (${totalCoveredBranches}/${totalBranches})`);
} else {
  console.log(`   Branches:   N/A (no branch data)`);
}
console.log(`   Statements: ${statementsPct.toFixed(2)}% (${totalCoveredStatements}/${totalStatements})`);

const failures: string[] = [];

if (linesPct < THRESHOLDS.lines) {
  failures.push(`Lines: ${linesPct.toFixed(2)}% < ${THRESHOLDS.lines}%`);
}
if (functionsPct < THRESHOLDS.functions) {
  failures.push(`Functions: ${functionsPct.toFixed(2)}% < ${THRESHOLDS.functions}%`);
}
if (totalBranches > 0 && branchesPct < THRESHOLDS.branches) {
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
