export class QueryTimeoutException extends Error {
  constructor() {
    super('messaging query timeout exception')
  }
}
