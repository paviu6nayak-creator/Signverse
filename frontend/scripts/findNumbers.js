import fs from 'fs';

const content = fs.readFileSync('./src/data/lessons.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Number 11') || lines[i].includes('Number 12') || lines[i].includes('11-20')) {
    console.log(`Match around line ${i + 1}:`);
    for (let j = Math.max(0, i - 5); j <= Math.min(lines.length - 1, i + 25); j++) {
      console.log(`${j + 1}: ${lines[j]}`);
    }
    break;
  }
}
