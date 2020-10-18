// const db = require("../util/database");
const db = require("../util/raspberrypidb");

module.exports = class Log {
  constructor(Id, Date, CalledBy, Message) {
    this.Id = Id;
    this.Date = Date;
    this.CalledBy = CalledBy;
    this.Message = Message;
  }

  save() {
    return db.execute(
      "INSERT INTO log (Date, CalledBy, Message) VALUES (?, ?, ?)",
      [this.Date, this.CalledBy, this.Message]
    );
  }
  static fetchAlls() {
    return db.execute("SELECT * FROM log order by Id DESC");
  }
};
