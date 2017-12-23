import Promise from "bluebird";

class CardController {
  constructor({ db, logger }) {
    this.collection = db.collection("cards");
    this.logger = logger;
  }

  getCards(subjectId) {
    return this.collection.find(
      {
        subjectIds: {
          $all: [subjectId]
        }
      },
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

  addCard(card) {
    return this.collection.insertOne(card).then(res => res.ops[0]);
  }
}

export default CardController;
