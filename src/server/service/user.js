import Promise from "bluebird";
import bcrypt from "bcryptjs";
import uuidv4 from "uuid/v4";

import { UserExistsError, LoginError } from "server/errors";

class UserService {
  constructor() {
    this.db = null;
    this.logger = null;
  }

  initialise({ db, logger, passport, LocalStrategy }) {
    this.db = db;
    this.logger = logger;

    passport.use(
      new LocalStrategy((username, password, done) => {
        logger.debug(`Attempting login as user ${username}`);
        this.loginUser(username, password)
          .then(user => {
            logger.debug(`Login as ${username} successful`);
            return done(null, user);
          })
          .catch(err => {
            logger.debug(`Login as ${username} failed`, err.message);
            return done(null, null, err.message);
          });
      })
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
      return this.findUserById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
    });
  }

  /**
   * Login a user by username and password
   * @param {string} username
   * @param {string} password
   */
  loginUser(username, password) {
    return this.db
      .findUser(username)
      .then(user =>
        Promise.all([user, bcrypt.compare(password, user.password)])
      )
      .then(([user, validPassword]) => {
        if (validPassword) {
          return Promise.resolve({
            id: user.id,
            username: user.username,
            email: user.email
          });
        } else {
          throw new LoginError("Bad password", 404);
        }
      });
  }

  /**
   * Find a user by user ID
   * @param {string} userId
   */
  findUserById(userId) {
    return this.db.findUserById(userId).then(user => ({
      id: user.id,
      username: user.username,
      email: user.email
    }));
  }

  /**
   * Register a new user
   * @param {string} username
   * @param {string} password
   * @param {string} email
   */
  registerUser(username, password, email) {
    return this.db
      .findUser(username)
      .then(user => {
        if (user) {
          throw new UserExistsError("User already exists", 409);
        } else {
          return bcrypt.genSalt(10);
        }
      })
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => {
        const user = {
          id: uuidv4(),
          created: Date.now(),
          username,
          email,
          password: hash
        };
        return this.db.registerUser(user);
      });
  }
}

export default new UserService();
