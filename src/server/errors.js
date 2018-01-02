class CustomError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
  }
}

class LoginError extends CustomError {}
class UserExistsError extends CustomError {}

export { LoginError, UserExistsError };
