const {
  validateRequirement,
  validatePlateau,
  validateRobotPosition,
  validateMovementInstructions
} = require('../src/validator');

describe('Input Validation', () => {

  describe('validateRequirement', () => {
    it('should throw error if less than 3 lines are given', () => {
      expect(() => validateRequirement(['5 5', '1 2 N'])).toThrow('Invalid input: A minimum of 3 lines are required. Plateau and robot positions must be specified.');
      expect(() => validateRequirement(['1 2 N', 'LMLMLMLMM'])).toThrow('Invalid input: A minimum of 3 lines are required. Plateau and robot positions must be specified.');

    });

    it('should not throw error if equal to 3 lines are given', () => {
      expect(() => validateRequirement(['5 5', '1 2 N', 'LMLMLMLMM'])).not.toThrow();
    });

    it('should throw error if robot positions and instructions are given without plateau', () => {
      expect(() => validateRequirement(['1 2 N', 'LMLMLM', '3 3 E', 'MMRMM'])).toThrow(/Robot positions and movement instructions must come in pairs/i);
    });

    it('should throw error if robot positions and instructions are not in pairs', () => {
      expect(() => validateRequirement(['5 5', '1 2 N', 'LMLMLM', '3 3 E'])).toThrow(/Robot positions and movement instructions must come in pairs, along with plateau coordinates/i);
    });
  });

  describe('validatePlateau', () => {
    it('should throw error if plateau coordinates are invalid', () => {
      expect(() => validatePlateau([5])).toThrow(/Ensure the coordinates consist of two numbers, representing the x and y dimensions of the plateau/i);
      expect(() => validatePlateau(['a',1])).toThrow(/Invalid plateau coordinates/i);
      expect(() => validatePlateau([5,'&'])).toThrow(/Invalid plateau coordinates/i);
      expect(() => validatePlateau([-1, 5])).toThrow('Invalid plateau dimensions: Both x and y coordinates must be greater than zero.');
      expect(() => validatePlateau([0, 0])).toThrow('Invalid plateau dimensions: Both x and y coordinates must be greater than zero.');
      expect(() => validatePlateau([0, 5])).toThrow('Invalid plateau dimensions: Both x and y coordinates must be greater than zero.');
      expect(() => validatePlateau([0, 5, 5])).toThrow(/Invalid plateau coordinates/i);

    });

    it('should not throw error if plateau coordinates are valid', () => {
      expect(() => validatePlateau([5, 5])).not.toThrow();
    });
  });

  describe('validateRobotPosition', () => {
    let plateau = { maxX: 5, maxY: 5 };
    let collisionFlag = false;
    let extras=[];

    const missingPositions = [['5', '5'], ['5', ''],['W', '5'], ['1', 'N'],['1', '2N']];
    test.each(missingPositions)('should throw error if robot position is missing',(x, y) => {
      expect(() => validateRobotPosition(x, y, '', plateau, 2, false, [])).toThrow(/ Must include two coordinates and a direction/i);
      }
    );

    const plateauBounds = [['6', '5', 'N'], ['-1', '5', 'N']];
    test.each(plateauBounds)('should throw error if robot is out of plateau bounds',(x, y, z) => {
      expect(() => validateRobotPosition(x, y, z, plateau, 2, false, [])).toThrow(/Robot position out of bounds/i);
      }
    );

    const invalidPositions = [['1', 'a','N'], ['1', '%', 'N'],['N', '1', '2']];
    test.each(invalidPositions)('should throw error if robot position is invalid',(x, y, z) => {
      expect(() => validateRobotPosition(x, y, z, plateau, 0, false, [])).toThrow(/Coordinates must be numeric values/i);
      }
    );
    const invalidDir = [['A'],['L'],['2'],['*']];
    test.each(invalidDir)('should throw error if robot has invalid direction',(dir) => {
      expect(() => validateRobotPosition('1', '2', dir, plateau, 1, false, [])).toThrow(/Invalid direction/i);
      }
    );

    it('should throw error if robot position is a duplicate', () => {
      collisionFlag = true;
      expect(() => validateRobotPosition('1', '2', 'N', plateau, 1, collisionFlag,extras)).toThrow(/Duplicate starting position detected for robots/i);
    });

    const validPos = [['2', '3', 'S'],['0', '0', 'S'],['0', '0', 'n'],['5', '5', 'S']];
    test.each(validPos)('should not throw error if robot position is valid',(x ,y ,z) => {
      expect(() => validateRobotPosition(x, y, z, plateau, 1, false, [])).not.toThrow();
      }
    );


    it('should throw error if robot position has extra values', () => {
      extras=['N']
      expect(() => validateRobotPosition('5', '5', 'N', plateau, 0, collisionFlag,extras)).toThrow(/Format must be: X Y D , with no extra values./i);
    });
  });


  describe('validateMovementInstructions', () => {
    const invalidMov = [['MMLMRX'],['MMLMRN'],['MMLM5X'],['MM%MRX'],['MML MRX']];
    test.each(invalidMov)('should throw error if there are invalid movement instructions',(mov) => {
      expect(() => validateMovementInstructions(mov, 3)).toThrow(/Invalid movement instruction/i);
      }
    );
    const validInstruction = [['LMLMLM'],['mllmr'],['MLllmRr'],['L'],['r']];
    test.each(validInstruction)('should not throw error if movement instructions are valid',(ins) => {
      expect(() => validateMovementInstructions(ins,3)).not.toThrow();
      }
    );
    });

});
