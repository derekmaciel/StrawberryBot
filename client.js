"use strict";

const Discord = require('discord.js');
const config = require('./config');
const logger = require('./logger')

var client = new Discord.Client();

client.loginWithToken(config.token, function (error, token) {
    if (error) {
        logger.info(`Failed to log in to Discord: ${error}`);
    } else {
        logger.info("Logged in to Discord");
    }
});

module.exports = client;