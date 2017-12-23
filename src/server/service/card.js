import uuidv4 from "uuid/v4";
import Promise from "bluebird";

class CardService {
  constructor() {
    this.db = null;
    this.logger = null;
  }

  initialise({ db, logger }) {
    this.logger = logger;
    this.db = db;
  }

  getCards() {
    return this.db.getCards();
  }
}

export default new CardService();
