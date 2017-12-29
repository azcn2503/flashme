import uuidv4 from "uuid/v4";

class SubjectService {
  constructor() {
    this.db = null;
    this.logger = null;
  }

  initialise({ db, logger }) {
    this.logger = logger;
    this.db = db;
  }

  addSubject(userId) {
    const subject = {
      id: uuidv4(),
      created: Date.now(),
      title: "My subject",
      userId
    };
    return this.db.addSubject(subject);
  }

  getSubjects(userId) {
    return this.db.getSubjects(userId);
  }

  getSubject(userId, subjectId) {
    return this.db.getSubject(userId, subjectId);
  }

  updateSubjectTitle(userId, subjectId, title) {
    return this.db.updateSubjectTitle(userId, subjectId, title);
  }

  /**
   * Remove a subject
   * @param {string} subjectId
   */
  removeSubject(userId, subjectId) {
    return this.db.removeSubject(userId, subjectId);
  }
}

export default new SubjectService();
