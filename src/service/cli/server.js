'use strict';

const express = require(`express`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const initAPI = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const DEFAULT_PORT = 3000;

const app = express();

app.use((req, res, next) => {
  logger.debug(`Start request to url ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`End request with status code  ${res.statusCode}`);
  });
  next();
});

app.use(express.json());

module.exports = {
  app,
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const mockData = await getMockData();
    const routes = initAPI(mockData);
    app.use(API_PREFIX, routes);
    app.use((req, res) => {
      res
      .status(HttpCode.NOT_FOUND)
      .send(`Not found`);
      logger.error(`Not found url ${req.url}`);
    });

    app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).send(`Something broke!`);
    });

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`Server can't start. Error: ${err}`);
        }

        return logger.info(`server start on ${port}`);
      });

    } catch (err) {
      logger.error(`Произошла ошибка: ${err.message}`);
      process.exit(1);
    }
  }
};
