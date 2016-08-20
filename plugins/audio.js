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

    var url = args['_'][0];
    var path;

    youtubedl.getInfo(url, [], function(error, info) {
        if (error) {
            console.warn(`Failed to get info for url ${url}: ${error}`);
            return;
        }

        var megs = (info.size / Math.pow(1024, 2)).toFixed(2);

        hash.update(info._filename);
        var filename = hash.digest('hex');
        path = `audio-cache/${filename}.mp3`;
        
        logger.info(`Downloading ${info._filename} (${megs}mb) to ${path}`);
    });

    var video = youtubedl(url, ['--extract-audio', '--audio-format', 'mp3']);

    var stream = fs.createWriteStream(path);
    video.pipe(stream);    

    var pos = 0;
    video.on('data', function (chunk) {
        pos += chunk.length;
        var progress = ((pos / size) * 100).toFixed(2);
        logger.debug(`Progress: ${progress}`);
    });

    video.on('end', function() {
        logger.info(`Download complete.`);
        client.joinVoiceChannel("166094007712088064", function(error, connection) {
            var p = client.voiceConnection.playFile(path, {volume: 0.25});
        });
    });

    video.on('error', function(error) {
        logger.info(`Could not download video: ${error}`);
    });
}