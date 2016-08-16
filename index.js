"use strict";

const client = require('./client');
const Router = require('./router');

var cmdrouter;

client.on('ready', function() {
    client.setStatusOnline();
    cmdrouter = new Router(client);
});

client.on('message', function(message) {
    cmdrouter.route(message);
});