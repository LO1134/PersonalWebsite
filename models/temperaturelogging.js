const db = require("../util/raspberrypidb");

module.exports = class energielogging {
  static fetchAlls_today() {
    return db.execute(
      "SELECT * from templogging where DATEDIFF(Curdate(), timestamp) <1"
    );
  }
  static fetch_last_item_from_templogging() {
    return db.execute(
      "SELECT timestamp, temperature, humidity FROM templogging order by id desc limit 1"
    );
  }
};
