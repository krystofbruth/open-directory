import bcrypt from "bcrypt";

export interface PasswordHashSuite {
  hash(plaintext: string): Promise<string>;
  compare(hash: string, plaintext: string): Promise<boolean>;
}

export class BcryptHashSuite implements PasswordHashSuite {
  constructor(private saltRounds: number = 6) {}

  public async hash(plaintext: string): Promise<string> {
    return await bcrypt.hash(plaintext, this.saltRounds);
  }

  public async compare(plaintext: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plaintext, hash);
  }
}
