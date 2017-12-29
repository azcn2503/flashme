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
}

export default TestController;
