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
      .findAsync({ userId, subjectId })
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
}

export default TestController;
