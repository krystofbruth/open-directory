export class FatalException extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export class DependencyException extends FatalException {
  constructor(dependecyKey: string) {
    super(
      `Failed to resolve dependency ${dependecyKey}, are all dependencies registered?`
    );
  }
}
