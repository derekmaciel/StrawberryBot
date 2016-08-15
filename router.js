"use strict";

const config = require('./config');

class Router {
    constructor(client) {
        this.client = client;
        this.routes = new Map();

        // Load routes from plugins
        this.loadRoutes('base'); // Always load base
        for (let name of config.plugins) {
            this.loadRoutes(name);
        }
    }

    route(message) {
        message.content = message.content.trim();
        if (message.content.startsWith(config.command_prefix)) {
            // Find the command that corresponds to this message
            for (let cmd of this.routes.keys()) {
                if (message.content.startsWith(config.command_prefix + cmd)) {
                    console.log(`${message.author.username}: ${cmd}`);
                    this.routes.get(cmd)(message);
                }
            }
        }
        
    }

    loadRoutes(plugin_name) {
        var p = require("./plugins/" + plugin_name);
        var plugin = new p(this.client);
        for (let cmd in plugin.commands) {
            if (this.routes.has(cmd)) {
                throw Error(`Could not load plugin ${plugin_name}: ` + 
                    `Command ${cmd} already loaded from another plugin.`);
            }
            this.routes.set(cmd, plugin.commands[cmd])
        }
    }
}

module.exports = Router;