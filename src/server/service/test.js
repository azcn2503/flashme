import uuidv4 from "uuid/v4";
import { shuffle } from "lodash";

import { testStatusEnum, testTypeEnum } from "shared/tests";

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
    const testCards = shuffle(
      cards.map(card => ({
        id: card.id,
        question: card.question,
        answer: card.answer,
        answered: false
      }))
    );
    const test = {
      id: uuidv4(),
      created: Date.now(),
      cards: testCards,
      subjectId,
      userId,
      status: testStatusEnum.NOT_STARTED,
      activeCard: 0,
      type: testTypeEnum.SUBJECT_TEST
    };
    return this.db.addTest(test);
  }

  addRetest(userId, subjectId, testId, cards) {
    return this.db.getTest(userId, testId).then(test => {
      const testCards = shuffle(
        test.cards.filter(card => card.correct === false).map(card => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          answered: false,
          correct: null
        }))
      );
      const retest = {
        id: uuidv4(),
        created: Date.now(),
        cards: testCards,
        subjectId,
        userId,
        parentTestId: testId,
        status: testStatusEnum.NOT_STARTED,
        activeCard: 0,
        type: testTypeEnum.SUBJECT_RETEST
      };
      return this.db.addTest(retest);
    });
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

  /**
   * Remove all tests with the specified subject ID
   * @param {string} subjectId
   */
  removeSubjectTests(userId, subjectId) {
    this.logger.debug(`Removing all tests for subject ${subjectId}`);
    return this.db.removeSubjectTests(userId, subjectId);
  }

  /**
   * Remove a test
   * @param {string} userId
   * @param {string} testId
   */
  removeTest(userId, testId) {
    return this.db.removeTest(userId, testId);
  }

  /**
   * Get test count for subjects
   * @param {{ id: String }[]} subjectIds
   */
  getTestCount(userId, subjects) {
    const countsPromises = subjects.map(subject =>
      this.db.getTestCount(userId, subject.id)
    );
    return Promise.all(countsPromises).then(counts =>
      subjects.map((subject, key) => ({
        ...subject,
        testCount: counts[key]
      }))
    );
  }

  /**
   * Start a test
   * @param {string} userId
   * @param {string} testId
   */
  startTest(userId, testId) {
    return this.db.setTestStatus(userId, testId, testStatusEnum.STARTED);
  }

  /**
   * Complete a test
   * @param {string} userId
   * @param {string} testId
   */
  completeTest(userId, testId) {
    return this.db.setTestStatus(userId, testId, testStatusEnum.COMPLETED);
  }

  /**
   * Abandon a test
   * @param {string} userId
   * @param {string} testId
   */
  abandonTest(userId, testId) {
    return this.db.setTestStatus(userId, testId, testStatusEnum.ABANDONED);
  }

  answerTestCard(userId, testId, cardIndex, correct) {
    return this.db
      .answerTestCard(userId, testId, cardIndex, correct)
      .then(test => ({ activeCard: test.activeCard }));
  }
}

export default new TestService();
