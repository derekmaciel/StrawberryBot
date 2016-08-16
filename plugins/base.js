"use strict";

const config = require('../config');
const client = require('../client');

exports.COMMANDS = {
    "info": {
        help: "Display bot version",
        callback: info
    }
};

function info(message) {
    client.reply(message, `I am Strawberry Bot v${config.version}! ` +
        "Nice to meet you!");
}
