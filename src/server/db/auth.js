class AuthController {
  constructor({ db, logger }) {
    this.collection = db.collection("cards");
    this.logger = logger;
  }
}

export default AuthController;
