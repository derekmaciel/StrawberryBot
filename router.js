"use strict";

class Router {
    constructor(client) {
        this.client = client;
    }

    route(message) {
        if (message.content === "ping") {
            this.client.reply(message, "pong! :)");
        }
    }
}

module.exports = Router;