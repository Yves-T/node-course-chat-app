class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    this.users = this.users.filter(user => user.id !== id);
  }

  getUser(id) {
    return this.users.find(user => user.id === id);
  }

  getUserList(room) {
    const users = this.users.filter(user => user.room === room);
    return users.map(user => user.name);
  }
}

module.exports = { Users };
