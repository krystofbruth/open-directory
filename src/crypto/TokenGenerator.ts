import { createHash, randomBytes } from "node:crypto";

export interface TokenGenerator {
  generate(): Promise<string>;
}

export class Sha512TokenGenerator implements TokenGenerator {
  public async generate(): Promise<string> {
    const seed = randomBytes(32);
    const hash = createHash("sha512");
    hash.update(seed);
    return hash.digest("hex");
  }
}
