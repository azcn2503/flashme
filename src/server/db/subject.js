import Promise from "bluebird";

class SubjectsController {
  constructor({ db, logger }) {
    this.collection = db.collection("subjects");
    this.logger = logger;
  }

  /**
   * Add a subject
   * @param {object} subject
   */
  addSubject(subject) {
    return this.collection.insertOne(subject).then(res => res.ops[0]);
  }

  /**
   * Get all subjects
   * @param {string} userId
   */
  getSubjects(userId) {
    return this.collection.find(
      { userId },
      (err, res) =>
        new Promise((resolve, reject) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(res.toArray());
          }
        })
    );
  }

  /**
   * Get a subject by ID
   * @param {string} userId
   * @param {string} subjectId
   */
  getSubject(userId, subjectId) {
    return this.collection.findOne({ userId, id: subjectId });
  }

  /**
   * Update a subject title
   * @param {string} userId
   * @param {string} subjectId
   * @param {string} title
   */
  updateSubjectTitle(userId, subjectId, title) {
    return this.collection
      .findOneAndUpdate(
        { userId, id: subjectId },
        {
          $set: {
            title
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(({ value }) => value);
  }

  /**
   * Remove a subject by ID
   * @param {string} userId
   * @param {string} subjectId
   */
  removeSubject(userId, subjectId) {
    return this.collection.remove({ userId, id: subjectId }).then(res => res);
  }
}

export default SubjectsController;
