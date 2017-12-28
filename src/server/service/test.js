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
   * @param {string} subjectId
   * @param {array} cards
   */
  addTest(subjectId, cards) {
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
      subjectId
    };
    return this.db.addTest(test);
  }

  /**
   * Get a test by its ID
   * @param {string} testId
   */
  getTest(testId) {
    return this.db.getTest(testId);
  }

  /**
   * Get all tests for a specific subject ID
   * @param {string} subjectId
   */
  getTestsForSubject(subjectId) {
    return this.db.getTestsForSubject(subjectId);
  }
}

export default new TestService();
