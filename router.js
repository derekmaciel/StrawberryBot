"use strict";

const config = require('./config');
const logger = require('./logger');
const plugin = require('./plugin');

class Router {
    constructor(client) {
        this.client = client;

        // Load routes from plugins
        var plugins = config.plugins;
        plugins.unshift("base"); // Always load base
        this.commands = plugin.get_all_commands(plugins);
    }

    route(message) {
        message.content = message.content.trim();
        if (message.content.startsWith(config.command_prefix)) {
            // Find the command that corresponds to this message
            for (let cmd of this.commands.keys()) {
                if (message.content.startsWith(config.command_prefix + cmd)) {
                    logger.info(`${message.author.username}: ${cmd}`);
                    this.commands.get(cmd).callback(message);
                }
            }
        }
    }
}

module.exports = Router;