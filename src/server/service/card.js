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
   * @param {string} userId
   * @param {string} subjectId
   */
  getCards(userId, subjectId) {
    return this.db.getCards(userId, subjectId);
  }

  /**
   * Get card count for subjects
   * @param {string} userId
   * @param {{ id: String }[]} subjectIds
   */
  getCardCount(userId, subjects) {
    const countsPromises = subjects.map(subject =>
      this.db.getCardCount(userId, subject.id)
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
   * @param {string} userId
   * @param {object} card
   * @param {string} subjectId
   */
  addCard(userId, card, subjectId) {
    const enrichedCard = {
      ...card,
      subjectId,
      userId,
      id: uuidv4(),
      created: Date.now(),
      question: card.question || "",
      answer: card.answer || ""
    };
    return this.db.addCard(enrichedCard);
  }

  /**
   * Update a card
   * @param {string} userId
   * @param {string} cardId
   * @param {object} card
   */
  updateCard(userId, cardId, card) {
    const enrichedCard = {
      ...card,
      updated: Date.now()
    };
    return this.db.updateCard(userId, cardId, enrichedCard);
  }

  /**
   * Remove a card
   * @param {string} userId
   * @param {string} cardId
   */
  removeCard(userId, cardId) {
    return this.db.removeCard(userId, cardId);
  }

  /**
   * Remove all cards with the specified subject ID
   * @param {string} userId
   * @param {string} subjectId
   */
  removeSubjectCards(userId, subjectId) {
    this.logger.debug(`Removing all cards for subject ${subjectId}`);
    return this.db.removeSubjectCards(userId, subjectId);
  }
}

export default new CardService();
