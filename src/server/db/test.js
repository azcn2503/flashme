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
   * @param {string} testId
   */
  getTest(testId) {
    return this.collection.findOne({ id: testId });
  }

  /**
   * Get all tests for a subject
   * @param {string} subjectId
   */
  getTestsForSubject(subjectId) {
    return this.collection.findAsync({ subjectId }).then(res => res.toArray());
  }
}

export default TestController;
