const config = require('./config');
const Discord = require('discord.js');
var client = new Discord.Client();

client.loginWithToken(config.token, function (error, token) {
    if (error) {
        console.log("Failed to log in: " + error);
    } else {
        console.log("Logged in successfully.");
    }
});

client.on('ready', function() {
    client.setStatusOnline();
});

client.on('message', function(message) {
    if (message.content === "ping") {
        client.reply(message, "pong! :)");
    }
});

function exit() {
    console.log("Exiting");
    client.setStatusIdle();
    client.logout();
    process.exit();
}