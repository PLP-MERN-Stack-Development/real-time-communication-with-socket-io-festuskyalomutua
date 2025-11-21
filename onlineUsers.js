// server/models/onlineUsers.js
class OnlineUsers {
  constructor() { this.users = {}; }
  add(username, socketId) { this.users[username] = socketId; }
  remove(username) { delete this.users[username]; }
  list() { return Object.keys(this.users); }
}
module.exports = new OnlineUsers();