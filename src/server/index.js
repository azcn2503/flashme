import path from "path";
import config from "config";
import express from "express";
import session from "express-session";
import { getLogger } from "log4js";
import bodyParser from "body-parser";
import serveStatic from "serve-static";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import {
  userApi as initialiseUserApi,
  cardApi as initialiseCardApi,
  subjectApi as initialiseSubjectApi,
  testApi as initialiseTestApi
} from "./api";
import {
  userService,
  cardService,
  subjectService,
  testService
} from "./service";
import databaseController from "./db";

const app = express();

const loggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    return res.send(401);
  }
};

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
    userService.initialise({
      logger,
      db: db.getUsers(),
      passport,
      LocalStrategy
    });
    cardService.initialise({ logger, db: db.getCards() });
    subjectService.initialise({ logger, db: db.getSubjects() });
    testService.initialise({ logger, db: db.getTests() });

    initialiseUserApi({
      app,
      logger,
      userService,
      passport,
      LocalStrategy,
      loggedIn
    });
    initialiseCardApi({ app, logger, cardService, loggedIn });
    initialiseSubjectApi({
      app,
      logger,
      subjectService,
      cardService,
      testService,
      loggedIn
    });
    initialiseTestApi({ app, logger, testService, cardService, loggedIn });

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
