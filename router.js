"use strict";

const config = require('./config');
const logger = require('./logger');
const plugin = require('./plugin');

var routes = get_routes();

function route(message) {
    message.content = message.content.trim();

    if (message.content.startsWith(config.command_prefix)) {
        // Find the command that corresponds to this message
        for (let cmd of routes.keys()) {
            if (message.content.startsWith(config.command_prefix + cmd)) {
                logger.info(`${message.author.username}: ${cmd}`);
                routes.get(cmd).callback(message);
                return;
            }
        }

        logger.debug(`No route found for message: '${message.content}'`);
    }
}

function get_routes() {
    var plugins = config.plugins;
    plugins.unshift("base"); // Always load base
    return plugin.get_all_commands(plugins);
}

module.exports = {
    route: route
};