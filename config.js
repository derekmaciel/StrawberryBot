"use strict";

const fs = require('fs');

var config = JSON.parse(
    fs.readFileSync('config.json')
);

// Add version number from package.json to config
var pkginfo = JSON.parse(
    fs.readFileSync('package.json')
);
config["version"] = pkginfo.version;

module.exports = config;
