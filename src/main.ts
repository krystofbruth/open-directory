import express from "express";
import "./utils/db.js";
import { logger } from "./utils/logger.js";

const port = process.env.PORT || 3000;
const app = express();

app.listen(port);
logger.info(`App listening on port ${port}`);
