import uuidv4 from "uuid/v4";

class TestService {
  constructor() {
    this.db = null;
    this.logger = null;
  }

  initialise({ db, logger }) {
    this.db = db;
    this.logger = logger;
  }

  /**
   * Create a test against a subject ID with the specified cards
   * @param {string} userId
   * @param {string} subjectId
   * @param {array} cards
   */
  addTest(userId, subjectId, cards) {
    // Strip down the cards to the bare essentials
    const testCards = cards.map(card => ({
      id: card.id,
      question: card.question,
      answer: card.answer
    }));
    const test = {
      id: uuidv4(),
      created: Date.now(),
      cards: testCards,
      subjectId,
      userId
    };
    return this.db.addTest(test);
  }

  /**
   * Get a test by its ID
   * @param {string} userId
   * @param {string} testId
   */
  getTest(userId, testId) {
    return this.db.getTest(userId, testId);
  }

  /**
   * Get all tests for a specific subject ID
   * @param {string} userId
   * @param {string} subjectId
   */
  getTestsForSubject(userId, subjectId) {
    return this.db.getTestsForSubject(userId, subjectId);
  }
}

export default new TestService();
