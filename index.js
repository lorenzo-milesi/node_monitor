/*
 * API Primary file
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// HTTP server
const httpServer = http.createServer(function (request, response) {
    serverLogic(request, response);
});

httpServer.listen(config.httpPort, function () {
    console.log("Server listening on port " + config.httpPort + " in " + config.key + " mode");
});

// HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'vert': fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, function (request, response) {
    serverLogic(request, response);
});

httpsServer.listen(config.httpsPort, function () {
    console.log("Server listening on port " + config.httpsPort + " in " + config.key + " mode");
});

// Server logic (for HTTP and HTTPS)
const serverLogic = function (request, response) {
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
}

// Define the handlers
const handlers = {}

// Ping handler
handlers.ping = function (data, callback) {
    callback(200);
}

// Not found hanlder
handlers.notFound = function (data, callback) {
    callback(404);
};

// Define a request router
const router = {
    'ping': handlers.ping
}