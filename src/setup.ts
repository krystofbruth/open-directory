import pg from "pg";
import { Logger } from "./logger.js";
const { Client } = pg;
import { databaseName } from "./databases/postgres.js";
import { setupPostgresUserTable } from "./repositories/UserRepository.js";
import { setupPostgresSessionTable } from "./repositories/SessionRepository.js";
import "dotenv/config";

(async () => {
  Logger.info("Running setup script.");
  const initClient = new Client({ database: "postgres" });
  await initClient.connect();

  // Db existence check
  const openDirectoryTableRecord = (
    await initClient.query(
      `SELECT * FROM pg_catalog.pg_tables WHERE tablename = $1;`,
      [databaseName]
    )
  ).rows[0];
  if (!openDirectoryTableRecord) {
    Logger.info(`Creating ${databaseName} table`);
    await initClient.query(`CREATE DATABASE ${databaseName};`);
    Logger.info(`Db ${databaseName} created`);
  } else {
    Logger.warn(`Database ${databaseName} already exists. Aborting setup`);
    process.exit(1);
  }

  await initClient.end();

  const setupClient = new Client({ database: databaseName });
  await setupClient.connect();

  // Setup tables
  Logger.info("Setting up user table");
  await setupPostgresUserTable(setupClient);
  Logger.info("Setting up session table");
  await setupPostgresSessionTable(setupClient);

  Logger.info("Setup complete, OpenDirectory now ready to start.");
  setupClient.end();
})();
