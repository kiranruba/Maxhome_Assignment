//Validate input for minimimum Requirement
const validateRequirement = (lines) => {
    if (lines.length < 3) {
        throw new Error("Invalid input: A minimum of 3 lines are required. Plateau and robot positions must be specified.");
    }
    if ((lines.length ) % 3 !== 0) {
        throw new Error("Invalid input: Robot positions and movement instructions must come in pairs, along with plateau coordinates. Ensure the plateau coordinates are provided, and every robot has a corresponding set of movement instructions.");
    }
}

// Validate plateau coordinates
const validatePlateau = (coords) => {
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
        throw new Error(`Invalid plateau coordinates: ${coords[0]}, ${coords[1]} at line 1. Ensure the coordinates consist of two numbers, representing the x and y dimensions of the plateau.`);
    }

    if (coords[0] < 1 || coords[1] < 1) {
       throw new Error('Invalid plateau dimensions: Both x and y coordinates must be greater than zero.');
   }
};
// Validate robot position
const validateRobotPosition = (xRaw, yRaw, direction,fuelRaw, plateau, line, collisionFlag, extras) => {
    const validDirections = ['N', 'E', 'S', 'W'];
    const x = Number(xRaw);
    const y = Number(yRaw);
    const fuel=Number(fuelRaw)

    if (xRaw.trim() === '' || yRaw.trim() === '' || direction.trim() === '') {
      throw new Error(`Invalid robot position at line ${line + 2}. Must include two coordinates and a direction.`);
    }
    if ( extras.length > 0) {
      throw new Error(`Invalid robot position at line ${line + 2}. Format must be: X Y D , with no extra values.`);
    }
    // Ensure coordinates are positive numbers
    if (isNaN(x) || isNaN(y)) {
        throw new Error(`Invalid robot coordinates: ${xRaw}, ${yRaw} at line ${line + 2}. Coordinates must be numeric values.`);
    }
    if (isNaN(fuel)) {
        throw new Error(`Invalid robot fuel value: ${fuelRaw} at line ${line + 2}. fuel must be numeric values.`);
    }
    if(fuel <1){
      throw new Error(`Robot fuel not suffient ${fuelRaw} at line ${line + 2}. fuel must be greater than zero`);

    }

    // Ensure coordinates are within plateau
    if (x < 0 || x > plateau.maxX || y < 0 || y > plateau.maxY) {
        throw new Error(`Robot position out of bounds: ${xRaw}, ${yRaw} at line ${line + 2}. Ensure robot coordinates are within the plateau's defined boundaries.`);
    }

    if (collisionFlag) {
        throw new Error(`Duplicate starting position detected for robots at ${xRaw}, ${yRaw}. Each robot must start at a unique position.`);
      }
    // Ensure valid direction
    if (!validDirections.includes((direction || '').toUpperCase())) {
        throw new Error(`Invalid direction: ${direction} at line ${line + 2}. Allowed directions are N, E, S, W.`);
    }
};
// Validate movement instructions
const validateMovementInstructions = (instructions, line) => {
    const validInstructions = ['L', 'R', 'M'];
    for (let inst of instructions) {
        if (!validInstructions.includes(inst.toUpperCase())) {
            throw new Error(`Invalid movement instruction: ${inst} at line ${line + 2}. Valid instructions are L (Left), R (Right), M (Move).`);
        }
    }

};

module.exports = {
    validateRequirement,
    validatePlateau,
    validateRobotPosition,
    validateMovementInstructions
};
