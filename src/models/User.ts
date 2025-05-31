import { Permissions } from "./Authorization.js";

export interface User {
  username: string;
  passwordHash: string;
  userid: string;
  permissions: Permissions[];
}

export interface UserModifiable {
  username: string;
  passwordHash: string;
  permissions: Permissions[];
}
