import uuidv4 from "uuid/v4";
import Promise from "bluebird";

class SubjectService {
  constructor() {
    this.db = null;
    this.logger = null;
  }

  initialise({ db, logger }) {
    this.logger = logger;
    this.db = db.getSubjects();
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
}

export default new SubjectService();
