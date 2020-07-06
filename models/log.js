// const db = require("../util/database");
const db = require("../util/raspberrypidb");

module.exports = class Log {
  static fetchAlls() {
    return db.execute("SELECT * FROM log order by Id DESC");
  }
};
