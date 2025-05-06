const { parseInput } = require('../src/parser'); // Adjust path as needed

describe('parseInput', () => {
  it('should parse valid input and return correct structure', () => {
    const input = `5 5\n1 2 N\nLMLMLMLMM`;
    const result = parseInput(input);

    expect(result.plateau).toEqual({ maxX: 5, maxY: 5 });
    expect(result.robots.length).toBe(1);
    expect(result.robots[0].start).toEqual({ x: 1, y: 2, dir: 'N' });
    expect(result.robots[0].instructions).toBe('LMLMLMLMM');

  });

  it('should parse valid input and return correct structure for multiple robots', () => {
    const input = `5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM`;
  const result = parseInput(input);
  expect(result.robots.length).toBe(2);
  expect(result.robots[1].start).toEqual({ x: 3, y: 3, dir: 'E' });

  });


  it('should handle extra spaces in robot position', () => {
    const input = `5 5\n  3   3   E \n MMRMMRMRRM`;
    const result = parseInput(input);
    expect(result.robots[0].start).toEqual({ x: 3, y: 3, dir: 'E' });
  });
  it('should handle extra spaces in plateau', () => {
    const input = `5   5  \n3 3 E\n MMRMMRMRRM`;
    const result = parseInput(input);
    expect(result.robots[0].start).toEqual({ x: 3, y: 3, dir: 'E' });
  });
  it('should handle extra line in inputs', () => {
    const input = `5 5\n  3   3   E\n \n MMRMMRMRRM`;
    const result = parseInput(input);
    expect(result.robots[0].start).toEqual({ x: 3, y: 3, dir: 'E' });
  });

  it('should throw error if robot position has more than 3 values', () => {
    const input = `5 5\n1 2 1 N E\nLMLMLMLMM`;
    expect(() => parseInput(input)).toThrow(/extra/i);
  });

  it('should throw error if plateau has more than 3 values', () => {
    const input = `5 5                                      5\n1 2 1 N E\nLMLMLMLMM`;
    expect(() => parseInput(input)).toThrow(/Ensure the coordinates consist of two numbers/i);
  });


  it('should throw error if robot and instruction lines are not in pairs', () => {
    const input = `5 5\n1 1 2 N`;
    expect(() => parseInput(input)).toThrow('Invalid input: A minimum of 3 lines are required. Plateau and robot positions must be specified');
  });

  it('should throw error if robot and instruction lines are not in pairs with empty line in between', () => {
    const input = `5 5\n1 1 2 N\n LMLMR\n \n MMR`;
    expect(() => parseInput(input)).toThrow(/Invalid input: Robot positions and movement instructions must come in pairs, along with plateau coordinates. /i);
  });
  it('should throw error if robot and instruction lines are not in pairs with 2 instructions come in same line', () => {
    const input = `5 5\n1 1 2 N\n LMLMR 3 3 S\n MMR`;
    expect(() => parseInput(input)).toThrow(/Invalid input: Robot positions and movement instructions must come in pairs, along with plateau coordinates. /i);
  });

  it('should throw error for duplicate robot positions with different directions', () => {
    const input = `5 5\n1 2 N\nLMLMLMLMM\n1 2 E\nRMRMRM`;
    expect(() => parseInput(input)).toThrow(/duplicate starting position/i);
  });

  it('should throw error for duplicate robot positions with same directions', () => {
    const input = `5 5\n1 2 N\nLMLMLMLMM\n1 2 N\nRMRMRM`;
    expect(() => parseInput(input)).toThrow(/duplicate starting position/i);
  });

  it('should not throw error for robot positions with same directions', () => {
    const input = `5 5\n1 2 N\nLMLMLMLMM\n1 3 N\nRMRMRM`;
    expect(() => parseInput(input)).not.toThrow();
  });
  it('should throw error for big values', () => {
    const input = `5 500000\n1 2 N\nLMLMLMLMM\n1 3 N\nRMRMRM`;
    expect(() => parseInput(input)).not.toThrow();
  });

  it('should trim and parse correctly when input has blank lines', () => {
    const input = `\n5 5\n\n1 2 N\nLMLMLMLMM\n\n`;
    const result = parseInput(input);
    expect(result.robots.length).toBe(1);
  });
  it('should trim and parse correctly when input is in lowercase', () => {
    const input = `\n5 5\n\n1 2 n\nlmmlrm\n`;
    const result = parseInput(input);
    expect(result.robots[0].start.dir).toBe('N');
    expect(result.robots[0].instructions).toBe('LMMLRM');
    expect(result.robots.length).toBe(1);
  });
  it('should throw error if robot positions and instructions are given without space between them', () => {
    const input = `\n5 5\n\n1 2 n\nlmmlrm\n 3 3E\nmmr`;
  expect(() => parseInput(input)).toThrow(/Must include two coordinates and a direction./i);
  });
  it('should throw error if input is empty', () => {
  expect(() => parseInput('')).toThrow(/Invalid input: A minimum of 3 lines are required/i);
  });
  it('should throw error if plateau coordinates are not numbers', () => {
    const input = `5 A\n1 2 N\nLMLMLMLMM`;
    expect(() => parseInput(input)).toThrow(/Invalid plateau coordinates/i);
  });

  it('should throw error for invalid robot direction', () => {
    const input = `5 5\n1 2 X\nLMLMLMLMM`;
    expect(() => parseInput(input)).toThrow(/Invalid direction/i);
  });

  it('should throw error for invalid movement instruction', () => {
    const input = `5 5\n1 2 N\nLMLXZ`;
    expect(() => parseInput(input)).toThrow(/Invalid movement instruction/i);
  });
  it('should parse a large number of robots without error when positions are unique', () => {
  const input = `50 50\n` + Array.from({ length: 100 }, (_, i) => {
    const x = i % 50; // ensure within plateau width
    const y = Math.floor(i / 2) % 50; // ensure within plateau height
    const dir = ['N', 'E', 'S', 'W'][i % 4];
    return `${x} ${y} ${dir}\nLMLMLMLMM`;
  }).join('\n');

  const result = parseInput(input);
  expect(result.robots.length).toBe(100);
});

});
