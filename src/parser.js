const fs = require('fs');
const {validateRequirement, validatePlateau, validateRobotPosition, validateMovementInstructions} = require('./validator');

function parseInput(input) {
     const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
     validateRequirement(lines); // Validate minimimum Requirement
    const robotPositions = new Set();

    const robots = [];
    for (let i = 0; i < lines.length; i += 3) {


      const plateauCoords= lines[i].trim().split(/\s+/);

      validatePlateau(plateauCoords); // Validate Plateaus coordinates
      const maxX = parseInt(plateauCoords[0], 10);
      const maxY = parseInt(plateauCoords[1], 10);
        const [x, y, dirRaw, fuel, ...extras] = lines[i+1].trim().split(/\s+/);
        const dir = (dirRaw || '').toUpperCase();
        const xNum = Number(x);
        const yNum = Number(y);
        const fuelNum = Number(fuel);
        const positionKey = `${xNum},${yNum}`;
        const collisionFlag=robotPositions.has(positionKey);
        const plateau = { maxX,maxY};
        validateRobotPosition(x, y, dir, fuel,plateau , i,collisionFlag,extras); // Validate Robot positions
        robotPositions.add(positionKey);

        const instructions = lines[i + 2];
        validateMovementInstructions(instructions, i); // Validate movement instructions

        robots.push({
            plateau:{maxX:maxX, maxY:maxY},
            start: { x: xNum, y: yNum, dir , fuel},
            instructions: instructions.trim().toUpperCase()
        });

    }

    return {robots,robotPositions};
}


module.exports = {
    parseInput
};
