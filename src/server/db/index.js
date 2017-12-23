import { MongoClient } from "mongodb";
import config from "config";

import CardController from "./card";
import SubjectController from "./subject";

class DatabaseController {
  constructor() {
    this.db = null;
    this.cards = null;
    this.subjects = null;
  }

  initialise({ logger }) {
    this.logger = logger;
    this.logger.info("Initialising");
    return MongoClient.connect(config.db.url).then(db => {
      this.db = db;
      this.cards = new CardController({ db, logger });
      this.subjects = new SubjectController({ db, logger });
      return this;
    });
  }

  getCards() {
    return this.cards;
  }

  getSubjects() {
    return this.subjects;
  }
}

export default new DatabaseController();
