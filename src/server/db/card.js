import Promise from "bluebird";

class CardController {
  constructor({ db, logger }) {
    this.collection = db.collection("cards");
    this.logger = logger;
  }

  /**
   * Get all cards for a subject
   * @param {string} userId
   * @param {string} subjectId
   */
  getCards(userId, subjectId) {
    return this.collection.find(
      {
        userId,
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
   * @param {string} userId
   * @param {string} subjectId
   */
  getCardCount(userId, subjectId) {
    return this.collection.count({
      userId,
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
   * @param {string} userId
   * @param {string} cardId
   * @param {object} card
   */
  updateCard(userId, cardId, card) {
    return this.collection
      .findOneAndUpdate(
        { userId, id: cardId },
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
   * @param {string} userId
   * @param {string} cardId
   */
  removeCard(userId, cardId) {
    return this.collection.remove({ userId, id: cardId }).then(res => res);
  }

  /**
   * Remove all cards matching a specific subject ID
   * @param {string} userId
   * @param {string} subjectId
   */
  removeSubjectCards(userId, subjectId) {
    return this.collection.remove({ userId, subjectId }).then(res => res);
  }
}

export default CardController;
