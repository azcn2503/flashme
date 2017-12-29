class UserController {
  constructor({ db, logger }) {
    this.collection = db.collection("users");
    this.logger = logger;
  }

  /**
   * Find user by username
   * @param {string} username
   */
  findUser(username) {
    return this.collection.findOne({ username });
  }

  /**
   * Find user by ID
   * @param {string} id
   */
  findUserById(id) {
    return this.collection.findOne({ id });
  }

  /**
   * Register a new user
   * @param {object} user
   */
  registerUser(user) {
    return this.collection.insertOne(user).then(res => res.ops[0]);
  }
}

export default UserController;
