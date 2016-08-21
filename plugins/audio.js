"use strict";

const client = require('../client');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const logger = require('../logger');

exports.COMMANDS = {
    "play": {
        help: "Play a youtube video",
        callback: play
    },
    "stop": {
        help: "Stop playing the current song",
        callback: stop
    },
    "loop": {
        help: "Toggle loop on current song",
        callback: loop
    }
};

var isLooped = false;
var pausedFromInactivity = false;

// Stop playing music if no one is in the voice channel anymore
client.on('voiceLeave', function (channel, user) {
    if (is_currently_playing() && client.voiceConnection.voiceChannel.members.length == 0) {
        logger.info("Pausing playback due to empty voice channel");
        pausedFromInactivity = true;
        client.voiceConnection.pause();
    }
});
client.on('voiceJoin', function (channel, user) {
    if (pausedFromInactivity) {
        logger.info("Playback resumed: voice channel no longer empty");
        pausedFromInactivity = false;
        client.voiceConnection.resume();
    }
});

function loop(message, args) {
    if (is_currently_playing()) {
        if (isLooped) {
            client.reply(message, "Stopping loop!");
        } else {
            client.reply(message, "Looping the current song!");
        }

        isLooped = !isLooped;
    } else {
        client.reply(message, "I'm not playing anything :confused:");
    }
}

function stop(message, args) {
    if (is_currently_playing()) {
        client.reply(message, "Got it, stopping current song.");
        vc.stopPlaying();

        // Stop loop if it's currently enabled
        isLooped = false;
    } else {
        client.reply(message, "I'm not playing anything :confused:");
    }
}

function play(message, args) {
    if (args['_'].length == 0) {
        client.reply(message, "Play what? :confused:");
        return;
    }

    var url = args['_'][0];
    var path;

    youtubedl.getInfo(url, [], function(error, info) {
        if (error) return console.warn(`Failed to get info for url ${url}: ${error}`);

        var hash = require('crypto').createHash('sha256').update(info._filename);
        var filename = hash.digest('hex');
        path = `audio-cache/${filename}.mp3`;

        fs.access(path, fs.F_OK, function (error) {
            if (error) {
                logger.debug(`Video ${url} not cached, downloading`);
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

    video.on('info', function(info) {
        var megs = (info.size / Math.pow(1024, 2)).toFixed(2);
        logger.info(`Downloading video (${megs}mb) to ${path}`);
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
    client.joinVoiceChannel("166094007712088064", function(error, connection) {
        if (error) return logger.warn(`Could not join voice channel: ${error}`);
        logger.debug(`Joined voice channel ${connection.voiceChannel.name}`);

        connection.playFile(path, {volume: 0.25}, function(error, stream) {
            if (error) return logger.warn(`Could not play ${path}: ${error}`);
            logger.debug(`Playing ${path}`);

            stream.on('error', function (error) {
                logger.warn(`Error during playback: ${error}`);
            });

            stream.on('end', function () {
                logger.debug(`Playback finished.`);

                if (isLooped) {
                    logger.debug(`Loop enabled, restarting playback`);
                    play_file(path);
                }
            });
        });
    });
}

function is_currently_playing() {
    return (typeof client.voiceConnection != 'undefined') && 
        client.voiceConnection.playing;
}