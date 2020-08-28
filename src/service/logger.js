'use strict';

const logger = require(`pino`)({
  name: `buyAndSell`,
  level: process.env.LOG_LEVEL || `info`
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};