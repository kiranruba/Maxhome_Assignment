const { simulate } = require('../src/simulator');

describe('simulate - Mars Rover movement', () => {
  const plateau = { maxX: 5, maxY: 5 };

  it('should move and rotate correctly - basic case', () => {
    const robots = [
      {
        start: { x: 1, y: 2, dir: 'N' },
        instructions: 'LMLMLMLMM'
      }
    ];
    const robotPositions = new Set(['1,2']); // initial position
    const output = simulate(plateau, robots, robotPositions);
    expect(output).toEqual(['1 3 N']);
  });

  it('should move robots normally within bounds with no collisions', () => {
  const plateau = { maxX: 5, maxY: 5 };
  const robots = [
    { start: { x: 1, y: 2, dir: 'N' }, instructions: 'LMLMLMLMM' },
    { start: { x: 3, y: 3, dir: 'E' }, instructions: 'MMRMMRMRRM' }
  ];
  const robotPositions = new Set(['1,2', '3,3']);
  const result = simulate(plateau, robots, robotPositions);
  expect(result).toEqual(['1 3 N', '5 1 E']);
});

  it('should skip moves that go out of bounds', () => {
    const robots = [
      {
        start: { x: 0, y: 0, dir: 'S' },
        instructions: 'MMM'
      }
    ];
    const robotPositions = new Set(['0,0']);
    const output = simulate(plateau, robots, robotPositions);
    expect(output).toEqual(['0 0 S']);
  });

  it('should not move robot outside plateau boundaries for 2 Robots', () => {
  const plateau = { maxX: 2, maxY: 2 };
  const robots = [
    { start: { x: 2, y: 2, dir: 'N' }, instructions: 'M' },
    { start: { x: 0, y: 0, dir: 'S' }, instructions: 'M' }
  ];
  const robotPositions = new Set(['2,2', '0,0']);

  const result = simulate(plateau, robots, robotPositions);
  expect(result).toEqual(['2 2 N', '0 0 S']); // Both moves blocked by edge
});

it('should not move robot outside plateau boundaries - all four directions edge case', () => {
const plateau = { maxX: 1, maxY: 1 };
const robots = [
  { start: { x: 0, y: 0, dir: 'N' }, instructions: 'MMLMRMRMMRMMMRM' },
];
const robotPositions = new Set(['0,0']);

const result = simulate(plateau, robots, robotPositions);
expect(result).toEqual(['0 0 W']); // Both moves blocked by edge
});

it('should not move robot outside plateau boundaries - only M instructions', () => {
const plateau = { maxX: 1, maxY: 5 };
const robots = [
  { start: { x: 0, y: 1, dir: 'N' }, instructions: 'MMMMMMMMM' },
];
const robotPositions = new Set(['0,0']);

const result = simulate(plateau, robots, robotPositions);
expect(result).toEqual(['0 5 N']); // Both moves blocked by edge
});

it('should not move robot outside plateau boundaries - only LR instructions', () => {
const plateau = { maxX: 1, maxY: 5 };
const robots = [
  { start: { x: 0, y: 1, dir: 'N' }, instructions: 'LLRRLLRRLRLR' },
];
const robotPositions = new Set(['0,0']);

const result = simulate(plateau, robots, robotPositions);
expect(result).toEqual(['0 1 N']); // Both moves blocked by edge
});

it('should handle complex turning and movement', () => {
  const plateau = { maxX: 10, maxY: 10 };
  const robots = [
    { start: { x: 2, y: 2, dir: 'N' }, instructions: 'MRMLMRM' },
  ];
  const robotPositions = new Set(['2,2']);
  const result = simulate(plateau, robots, robotPositions);
  expect(result).toEqual(['4 4 E']);
});

it('should allow retracing its own path if preventRetrace is false', () => {
  const plateau = { maxX: 5, maxY: 5 };
  const robots = [
    { start: { x: 1, y: 1, dir: 'N' }, instructions: 'MMRRM' } // N→(1,3), E→(1,3), S→(1,2)
  ];
  const robotPositions = new Set(['1,1']);
  const result = simulate(plateau, robots, robotPositions);
  expect(result).toEqual(['1 2 S']); // retraces own cell (1,2)
});

  it('should prevent collision if enabled', () => {
    const robots = [
      {
        start: { x: 1, y: 2, dir: 'N' },
        instructions: 'MM'
      },
      {
        start: { x: 1, y: 3, dir: 'S' },
        instructions: 'M'
      }
    ];
    const robotPositions = new Set(['1,2', '1,3']);
    const output = simulate(plateau, robots, robotPositions);
    expect(output).toEqual(['1 2 N', '1 3 S']); // Second robot blocked from moving into 1 2
  });

  it('should prevent retracing if config.preventRetrace is true', () => {
    const { simulate } = require('../src/simulator');
    const plateau = { maxX: 5, maxY: 5 };
    const robots = [
      { start: { x: 1, y: 2, dir: 'N' }, instructions: 'MM' }, // goes to 1,3
      { start: { x: 1, y: 1, dir: 'N' }, instructions: 'MM' }  // same path
    ];
    const robotPositions = new Set(['1,2','1,1']);

    // Temporarily modify config
    const original = require('../src/simulator').config;
    original.preventRetrace = true;

    const result = simulate(plateau, robots, robotPositions);
    expect(result).toEqual(['1 4 N', '1 1 N']); // second robot can't retrace

    original.preventRetrace = false; // Reset
  });

  it('should retrace if config.preventRetrace is false - same input but different output for preventRetrace = false', () => {
    const { simulate } = require('../src/simulator');
    const plateau = { maxX: 5, maxY: 5 };
    const robots = [
      { start: { x: 1, y: 2, dir: 'N' }, instructions: 'MM' }, // goes to 1,3
      { start: { x: 1, y: 1, dir: 'N' }, instructions: 'MM' }  // same path
    ];
    const robotPositions = new Set(['1,2', '1,1']);


    const result = simulate(plateau, robots, robotPositions);
    expect(result).toEqual(['1 4 N', '1 3 N']); // second robot can't retrace

  });

  it('10 robots collide when preventCollision is true', () => {
  const plateau = { maxX: 5, maxY: 5 };
  const robotPositions = new Set();

  const robots = [
    { start: { x: 2, y: 0, dir: 'N' }, instructions: 'MM' },
    { start: { x: 2, y: 4, dir: 'S' }, instructions: 'MM' },
    { start: { x: 0, y: 2, dir: 'E' }, instructions: 'MM' },
    { start: { x: 4, y: 2, dir: 'W' }, instructions: 'MM' },
    { start: { x: 1, y: 1, dir: 'N' }, instructions: 'MRM' },
    { start: { x: 3, y: 1, dir: 'N' }, instructions: 'MLM' },
    { start: { x: 1, y: 3, dir: 'S' }, instructions: 'MRM' },
    { start: { x: 3, y: 3, dir: 'S' }, instructions: 'MLM' },
    { start: { x: 2, y: 1, dir: 'N' }, instructions: 'M' },
    { start: { x: 2, y: 3, dir: 'S' }, instructions: 'M' }
  ];


  const result = simulate(plateau, robots, robotPositions);

  // Only the first robot gets to 2 2, others are blocked mid-way
  expect(result.filter(r => r.startsWith('2 2'))).toHaveLength(1);
});
it('10 robots overlap on same cell when preventCollision is false', () => {
  const plateau = { maxX: 5, maxY: 5 };
  const robotPositions = new Set();

  const robots = [
    { start: { x: 2, y: 0, dir: 'N' }, instructions: 'MM' },
    { start: { x: 2, y: 4, dir: 'S' }, instructions: 'MM' },
    { start: { x: 0, y: 2, dir: 'E' }, instructions: 'MM' },
    { start: { x: 4, y: 2, dir: 'W' }, instructions: 'MM' },
    { start: { x: 1, y: 1, dir: 'N' }, instructions: 'MRM' },
    { start: { x: 3, y: 1, dir: 'N' }, instructions: 'MLM' },
    { start: { x: 1, y: 3, dir: 'S' }, instructions: 'MLM' },
    { start: { x: 3, y: 3, dir: 'S' }, instructions: 'MRM' },
    { start: { x: 2, y: 1, dir: 'N' }, instructions: 'M' },
    { start: { x: 2, y: 3, dir: 'S' }, instructions: 'M' }
  ];
  // Temporarily modify config
  const original = require('../src/simulator').config;
  original.preventCollision = false;

  const result = simulate(plateau, robots, robotPositions);


  // All reach 2 2 despite overlap
  expect(result.filter(r => r.startsWith('2 2'))).toHaveLength(10);
  original.preventCollision = true;
});
it('multiple Robots stop at plateau boundary', () => {
  const plateau = { maxX: 5, maxY: 5 };
  const robotPositions = new Set();

  const robots = [
    { start: { x: 0, y: 0, dir: 'S' }, instructions: 'M' }, // Can't move south
    { start: { x: 5, y: 5, dir: 'N' }, instructions: 'M' }, // Can't move north
    { start: { x: 0, y: 0, dir: 'W' }, instructions: 'M' }, // Can't move west
    { start: { x: 5, y: 5, dir: 'E' }, instructions: 'M' }, // Can't move east
  ];


  const result = simulate(plateau, robots, robotPositions);
  expect(result).toEqual([
    '0 0 S',
    '5 5 N',
    '0 0 W',
    '5 5 E'
  ]);
});

it('Only first robot reaches shared destination with preventCollision: true', () => {
  const plateau = { maxX: 5, maxY: 5 };
  const robotPositions = new Set();

  const robots = [
    { start: { x: 2, y: 0, dir: 'N' }, instructions: 'MM' }, // reaches 2 2
    { start: { x: 0, y: 2, dir: 'E' }, instructions: 'MM' }, // blocked at 1 2
    { start: { x: 4, y: 2, dir: 'W' }, instructions: 'MM' }, // blocked at 3 2
  ];

  const result = simulate(plateau, robots, robotPositions);
  expect(result).toEqual([
    '2 2 N',
    '1 2 E',
    '3 2 W'
  ]);
});
it('10 robots with mixed directions and collisions', () => {
  const plateau = { maxX: 5, maxY: 5 };
  const robotPositions = new Set();

  const robots = [
    { start: { x: 0, y: 0, dir: 'N' }, instructions: 'MMRMM' },
    { start: { x: 5, y: 5, dir: 'S' }, instructions: 'MMLMM' },
    { start: { x: 0, y: 5, dir: 'E' }, instructions: 'RRMM' },
    { start: { x: 5, y: 0, dir: 'W' }, instructions: 'MM' },
    { start: { x: 1, y: 1, dir: 'N' }, instructions: 'MRMRM' },
    { start: { x: 2, y: 3, dir: 'S' }, instructions: 'MM' },
    { start: { x: 4, y: 2, dir: 'W' }, instructions: 'M' },
    { start: { x: 1, y: 4, dir: 'S' }, instructions: 'MM' },
    { start: { x: 3, y: 3, dir: 'S' }, instructions: 'MM' },
    { start: { x: 2, y: 0, dir: 'N' }, instructions: 'MMM' }
  ];


  const result = simulate(plateau, robots, robotPositions);

  expect(result).toEqual([
    '2 2 E',
    '5 3 E',
    '0 5 W',
    '3 0 W',
    '1 1 S',
    '2 3 S',
    '3 2 W',
    '1 2 S',
    '3 3 S',
    '2 1 N'
  ]);
});

});
