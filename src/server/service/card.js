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

  /**
   * Update a card
   * @param {string} cardId
   * @param {object} card
   */
  updateCard(cardId, card) {
    const enrichedCard = {
      ...card,
      updated: Date.now()
    };
    return this.db.updateCard(cardId, enrichedCard);
  }

  /**
   * Remove a card
   * @param {string} cardId
   */
  removeCard(cardId) {
    return this.db.removeCard(cardId);
  }

  /**
   * Remove all cards with the specified subject ID
   * @param {string} subjectId
   */
  removeSubjectCards(subjectId) {
    return this.db.removeSubjectCards(subjectId);
  }
}

export default new CardService();
