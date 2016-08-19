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
    var size;

    video.on('info', function(info) {
        hash.update(info._filename);
        var filename = hash.digest('hex');
        path = `audio-cache/${filename}.mp3`;
        size = info.size;
        var megs = info.size / Math.pow(1024, 2);
        
        logger.info(`Downloading ${info._filename} to ${path} size: ${megs}`);
    });

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
        play_file(path);
    });

    video.on('error', function(error) {
        logger.info(`Could not download video: ${error}`);
    });
}

function play_file(path) {
    var id = "166094007712088064";
    var timer = setInterval(function() {
        if (typeof client.voiceConnection === 'undefined' || 
                                client.voiceConnection.voiceChannel.id != id) {
            client.joinVoiceChannel(id, function(error, connection) {
                if (error) {
                    logger.info(`Could not join voice channel: ${error}`);
                } else {
                    console.log("joined");
                    var p = client.voiceConnection.playFile(path, {}, function() {
                        console.log("Begun playback");
                    });

                    p.on('error', function(error) {
                        console.log(error);
                    });

                    p.on('end', function() {
                        console.log('done.');
                    });
                }
            });
        } else {
            clearInterval(timer);
        }
    }, 3000);
}