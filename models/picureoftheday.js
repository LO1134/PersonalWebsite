const db = require("../util/raspberrypidb");

module.exports = class pictureoftheday {
  // constructor empty because only read.

  static fetch_last_item_from_PictureOfTheDay() {
    return db.execute(
      "SELECT link, description FROM PictureOfTheDay order by timestamp desc limit 1"
    );
  }
};
