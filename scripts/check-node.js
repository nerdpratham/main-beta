#!/usr/bin/env node
const requiredMajor = 18;
const current = process.versions.node.split('.')[0];
if (Number(current) < requiredMajor) {
  console.warn('\n⚠️  Node ' + requiredMajor + '+ is recommended. Current: ' + process.version + '\n');
  console.warn('Install via nvm: `nvm install ' + requiredMajor + '` then `nvm use ' + requiredMajor + '`\n');
} else {
  console.log('Node version ' + process.version + ' OK.');
}
process.exit(0);
