"use strict";

const logger = require('./logger');

function get_plugin(name) {
    var p = require('./plugins/' + name);
    return p;
};

function get_commands(plugin_name) {
    var p = get_plugin(plugin_name);
    return p.COMMANDS;
};

function get_all_commands(plugins) {
    var commands = new Map();

    for (let plugin of plugins) {
        var plugin_commands = get_commands(plugin);

        for (let c in plugin_commands) {
            if (commands.has(c)) {
                throw Error(`Command ${cmd} from plugin ${plugin} already ` + 
                    "loaded from another plugin.");
            }
            commands.set(c, plugin_commands[c]);
        }
    }

    return commands;
}

module.exports = {
    get_plugin: get_plugin,
    get_commands: get_commands,
    get_all_commands: get_all_commands
};