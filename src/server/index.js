import path from "path";
import config from "config";
import express from "express";
import { getLogger } from "log4js";
import bodyParser from "body-parser";
import serveStatic from "serve-static";

import { cardApi, subjectApi, testApi } from "./api";
import { cardService, subjectService, testService } from "./service";
import databaseController from "./db";

const app = express();
const logger = getLogger(config.server.name);
logger.level = config.server.logLevel || "debug";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(serveStatic(config.client.path));

databaseController
  .initialise({ logger })
  .then(db => {
    cardService.initialise({ logger, db: db.getCards() });
    subjectService.initialise({ logger, db: db.getSubjects() });

    cardApi.initialise({ app, logger, service: cardService });
    subjectApi.initialise({ app, logger, service: subjectService });

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(config.client.path, "index.html"));
    });
  })
  .catch(err => logger.error("Could not connect to Mongo", err.message));

app.listen(config.http.port, () => {
  logger.debug(
    `${config.server.name} listening on HTTP port ${config.http.port}`
  );
});
