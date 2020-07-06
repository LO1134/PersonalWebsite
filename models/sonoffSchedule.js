const db = require("../util/database");

module.exports = class Sonoffevents {
  constructor(
    id,
    sonoffsId,
    timestamp,
    day_ALL,
    zo,
    ma,
    di,
    wo,
    don,
    vr,
    za,
    timeOfEvent,
    onOrOff,
    lastChanged,
    status,
    image,
    addedBy
  ) {
    this.id = id;
    this.sonoffsId = sonoffsId;
    this.timestamp = timestamp;
    this.day_ALL = day_ALL;
    this.zo = zo;
    this.ma = ma;
    this.di = di;
    this.wo = wo;
    this.do = don;
    this.vr = vr;
    this.za = za;
    this.timeOfEvent = timeOfEvent;
    this.onOrOff = onOrOff;
    this.lastChanged = lastChanged;
    this.status = status;
    this.image = image;
    this.addedBy = addedBy;
  }

  save() {
    return db.execute(
      `INSERT INTO sonoffevents (
        sonoffsId, 
        timestamp, 
        day_ALL, 
        zo, ma, di, wo, do, vr, za,
        timeOfEvent, 
        onOrOff, 
        lastChanged, 
        status, 
        image, 
        addedBy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.sonoffsId,
        this.timestamp,
        this.day_ALL,
        this.zo,
        this.ma,
        this.di,
        this.wo,
        this.do,
        this.vr,
        this.za,
        this.timeOfEvent,
        this.onOrOff,
        this.lastChanged,
        this.status,
        this.image,
        this.addedBy
      ]
    );
  }

  static deleteById(id) {
    return db.execute("DELETE FROM sonoffevents WHERE sonoffevents.id = ?", [
      id
    ]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM sonoffevents");
  }

  static fetchAllForDevice(id) {
    return db.execute(
      "SELECT * FROM sonoffevents WHERE sonoffevents.sonoffsId = ? ORDER BY sonoffevents.timeOfEvent",
      [id]
    );
  }

  static findById(id) {
    return db.execute("SELECT * FROM sonoffevents WHERE sonoffevents.id = ?", [
      id
    ]);
  }

  static ChangeStatus(id, status) {
    return db.execute(
      "UPDATE sonoffevents SET sonoffevents.status = ? WHERE sonoffevents.id = ?",
      [status, id]
    );
  }
};
