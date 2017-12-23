import Promise from "bluebird";

class SubjectsController {
  constructor({ db, logger }) {
    this.collection = db.collection("subjects");
    this.logger = logger;
  }

  addSubject(subject) {
    return this.collection.insertOne(subject).then(res => res.ops[0]);
  }

  getSubjects() {
    return this.collection.find(
      {},
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

  getSubject(id) {
    return this.collection.findOne({ id });
  }

  updateSubjectTitle(id, title) {
    return this.collection
      .findOneAndUpdate(
        { id },
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
}

export default SubjectsController;
