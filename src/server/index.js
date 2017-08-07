import config from 'config';
import express from 'express';
import { getLogger } from 'log4js';
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';

import { getRoutes } from './rest';

const app = express();
const logger = getLogger(config.server.name);
logger.level = config.server.logLevel || 'debug';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

getRoutes({ app, logger });

app.use(serveStatic(config.client.path));

app.listen(config.http.port, () => {
  logger.info(`${config.server.name} listening on HTTP port ${config.http.port}`);
});
