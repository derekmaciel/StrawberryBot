"use strict";

class Audio {
    constructor(client) {
        this.client = client;
        this.commands = {
            "ping": this.ping.bind(this)
        }
    }

    ping(message) {
        this.client.reply(message, "pong! :)");
    }
}

module.exports = Audio;