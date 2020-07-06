const db = require("../util/raspberrypidb");

module.exports = class energielogging {
  static fetchAlls_today() {
    return db.execute(
      "SELECT * from templogging where DATEDIFF(Curdate(), timestamp) <1"
    );
  }
};
