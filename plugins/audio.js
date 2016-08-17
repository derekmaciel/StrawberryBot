"use strict";

const client = require('../client');

exports.COMMANDS = {
    "ping": {
        help: "Respond with 'pong'",
        callback: ping
    }
};

function ping(message) {
    client.reply(message, "pong! :)");
}