import { Db, MongoClient } from "mongodb";
import { DependencyFactory } from "../base/Container.js";

export const MongoDbFactoryFactory: (dbUri: string) => DependencyFactory<Db> = (
  dbUri
) => {
  return async (container) => {
    const client = new MongoClient(dbUri);
    const db = client.db("open-ad");
    return db;
  };
};
