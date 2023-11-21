export default class CustomException extends Error {
  constructor(status, message, code, data) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
    this.code = code;
    this.data = data;
  }
}
