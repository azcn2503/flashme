import path from "path";
import config from "config";
import express from "express";
import session from "express-session";
import { getLogger } from "log4js";
import bodyParser from "body-parser";
import serveStatic from "serve-static";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LocalStrategy } from "passport-local";

import {
  authApi as initialiseAuthApi,
  cardApi as initialiseCardApi,
  subjectApi as initialiseSubjectApi,
  testApi as initialiseTestApi
} from "./api";
import {
  authService,
  cardService,
  subjectService,
  testService
} from "./service";
import databaseController from "./db";

const app = express();

const logger = getLogger(config.server.name);
logger.level = config.server.logLevel || "debug";

app.use(session({ secret: "cards and secrets" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(serveStatic(config.client.path));
app.use(passport.initialize());
app.use(passport.session());

databaseController
  .initialise({ logger })
  .catch(err => logger.error("Could not connect to Mongo", err.message))
  .then(db => {
    authService.initialise({
      logger,
      db: db.getAuth(),
      passport,
      LocalStrategy,
      FacebookStrategy
    });
    cardService.initialise({ logger, db: db.getCards() });
    subjectService.initialise({ logger, db: db.getSubjects() });
    testService.initialise({ logger, db: db.getTests() });

    initialiseAuthApi({
      app,
      logger,
      authService,
      passport,
      FacebookStrategy,
      LocalStrategy
    });
    initialiseCardApi({ app, logger, cardService });
    initialiseSubjectApi({
      app,
      logger,
      subjectService,
      cardService
    });
    initialiseTestApi({ app, logger, testService, cardService });

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
