"use strict";

const config = require('./config');
const Discord = require('discord.js');
const Router = require('./router');

var client = new Discord.Client();
var cmdrouter;

client.loginWithToken(config.token, function (error, token) {
    if (error) {
        console.log("Failed to log in: " + error);
    } else {
        console.log("Logged in successfully.");
    }
});

client.on('ready', function() {
    client.setStatusOnline();
    cmdrouter = new Router(client);
});

client.on('message', function(message) {
    cmdrouter.route(message);
});