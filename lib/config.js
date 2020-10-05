/*
 * Configuration variables
 */

const environments = {};
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'key': 'staging',
    'hashingSecret': '19dKWPZ0etjyjWsbcRAQmrPhutIaWtZL'
}
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'key': 'production',
    'hashingSecret': 'PdKJhVIH4PbU94aAXZQR5TNSKPZAjxus'
}

const processedEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';
module.exports = environments[processedEnvironment];