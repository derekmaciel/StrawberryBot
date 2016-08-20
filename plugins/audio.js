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
        if (error) return console.warn(`Failed to get info for url ${url}: ${error}`);

        var megs = (info.size / Math.pow(1024, 2)).toFixed(2);

        hash.update(info._filename);
        var filename = hash.digest('hex');
        path = `audio-cache/${filename}.mp3`;

        fs.access(path, fs.constants.F_OK, function (error) {
            if (error) {
                logger.info(`Downloading video (${megs}mb) to ${path}`);
                download_file_then_play(url, path);
            } else {
                logger.debug(`Video already downloaded (${path}), using cached file`);
                play_file(path);
            }
        });
    });
}

function download_file_then_play(url, path) {
    var video = youtubedl(url, ['--extract-audio', '--audio-format', 'mp3']);

    var stream = fs.createWriteStream(path);
    video.pipe(stream);

    video.on('end', function() {
        logger.info(`Download complete.`);
        play_file(path);
    });

    video.on('error', function(error) {
        logger.info(`Could not download video: ${error}`);
    });
}

function play_file(path) {
    client.joinVoiceChannel("166094007712088064", function(error, connection) {
        if (error) return logger.warn(`Could not join voice channel: ${error}`);

        connection.playFile(path, {volume: 0.25});
    });
}