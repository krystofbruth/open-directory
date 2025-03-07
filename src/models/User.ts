export interface User {
  username: string;
  passwordHash: string;
  id: string;
}

export interface UserModifiable {
  username: string;
  passwordHash: string;
}
