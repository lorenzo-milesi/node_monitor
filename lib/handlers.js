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
    let firstName = required(data, 'firstName') ? data.payload.firstName.trim() : false;
    let lastName = required(data, 'lastName') ? data.payload.lastName.trim() : false;
    let phone = required(data, 'phone') && exactLength(data, 'phone', 10) ? data.payload.phone.trim() : false;
    let password = required(data, 'password') ? data.payload.password : false;
    let tosAgreement = typeof data.payload.tosAgreement == 'boolean' && data.payload.tosAgreement === true;

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
handlers._users.get = (data, callback) => {
};
handlers._users.put = (data, callback) => {
};
handlers._users.delete = (data, callback) => {
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
