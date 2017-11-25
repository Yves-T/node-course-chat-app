const { expect } = require('chai');
const { generateMessage } = require('../server/utils/message');

it('should generate correct message object', () => {
  const result = generateMessage({ from: 'from', text: 'this is my text' });
  expect(result).to.haveOwnProperty('from');
  expect(result.from).to.equal('from');
  expect(result.text).to.equal('this is my text');
  expect(result.createdAt).to.be.a('number');
});

describe('generateMessage', () => {});
