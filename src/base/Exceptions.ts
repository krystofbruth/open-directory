export class FatalException extends Error {
  constructor(public readonly error: any, msg?: string) {
    super(msg);
  }
}

export class DatabaseException extends FatalException {
  constructor(error: any, msg?: string) {
    super(error, msg);
  }
}
