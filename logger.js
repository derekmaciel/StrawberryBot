const winston = require('winston');
const config = require('./config');

var log_level;
if ("debug" in config && config.debug === true) {
    log_level = "debug";
} else {
    log_level = "info";
}

var logger = new (winston.Logger)();
logger.add(winston.transports.Console, {
    level: log_level,
    timestamp: true,
    json: false
});

if ("log" in config) {
    logger.add(winston.transports.File, {
        level: log_level,
        filename: config.log,
        timestamp: true,
        json: false
    });
    logger.info(`Logging to log file ${config.log}`);
} else {
    logger.info("No log file found in config.json, logging to console only.")
}

module.exports = logger;