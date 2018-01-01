import Promise from "bluebird";

class TestController {
  constructor({ db, logger }) {
    this.collection = Promise.promisifyAll(db.collection("tests"));
    this.logger = logger;
  }

  /**
   * Add a test
   * @param {object} test
   */
  addTest(test) {
    return this.collection.insertOne(test).then(res => res.ops[0]);
  }

  /**
   * Get a test
   * @param {string} userId
   * @param {string} testId
   */
  getTest(userId, testId) {
    return this.collection.findOne({ userId, id: testId });
  }

  /**
   * Get all tests for a subject
   * @param {string} userId
   * @param {string} subjectId
   */
  getTestsForSubject(userId, subjectId) {
    return this.collection
      .findAsync({ userId, subjectId }, { sort: { created: -1 } })
      .then(res => res.toArray());
  }

  /**
   * Remove all tests matching a specific subject ID
   * @param {string} userId
   * @param {string} subjectId
   */
  removeSubjectTests(userId, subjectId) {
    return this.collection.remove({ userId, subjectId }).then(res => res);
  }

  /**
   * Remove a test by ID
   * @param {string} userId
   * @param {string} testId
   */
  removeTest(userId, testId) {
    return this.collection.remove({ userId, id: testId }).then(res => res);
  }

  /**
   * Get test counts for a subject
   * @param {string} userId
   * @param {string} subjectId
   */
  getTestCount(userId, subjectId) {
    return this.collection.count({
      userId,
      subjectId
    });
  }

  setTestStatus(userId, testId, testStatus) {
    return this.collection
      .findOneAndUpdate(
        { userId, id: testId },
        {
          $set: {
            status: testStatus
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(({ value }) => value);
  }

  answerTestCard(userId, testId, cardIndex, correct) {
    return this.collection
      .findOneAndUpdate(
        { userId, id: testId },
        {
          $set: {
            [`cards.${cardIndex}.correct`]: correct,
            [`cards.${cardIndex}.answered`]: true,
            activeCard: cardIndex + 1
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(({ value }) => value);
  }
}

export default TestController;
