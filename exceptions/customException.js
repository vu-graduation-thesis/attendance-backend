export default class CustomException extends Error {
  constructor(status, message) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
  }
}
