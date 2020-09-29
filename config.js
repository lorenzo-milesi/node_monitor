/*
 * Configuration variables
 */

const environments = {};
environments.staging = {
    'port': 3000,
    'key': 'staging'
}
environments.production = {
    'port': 5000,
    'key': 'production'
}

const processedEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';
module.exports = environments[processedEnvironment];