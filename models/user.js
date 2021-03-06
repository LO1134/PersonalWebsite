const db = require("../util/database");

module.exports = class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  save() {
    return db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [this.name, this.email, this.password]
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM users");
  }

  static findByEmail(email) {
    return db.execute("SELECT * FROM users WHERE users.email = ?", [email]);
  }
};
