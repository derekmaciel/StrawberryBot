"use strict";

const config = require('../config');
const client = require('../client');

exports.COMMANDS = {
    "info": {
        help: "Display bot version",
        callback: info
    },
    "ids": {
        help: "Show channel IDs",
        callback: ids
    }
};

function info(message, args) {
    client.reply(message, `I am Strawberry Bot v${config.version}! ` +
        "Nice to meet you!");
}

function ids(message, args) {
    var msg = "\n";
    for (var channel of client.channels) {
        msg = msg + `${channel.name} (${channel.type}): ${channel.id}\n`;
    }
    client.reply(message, msg);
}