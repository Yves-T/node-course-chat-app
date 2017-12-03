const { expect } = require('chai');
const { Users } = require('../server/utils/users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        room: 'Node Course',
      },
      {
        id: '2',
        name: 'Jen',
        room: 'React Course',
      },
      {
        id: '3',
        name: 'Julie',
        room: 'Node Course',
      },
    ];
  });

  it('should add new user', () => {
    users = new Users();
    const user = {
      id: '123',
      name: 'Andrew',
      room: 'The Office Fans',
    };

    const resultUser = users.addUser(user.id, user.name, user.room);
    expect(resultUser).to.deep.equal(user);
    expect(users.users).to.deep.equal([user]);
  });

  it('should find user', () => {
    expect(users.getUser('3')).to.deep.equal({
      id: '3',
      name: 'Julie',
      room: 'Node Course',
    });
  });

  it('should not find user', () => {
    /* eslint-disable no-unused-expressions */
    expect(users.getUser('5')).to.not.exist;
    /* eslint-enable no-unused-expressions */
  });

  it('should remove a user', () => {
    users.removeUser('2');
    expect(users.users).to.have.length(2);
    expect(users.users).to.deep.equal([
      {
        id: '1',
        name: 'Mike',
        room: 'Node Course',
      },
      {
        id: '3',
        name: 'Julie',
        room: 'Node Course',
      },
    ]);
  });

  it('should not remove a user', () => {
    users.removeUser('7');
    expect(users.users).to.have.length(3);
  });

  it('should return names for node users', () => {
    const userList = users.getUserList('Node Course');
    expect(userList).to.deep.equal(['Mike', 'Julie']);
  });
});
