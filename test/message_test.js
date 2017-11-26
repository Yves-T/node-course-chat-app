const { expect } = require('chai');
const {
  generateMessage,
  generateLocationMessage,
} = require('../server/utils/message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const result = generateMessage({ from: 'from', text: 'this is my text' });
    expect(result).to.haveOwnProperty('from');
    expect(result.from).to.equal('from');
    expect(result.text).to.equal('this is my text');
    expect(result.createdAt).to.be.a('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location message', () => {
    const result = generateLocationMessage({
      from: 'from',
      latitude: 1,
      longitude: 2,
    });
    expect(result).to.haveOwnProperty('from');
    expect(result.from).to.equal('from');
    expect(result.url).to.equal('https://www.google.com/maps?q=1,2');
    expect(result.createdAt).to.be.a('number');
  });
});
