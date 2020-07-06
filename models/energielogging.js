const db = require("../util/raspberrypidb");

module.exports = class energielogging {
  // constructor empty because only read.

  static fetchAlls_today() {
    return db.execute(
      "SELECT * from energielogging where DATEDIFF(Curdate(), timestamp) <1"
    );
  }

  static fetch_Daily_this_month() {
    return db.execute(
      "SELECT timestamp as time_frame, afgenomen, opgewekt FROM energielogging where MONTH(timestamp)= MONTH(CURDATE()) GROUP BY DATE(timestamp), DAY(timestamp)"
    );
  }

  static fetch_per_Month() {
    return db.execute(
      "SELECT Date as time_frame, afgenomen, opgewekt FROM Dailyenergy group by MONTH(Date), YEAR(Date)"
    );
  }
  static fetch_last_item_from_DailyEnergy() {
    return db.execute(
      "SELECT Date as time_frame, afgenomen, opgewekt FROM Dailyenergy order by Date desc limit 1"
    );
  }
};
