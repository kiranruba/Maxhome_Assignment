Mars Rover Simulator

A Node.js simulation of autonomous Mars rovers navigating a rectangular plateau. The rovers execute movement instructions while avoiding collisions and optionally conserving resources by not retracing paths.

#Features

- Handles multiple rovers independently
- Collision prevention (critical for safety)
- Boundary enforcement (no rover leaves the plateau)
- Optional resource optimization via path retrace prevention
- Strict input validation with flexible formatting
- Configurable simulation rules
- Unit-tested with edge cases covered

Assumptions & Design Decisions

Critical Assumptions

#Collision is not allowed

- Two rovers cannot occupy the same cell.
- This prevents real-world physical collisions, critical for costly Mars missions.
- Movements that would result in a collision are skipped.

#Boundary is enforced

- Rovers must stay within the grid.
- No movement is allowed beyond the plateau’s defined upper-right coordinate.
- Attempts to move outside are safely ignored.

#Plateau size format

- Input requires an upper-right coordinate (e.g., 5 5).
- Coordinates like (x, 0) or (0, y) are not accepted.
- The plateau must be at least 1x1 in size.

#Flexible input format

- Input allows:

    Lowercase letters (lmr)
    Extra/multiple spaces between instructions
    This improves usability and robustness.

#Strict validation:

- Any malformed or invalid input triggers an error.
  This ensures predictable and safe simulation behavior.

Optional Enhancements

#Path Retrace Prevention
In real-world missions (e.g., Europa exploration), retracing paths wastes energy.

- When enabled, rovers skip instructions that would move them to a cell they already visited.
- This simulates resource optimization, useful for battery- or time-limited missions.
- Great for future multi-rover coverage scenarios.

Configuration Flags (in src/simulator.js)

        module.exports = {
        preventCollision: true,  // Prevents rovers from crashing into each other
        preventRetrace: true     // Avoids repeating the same path (resource-saving)
        }


        Why these flags?


        | Flag               | Purpose                                       | Default |
        | ------------------ | --------------------------------------------- | ------- |
        | `preventCollision` | Avoids real-world failures and ensures safety | `true`  |
        | `preventRetrace`   | Simulates intelligent navigation              | `false`  |


Folder Structure

.
├── input/
│   └── input.txt              # User input for plateau and rover commands
├── src/
│   ├── simulator.js           # Core simulation logic
│   ├── validator.js           # Input validation
│   └── parser.js              # Input parsing
├── tests/
│   ├── simulator.test.js
│   ├── validator.test.js
│   └── parser.test.js
├── index.js                   # Entry point
├── .nvmrc                     # Node.js version config
└── README.md


How to Use

Clone the repo
git clone https://github.com/kiranruba/MaxHome_TakeHome.git
cd MaxHome_TakeHome


Step 1: Add Input
Edit input.txt:
5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM

Step 2: Run the Simulator
npm install
npm start

Step 3: Output
Will be printed in the terminal:
['1 3 N', '5 1 E']

Testing
Run all tests using:
npm test

Covers:

- Valid & invalid inputs
- Out-of-bound scenarios
- Collision logic
- Retrace prevention logic

Node.js Version
⚠️ Recommended Node.js version: 22.13.1
If using nvm:

nvm use
.nvmrc is included to match the project version automatically.
