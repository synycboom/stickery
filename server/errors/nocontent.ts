export default class NoContentError extends Error {
  constructor() {
    super('NoContentError');
    this.name = 'NoContentError';
  }
}
