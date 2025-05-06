const directionMap = {
    N: { L: 'W', R: 'E', dx: 0, dy: 1 },
    E: { L: 'N', R: 'S', dx: 1, dy: 0 },
    S: { L: 'E', R: 'W', dx: 0, dy: -1 },
    W: { L: 'S', R: 'N', dx: -1, dy: 0 },
};
const config = {
  preventCollision: true,  // Disallow two robots occupying the same position
  preventRetrace: false    // Disallow stepping on any position visited by earlier robots
};

function simulate(plateau, robots, robotPositions) {
    const results = [];

    for (let robot of robots) {
        let { x, y, dir } = robot.start;

        for (let inst of robot.instructions) {
            if (inst === 'L' || inst === 'R') {
                dir = directionMap[dir][inst];
            } else if (inst === 'M') {
                const move = directionMap[dir];
                const newX = x + move.dx;
                const newY = y + move.dy;
                const newKey = `${newX},${newY}`;

                // Check bounds
                const withinBounds = newX >= 0 && newX <= plateau.maxX && newY >= 0 && newY <= plateau.maxY;
                let collision = false;
                if (config.preventCollision) {
                   collision = robotPositions.has(newKey);
                 }


                if (withinBounds && !collision) {
                  // If preventRetrace is false, robot can reuse a cell previously visited
                  if (!config.preventRetrace) {
                    robotPositions.delete(`${x},${y}`); // Remove old
                  }

                  // robotPositions: Set of current robot locations (final positions only)
                    robotPositions.add(newKey);         // Add new
                    x = newX;
                    y = newY;
                } // else: skip move silently
            }
        }

        results.push(`${x} ${y} ${dir}`);
    }

    return results;
}

module.exports = { simulate,config };
