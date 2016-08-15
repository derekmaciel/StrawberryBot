"use strict";

const config = require('../config');

class Base {
    constructor(client) {
        this.client = client;
        this.commands = {
            "info": this.info.bind(this)
        }
    }

    info(message) {
        this.client.reply(message, `I am Strawberry Bot v${config.version}! ` +
            "Nice to meet you!");
    }
}

module.exports = Base;