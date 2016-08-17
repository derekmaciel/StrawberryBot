"use strict";

const client = require('./client');
const router = require('./router');

client.on('ready', function() {
    client.setStatusOnline();
});

client.on('message', function(message) {
    router.route(message);
});