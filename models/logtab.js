// const db = require("../util/database");
const db = require("../util/raspberrypidb");

module.exports = class Logtab {
  constructor(id, loginName, loginTime, result, password, IPAddress) {
    this.id = id;
    this.loginName = loginName;
    this.loginTime = loginTime;
    this.result = result;
    this.password = password;
    this.IPAddress = IPAddress;
  }

  save() {
    return db.execute(
      "INSERT INTO logtab (loginName, loginTime, result, password, IPAddress) VALUES (?, ?, ?, ?, ?)",
      [
        this.loginName,
        this.loginTime,
        this.result,
        this.password,
        this.IPAddress,
      ]
    );
  }

  static fetchAlls() {
    return db.execute("SELECT * FROM logtab");
  }
};
