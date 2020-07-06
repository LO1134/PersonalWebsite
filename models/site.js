const db = require("../util/database");

module.exports = class Site {
  constructor(id, userid, title, imageURL, description, linkToWebPage) {
    this.id = id;
    this.userid = userid;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.linkToWebPage = linkToWebPage;
  }

  save() {
    return db.execute(
      "INSERT INTO sites (title, userid, imageURL, description, linkToWebPage) VALUES (?, ?, ?, ?, ?)",
      [this.title, this.userid, this.imageURL, this.description, this.linkToWebPage]
    );
  }

  static deleteById(id) {}

  static fetchAll(userid) {
    return db.execute("SELECT * FROM sites WHERE sites.userid = ?", [userid]);
  }

  static findById(id) {
    return db.execute("SELECT * FROM sites WHERE sites.id = ?", [id]);
  }
};
