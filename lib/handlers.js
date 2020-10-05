/**
 * Request handlers
 *
 */

const _data = require('./data');
const helpers = require('./helpers');

const handlers = {};

handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

handlers._users.post = (data, callback) => {
    const firstName = required(data, 'firstName') ? data.payload.firstName.trim() : false;
    const lastName = required(data, 'lastName') ? data.payload.lastName.trim() : false;
    const phone = required(data, 'phone') && exactLength(data, 'phone', 10) ? data.payload.phone.trim() : false;
    const password = required(data, 'password') ? data.payload.password : false;
    const tosAgreement = typeof data.payload.tosAgreement == 'boolean' && data.payload.tosAgreement === true;

    if (firstName && lastName && phone && password && tosAgreement) {
        _data.read('users', phone, (err, data) => {
            if (err) {
                const hashedPassword = helpers.hash(password);

                if (hashedPassword) {
                    const userObject = {
                        "firstName": firstName,
                        "lastName": lastName,
                        "phone": phone,
                        "hashedPassword": hashedPassword,
                        'tosAgreement': true,
                    };

                    _data.create('users', phone, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not create the new user'});
                        }
                    });
                } else {
                    callback(500, {'Error': "Could not hash the user's password"});
                }

            } else {
                callback(400, {'Error': 'A user with that phone number already exists'});
            }
        });
    } else {
        callback(400, {'Error': 'Missing required fields'});
    }
};

// @todo : Only let authenticated user access their object.
handlers._users.get = (data, callback) => {
    const phone = typeof data.queryString.phone == 'string' && data.queryString.phone.trim().length === 10 ? data.queryString.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error': 'Missing or incorrect phone field'});
    }
};

// @todo : Only let authenticated user update their object.
handlers._users.put = (data, callback) => {
    const phone = required(data, 'phone') && exactLength(data, 'phone', 10) ? data.payload.phone.trim() : false;

    // Optional fields
    const firstName = required(data, 'firstName') ? data.payload.firstName.trim() : false;
    const lastName = required(data, 'lastName') ? data.payload.lastName.trim() : false;
    const password = required(data, 'password') ? data.payload.password : false;
    const tosAgreement = typeof data.payload.tosAgreement == 'boolean' && data.payload.tosAgreement === true;

    if (phone) {
        if (firstName || lastName || password) {
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    // Update
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // Store
                    _data.update('users', phone, userData, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not update the user'});
                        }
                    });
                } else {
                    callback(400, {'Error': 'User does not exists'});
                }
            });
        } else {
            callback(400, {'Error': 'Missing fields to update'});
        }
    } else {
        callback(400, {'Error': 'Missing or incorrect phone field'});
    }
};

// @todo : Only let authenticated user delete their object.
handlers._users.delete = (data, callback) => {
    const phone = typeof data.queryString.phone == 'string' && data.queryString.phone.trim().length === 10 ? data.queryString.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                _data.delete('users', phone, (err) => {
                    if(!err) {
                        callback(200);
                    } else {
                        callback(500, {'Error': 'Could not delete the user'});
                    }
                })
            } else {
                callback(400, {'Error': 'Could not find the user'});
            }
        });
    } else {
        callback(400, {'Error': 'Missing or incorrect phone field'});
    }
};

handlers.ping = (data, callback) => callback(200);

handlers.notFound = (data, callback) => callback(400);

module.exports = handlers;

/**
 * Make field as required
 * @param {{}} data
 * @param {string} field
 * @returns {boolean}
 */
const required = (data, field) => {
    return typeof data.payload[field] == 'string' && data.payload[field].trim().length > 0;
};

/**
 * Checks a field matches a length.
 * @param {{}} data
 * @param {string} field
 * @param {number} length
 * @returns {boolean}
 */
const exactLength = (data, field, length) => {
    return data.payload[field].trim().length === length;
};
