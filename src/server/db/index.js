import Promise from "bluebird";
import { MongoClient } from "mongodb";
import config from "config";

import SubjectsController from "./subjects";

class DatabaseController {
  constructor() {
    this.db = null;
    this.subjects = null;
  }

  initialise({ logger }) {
    this.logger = logger;
    this.logger.info("Initialising");
    return MongoClient.connect(config.db.url).then(db => {
      this.db = db;
      this.subjects = new SubjectsController({ db, logger });
      return this;
    });
  }

  getSubjects() {
    return this.subjects;
  }
}

export default new DatabaseController();
