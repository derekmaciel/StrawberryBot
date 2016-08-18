"use strict";

const config = require('./config');
const logger = require('./logger');
const plugin = require('./plugin');

var routes = plugin.get_all_commands();

function route(message) {
    message.content = message.content.trim();

    if (message.content.startsWith(config.command_prefix)) {
        // Find the command that corresponds to this message
        for (let cmd of routes.keys()) {
            var command_string = config.command_prefix + cmd;
            if (message.content.startsWith(command_string)) {
                logger.info(`${message.author.username}: ${cmd}`);
                var args = get_args(message.content, command_string);
                routes.get(cmd).callback(message, args);
                return;
            }
        }

        logger.debug(`No route found for message: '${message.content}'`);
    }
}

function get_args(s, cmd) {
    s = s.slice(cmd.length).trim();
    var argv = require('minimist')(s.split(' '), {
        boolean: true // treat '--' options without = (like --test) as boolean 
    });

    // Strange behavior -- if no options are given, argv = { '_': [''] }
    // Remove that empty entry
    if (argv['_'].length == 1 && argv['_'][0] == '') {
        argv['_'].pop();
    }
    
    return argv;
}

module.exports = {
    route: route
};