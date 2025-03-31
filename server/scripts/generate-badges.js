#!/usr/bin/env node

/**
 * This script generates coverage badges for the README based on the coverage report.
 * It should be run after the tests have been executed with coverage.
 */

const fs = require('fs');
const path = require('path');

try {
  // Read the coverage summary
  const coveragePath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');
  
  if (!fs.existsSync(coveragePath)) {
    console.error('Coverage report not found. Run tests with coverage first.');
    process.exit(1);
  }
  
  const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  const total = coverageData.total;
  
  // Colors for badges
  const getColor = (percentage) => {
    if (percentage >= 90) return 'brightgreen';
    if (percentage >= 80) return 'green';
    if (percentage >= 70) return 'yellowgreen';
    if (percentage >= 60) return 'yellow';
    if (percentage >= 50) return 'orange';
    return 'red';
  };
  
  // Generate badge markdown
  const badgeTemplate = (type, percentage, color) => {
    return `[![${type}](https://img.shields.io/badge/${type.toLowerCase()}-${percentage}%25-${color}.svg?style=flat)](https://codecov.io/gh/[your-org]/msc-admin-assist)`;
  };
  
  const statements = Math.round(total.statements.pct * 100) / 100;
  const branches = Math.round(total.branches.pct * 100) / 100;
  const functions = Math.round(total.functions.pct * 100) / 100;
  const lines = Math.round(total.lines.pct * 100) / 100;
  
  const badges = [
    badgeTemplate('Statements', statements, getColor(statements)),
    badgeTemplate('Branches', branches, getColor(branches)),
    badgeTemplate('Functions', functions, getColor(functions)),
    badgeTemplate('Lines', lines, getColor(lines)),
  ];
  
  // Read README
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  // Update badges in README
  const badgeRegex = /\[\!\[Statements\].*\[\!\[Lines\].*\)/s;
  const badgeSection = badges.join('\n');
  
  if (badgeRegex.test(readmeContent)) {
    readmeContent = readmeContent.replace(badgeRegex, badgeSection);
  } else {
    const titleEndIndex = readmeContent.indexOf('\n\n');
    readmeContent = readmeContent.slice(0, titleEndIndex + 2) + 
      '[![CI](https://github.com/[your-org]/msc-admin-assist/actions/workflows/ci.yml/badge.svg)](https://github.com/[your-org]/msc-admin-assist/actions/workflows/ci.yml)\n' +
      '[![codecov](https://codecov.io/gh/[your-org]/msc-admin-assist/branch/main/graph/badge.svg)](https://codecov.io/gh/[your-org]/msc-admin-assist)\n' +
      badgeSection + '\n\n' + 
      readmeContent.slice(titleEndIndex + 2);
  }
  
  // Write updated README
  fs.writeFileSync(readmePath, readmeContent);
  
  console.log('Coverage badges updated in README.md');
} catch (error) {
  console.error('Error generating badges:', error);
  process.exit(1);
} 