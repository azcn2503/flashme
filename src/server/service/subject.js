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

  addSubject() {
    const subject = {
      id: uuidv4(),
      created: Date.now(),
      title: "My subject"
    };
    return this.db.addSubject(subject);
  }

  getSubjects() {
    return this.db.getSubjects();
  }

  getSubject(id) {
    return this.db.getSubject(id);
  }

  updateSubjectTitle(id, title) {
    return this.db.updateSubjectTitle(id, title);
  }

  /**
   * Remove a subject
   * @param {string} subjectId
   */
  removeSubject(subjectId) {
    return this.db.removeSubject(subjectId);
  }
}

export default new SubjectService();
