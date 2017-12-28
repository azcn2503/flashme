import { MongoClient } from "mongodb";
import config from "config";
import Promise from "bluebird";

import AuthController from "./auth";
import CardController from "./card";
import SubjectController from "./subject";
import TestController from "./test";

class DatabaseController {
  constructor() {
    this.db = null;
    this.auth = null;
    this.cards = null;
    this.subjects = null;
  }

  initialise({ logger }) {
    const client = Promise.promisifyAll(MongoClient);
    this.logger = logger;
    return client.connectAsync(config.db.url).then(db => {
      this.logger.debug("Database initialised");
      this.db = db;
      this.auth = new AuthController({ db, logger });
      this.cards = new CardController({ db, logger });
      this.subjects = new SubjectController({ db, logger });
      this.tests = new TestController({ db, logger });
      return this;
    });
  }

  getAuth() {
    return this.auth;
  }

  getCards() {
    return this.cards;
  }

  getSubjects() {
    return this.subjects;
  }

  getTests() {
    return this.tests;
  }
}

export default new DatabaseController();
