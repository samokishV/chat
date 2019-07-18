const log4js = require('log4js');
const config = require('config');

const mode = config.get('envMode');

log4js.configure({
  appenders: {
    production: { type: 'file', filename: 'app.log', level: 'error' },
    deb: { type: 'console', level: 'debug' },
    err: { type: 'console', level: 'error' },
  },
  categories: {
    default: { appenders: ['production'], level: 'error' },
    production: { appenders: ['production'], level: 'error' },
    development: { appenders: ['deb', 'err'], level: 'debug' },
  },
});

const logger = log4js.getLogger(mode);

module.exports = logger;
