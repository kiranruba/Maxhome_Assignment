const fs = require('fs');
const {validateRequirement, validatePlateau, validateRobotPosition, validateMovementInstructions} = require('./validator');

function parseInput(input) {
    const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    validateRequirement(lines); // Validate minimimum Requirement
    const plateauCoords = lines.shift().trim().split(/\s+/);
    validatePlateau(plateauCoords); // Validate Plateaus coordinates
    const maxX = parseInt(plateauCoords[0], 10);
    const maxY = parseInt(plateauCoords[1], 10);

    const plateau = { maxX,maxY};

    const robotPositions = new Set();

    const robots = [];
    for (let i = 0; i < lines.length; i += 2) {
        const [x, y, dirRaw,...extras] = lines[i].trim().split(/\s+/);
        const dir = (dirRaw || '').toUpperCase();
        const xNum = Number(x);
        const yNum = Number(y);
        const positionKey = `${xNum},${yNum}`;
        const collisionFlag=robotPositions.has(positionKey);
        validateRobotPosition(x, y, dir, plateau, i,collisionFlag,extras); // Validate Robot positions
        robotPositions.add(positionKey);

        const instructions = lines[i + 1];
        validateMovementInstructions(instructions, i); // Validate movement instructions

        robots.push({ start: { x: xNum, y: yNum, dir },
            instructions: instructions.trim().toUpperCase()
        });

    }

    return {plateau,robots,robotPositions};
}


module.exports = {
    parseInput
};
