// const db = require("../util/database");
const db = require("../util/raspberrypidb");

module.exports = class Logtab {
  constructor(id, loginName, loginTime, password, result, IPAddress) {
    this.id = id;
    this.loginName = loginName;
    this.loginTime = loginTime;
    this.password = password;
    this.result = result;
    this.IPAddress = IPAddress;
  }

  save() {
    return db.execute(
      "INSERT INTO logtab (loginName, loginTime, password, result) VALUES (?, ?, ?, ?, ?)",
      [
        this.loginName,
        this.loginTime,
        this.password,
        this.result,
        this.IPAddress
      ]
    );
  }

  static fetchAlls() {
    return db.execute("SELECT * FROM logtab");
  }
};
