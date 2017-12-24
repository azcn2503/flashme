import uuidv4 from "uuid/v4";

class CardService {
  constructor() {
    this.db = null;
    this.logger = null;
  }

  initialise({ db, logger }) {
    this.logger = logger;
    this.db = db;
  }

  /**
   * Get all cards for a specific subject
   * @param {string} subjectId
   */
  getCards(subjectId) {
    return this.db.getCards(subjectId);
  }

  /**
   * Get card count for subjects
   * @param {{ id: String }[]} subjectIds
   */
  getCardCount(subjects) {
    const countsPromises = subjects.map(subject =>
      this.db.getCardCount(subject.id)
    );
    return Promise.all(countsPromises).then(counts =>
      subjects.map((subject, key) => ({
        ...subject,
        cardCount: counts[key]
      }))
    );
  }

  /**
   * Add a card
   * @param {object} card
   * @param {string} subjectId
   */
  addCard(card, subjectId) {
    const enrichedCard = {
      ...card,
      subjectId,
      id: uuidv4(),
      created: Date.now()
    };
    return this.db.addCard(enrichedCard);
  }

  updateCard(cardId, card) {
    const enrichedCard = {
      ...card,
      updated: Date.now()
    };
    return this.db.updateCard(cardId, enrichedCard);
  }
}

export default new CardService();
