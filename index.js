const fs = require('fs');
const path = require('path');
const { parseInput } = require('./src/parser');
const { simulate  } = require('./src/simulator');

const inputPath = path.join(__dirname, 'input', 'input.txt');
const input = fs.readFileSync(inputPath, 'utf8');
const {  robots, robotPositions } = parseInput(input);
const results = simulate( robots, robotPositions);

console.log(results.join('\n'));
