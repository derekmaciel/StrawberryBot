"use strict";

const logger = require('./logger')
const config = require('./config');
const Discord = require('discord.js');
const Router = require('./router');

var client = new Discord.Client();
var cmdrouter;

client.loginWithToken(config.token, function (error, token) {
    if (error) {
        logger.info(`Failed to log in to Discord: ${error}`);
    } else {
        logger.info("Logged in to Discord");
    }
});

client.on('ready', function() {
    client.setStatusOnline();
    cmdrouter = new Router(client);
});

client.on('message', function(message) {
    cmdrouter.route(message);
});