"use strict";

const client = require('../client');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const logger = require('../logger');

exports.COMMANDS = {
    "playy": {
        help: "Play a youtube video",
        callback: play
    }
};

function play(message, args) {
    if (args['_'].length == 0) {
        client.reply(message, "Play what? :confused:");
        return;
    }

    var video = youtubedl(args['_'][0], [
        '--extract-audio', 
        '--audio-format', 'mp3'
    ]);

    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size: ' + info.size)
    });

    video.pipe(fs.createWriteStream('../audio-cache/testing.mp3'));

    client.joinVoiceChannel("166094007712088064", function(error, connection) {
        if (error) {
            logger.info(`Could not join voice channel: ${error}`);
        } else {
            client.voiceConnection.playFile('../audio-cache/testing.mp3');
        }
    });
}