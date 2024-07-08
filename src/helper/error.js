class BaseError extends Error {
  constructor(message) {
    super(message);
    this.status = 500;
  }
}

class ValidationError extends BaseError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class NotFoundError extends BaseError {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
};
