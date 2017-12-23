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

  getCards(subjectId) {
    return this.db.getCards(subjectId);
  }

  addCard(card) {
    const enrichedCard = {
      ...card,
      id: uuidv4(),
      created: Date.now()
    };
    return this.db.addCard(enrichedCard);
  }
}

export default new CardService();
