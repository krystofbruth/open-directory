export interface User {
  username: string;
  passwordHash: string;
}

export interface UserModifiable {
  username: string;
  passwordHash: string;
}

export interface UserFilter {
  username?: string;
}
