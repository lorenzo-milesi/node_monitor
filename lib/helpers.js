/**
 * Helpers
 *
 */

const crypto = require('crypto');
const config = require('./config');

const helpers = {};

helpers.hash = (str) => {
    if (typeof str == 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    } else {
        return false;
    }
};

helpers.jsonToObject = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};


module.exports = helpers;