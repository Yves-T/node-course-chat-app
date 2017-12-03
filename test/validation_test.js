const { expect } = require('chai');
const { isRealString } = require('../server/utils/validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const result = isRealString(08);
    expect(result).to.be.false;
  });
  it('should reject string with only spaces', () => {
    const result = isRealString('           ');
    expect(result).to.be.false;
  });
  it('should allow string with non-space characters', () => {
    const result = isRealString('    Andrew       ');
    expect(result).to.be.true;
  });
});
