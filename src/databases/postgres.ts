import path from "path";
import { Client } from "pg";

// TODO
async function PostgresDbFactory() {
  const client = new Client({
    database: "open-ad",
  });
  await client.connect();
}
