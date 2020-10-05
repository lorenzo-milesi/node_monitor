/*
 * Data Storing and Editing
 */

const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container
let lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');
lib.getPath = (dir, file) => lib.baseDir + dir + '/' + file + '.json';

lib.create = (directory, file, data, callback) => {
    fs.writeFile(lib.getPath(directory, file), JSON.stringify(data), callback);
};

lib.read = (directory, file, callback) => {
    fs.readFile(lib.getPath(directory, file), 'utf8', (err, data) => {
        !err && data ? callback(false, helpers.jsonToObject(data)) : callback(err, data);
    });
};

lib.update = (directory, file, data, callback) => {
    fs.truncate(lib.getPath(directory, file), (err) => {
        if (err) callback(err);
        fs.writeFile(lib.getPath(directory, file), JSON.stringify(data), callback);
    });
};

lib.delete = (directory, file, callback) => {
    fs.unlink(lib.getPath(directory, file), callback);
};

module.exports = lib;
