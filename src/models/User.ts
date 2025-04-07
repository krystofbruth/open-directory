export interface User {
  username: string;
  passwordHash: string;
  userid: string;
}

export interface UserModifiable {
  username: string;
  passwordHash: string;
}
