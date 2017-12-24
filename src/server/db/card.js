import Promise from "bluebird";

class CardController {
  constructor({ db, logger }) {
    this.collection = db.collection("cards");
    this.logger = logger;
  }

  getCards(subjectId) {
    return this.collection.find(
      {
        subjectId
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

  /**
   * Get card counts for a subject
   * @param {string} subjectId
   */
  getCardCount(subjectId) {
    return this.collection.count({
      subjectId
    });
  }

  /**
   * Add a card
   * @param {object} card
   */
  addCard(card) {
    return this.collection.insertOne(card).then(res => res.ops[0]);
  }

  /**
   * Update a card by ID
   * @param {string} id
   * @param {object} card
   */
  updateCard(id, card) {
    return this.collection
      .findOneAndUpdate(
        { id },
        {
          $set: {
            ...card
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(({ value }) => value);
  }

  /**
   * Remove a card by ID
   * @param {string} id
   */
  removeCard(id) {
    return this.collection.remove({ id }).then(res => res);
  }
}

export default CardController;
