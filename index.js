/*
 * API Primary file
 *
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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
        // Send the response
        response.end(trimmedPath);
        // Log the request path
        console.log('Received: ' + method + ' request on '  + trimmedPath + ' with:');
        console.log(queryString);
        console.log('and:');
        console.log(headers);
        console.log('Payload:');
        console.log(buffer);
    });
});

// Start the server and have it listen on port 3000
server.listen(3000, function () {
    console.log("Server's listening on port 3000 now");
});