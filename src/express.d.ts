import { Authorization } from "./models/Authorization.ts";

declare module "express-serve-static-core" {
  interface Request {
    authorization?: Authorization;
  }
}
