const db = require("../util/database");

module.exports = class Sonoff {
  constructor(
    id,
    title,
    description,
    userid,
    MQTTcommand,
    MQTTcommandAAN,
    MQTTcommandUIT,
    MQTTtopic,
    host,
    imageURL,
    date,
    devicename,
    status
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.userid = userid;
    this.MQTTcommand = MQTTcommand;
    this.MQTTcommandAAN = MQTTcommandAAN;
    this.MQTTcommandUIT = MQTTcommandUIT;
    this.MQTTtopic = MQTTtopic;
    this.host = host;
    this.imageURL = imageURL;
    this.date = date;
    this.devicename = devicename;
    this.status = status;
  }

  save() {
    return db.execute(
      "INSERT INTO sonoffs (title, description, userid, MQTTcommand, MQTTcommandAAN, MQTTcommandUIT, MQTTtopic, host, imageURL, date, devicename, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        this.title,
        this.description,
        this.userid,
        this.MQTTcommand,
        this.MQTTcommandAAN,
        this.MQTTcommandUIT,
        this.MQTTtopic,
        this.host,
        this.imageURL,
        this.date,
        this.devicename,
        this.status
      ]
    );
  }

  static updateId(status, id) {
    return db.execute(
      "UPDATE sonoffs SET sonoffs.status = ? WHERE sonoffs.id = ?",
      [status, id]
    );
  }

  static deleteById(id) {}

  static fetchAll(userid) {
    return db.execute("SELECT * FROM sonoffs WHERE sonoffs.userid = ?", [userid]);
  }

  static findById(id) {
    return db.execute("SELECT * FROM sonoffs WHERE sonoffs.id = ?", [id]);
  }
};
