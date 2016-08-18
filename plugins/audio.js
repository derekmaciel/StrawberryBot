"use strict";

const client = require('../client');

exports.COMMANDS = {
    "ping": {
        help: "Respond with 'pong'",
        callback: ping
    },
    "test": {
        help: "Test play a song",
        callback: test
    }
};

function ping(message, args) {
    client.reply(message, "pong! :)");
}

function test(message, args) {
    client.joinVoiceChannel("166094007712088064").then(function(value) {
            client.voiceConnection.playFile('./Mad World - Gary Jules-4N3N1MlvVc4.webm');
        }, function (reason) {
            logger.info(`Could not join voice channel: ${reason}`);
    });
}