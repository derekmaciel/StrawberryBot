"use strict";

const config = require('../config');
const client = require('../client');
const plugin = require('../plugin');

exports.COMMANDS = {
    "info": {
        help: "Display bot version",
        callback: info
    },
    "ids": {
        help: "Show channel IDs",
        callback: ids
    },
    "help": {
        help: "Show commands",
        callback: help
    }
};

function info(message, args) {
    client.reply(message, `I am Strawberry Bot v${config.version}! ` +
        "Nice to meet you!");
}

function help(message, args) {
    var msg;
    var commands = plugin.get_all_commands();

    if (args['_'].length > 0) {
        var cmd = args['_'][0];
        var c = commands.get(cmd);
        if (typeof c === 'undefined') {
            msg = "I don't know that command :angry:";
        } else {
            msg = `${config.command_prefix}${cmd}: ${c.help}`
        }
    } else {
        msg = "I can do:\n";
        
        for (let cmd of commands.keys()) {
            msg += `\`${config.command_prefix}${cmd}\`, `;
        }

        msg = msg.slice(0, msg.length - 2);
        msg += `\nAsk me for more information about a command with ` +
            `\`${config.command_prefix}help cmd_name\`.` + 
            "Try `!help help` :smiley:";
    }
    
    client.reply(message, msg);
}

function ids(message, args) {
    var msg = "\n";
    for (var channel of client.channels) {
        msg = msg + `${channel.name} (${channel.type}): ${channel.id}\n`;
    }
    client.reply(message, msg);
}