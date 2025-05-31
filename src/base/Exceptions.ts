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

export class Exception extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export class ConflictException extends Exception {
  constructor(msg?: string) {
    super(msg);
  }
}

export class NotFoundException extends Exception {
  constructor(msg?: string) {
    super(msg);
  }
}

export class InvalidParamsException extends Exception {
  constructor(msg?: string) {
    super(msg);
  }
}

export class AuthenticationException extends Exception {
  constructor(msg?: string) {
    super(msg);
  }
}

export class AuthorizationException extends Exception {
  constructor(msg?: string) {
    super(msg);
  }
}

export class ForbiddenException extends Exception {
  constructor(msg?: string) {
    super(msg);
  }
}
