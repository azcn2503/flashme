import Promise from "bluebird";

class AuthService {
  constructor() {
    this.db = null;
    this.logger = null;
  }

  initialise({ db, logger, passport, LocalStrategy, FacebookStrategy }) {
    this.db = db;
    this.logger = logger;

    passport.use(
      new FacebookStrategy(
        {
          clientID: "518079185223532",
          clientSecret: "78498ec5e86da94917c1959bafea55ff",
          callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        (accessToken, refreshToken, profile, done) => {
          this.findOrAddUser({ accessToken, refreshToken, profile }).then(res =>
            done()
          );
        }
      )
    );

    passport.use(
      new LocalStrategy((username, password, done) => {
        this.findUser({ username, password })
          .then(user => done(null, user))
          .catch(err => done(null, null, err.message));
      })
    );
  }

  findUser({ username, password }) {
    return this.db.findUser(username, password);
  }

  findOrAddUser({ accessToken, refreshToken, profile }) {
    this.logger.info("Authentication not implemented yet");
    return Promise.resolve("Not implemented yet");
  }
}

export default new AuthService();
