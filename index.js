/*
 * API Primary file
 *
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with a string
const server = http.createServer(function (request, response) {
    // Get the URL and parse it
    const parsedUrl = url.parse(request.url, true);
    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // Get the query string
    const queryString = parsedUrl.query;
    // Get the HTTP method
    const method = request.method.toLowerCase();
    // Get the headers
    const headers = request.headers;
    // Get the payload, if any
    const decoder = new StringDecoder('utf8');
    let buffer = '';
    request.on('data', function (data) {
        buffer += decoder.write(data);
    });
    request.on('end', function () {
        buffer += decoder.end();

        const correspondingHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        const data = {
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        correspondingHandler(data, function (statusCode, payload) {
            // Default statusCode
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            // Default payload
            payload = typeof (payload) == 'object' ? payload : {};
            const convertedPayload = JSON.stringify(payload);
            // Build and return the response
            response.setHeader('Content-Type', 'application/json')
            response.writeHead(statusCode);
            response.end(convertedPayload);
            // Log the response
            console.log('New request made');
        });

    });
});

// Start the server and have it listen on port 3000
server.listen(config.port, function () {
    console.log("Server's listening on port " + config.port + " in " + config.key + " mode");
});

// Define the handlers
const handlers = {}

// Sample handler
handlers.sample = function (data, callback) {
    // Callback a HTTP status code, and a payload object
    callback(406, {'name': 'sample handler'});
};

// Not found hanlder
handlers.notFound = function (data, callback) {
    callback(404);
};

// Define a request router
const router = {
    'sample': handlers.sample
}