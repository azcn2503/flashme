import path from "path";
import config from "config";
import express from "express";
import { getLogger } from "log4js";
import bodyParser from "body-parser";
import serveStatic from "serve-static";

import {
  cardApi as initialiseCardApi,
  subjectApi as initialiseSubjectApi,
  testApi as initialiseTestApi
} from "./api";
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
  .catch(err => logger.error("Could not connect to Mongo", err.message))
  .then(db => {
    cardService.initialise({ logger, db: db.getCards() });
    subjectService.initialise({ logger, db: db.getSubjects() });

    initialiseCardApi({ app, logger, cardService });
    initialiseSubjectApi({ app, logger, subjectService, cardService });

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(config.client.path, "index.html"));
    });
  })
  .then(() => {
    app.listen(config.http.port, () => {
      logger.info(
        `${config.server.name} listening on HTTP port ${config.http.port}`
      );
    });
  });
