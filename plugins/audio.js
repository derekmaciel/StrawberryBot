"use strict";

const client = require('../client');
const fs = require('fs');
const crypto = require('crypto');
const hash = crypto.createHash('sha256')
const youtubedl = require('youtube-dl');
const logger = require('../logger');

exports.COMMANDS = {
    "play": {
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

    var path;

    video.on('info', function(info) {
        hash.update(info._filename);
        var filename = hash.digest('hex');
        path = `audio-cache/${filename}.mp3`;
        var megs = info.size / Math.pow(1024, 2);
        
        logger.info(`Downloading ${info._filename} to ${path} size: ${megs}`);
    });

    video.on('end', function(info) {
        logger.info(`Download complete.`);
        video.pipe(fs.createWriteStream(path));

        client.joinVoiceChannel("166094007712088064", function(error, connection) {
            if (error) {
                logger.info(`Could not join voice channel: ${error}`);
            } else {
                client.voiceConnection.playFile(path);
            }
        });
    });
}