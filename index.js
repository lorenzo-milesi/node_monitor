/*
 * API Primary file
 *
 */

// Dependencies
const http = require('http');
const url = require('url');

// The server should respond to all requests with a string
const server = http.createServer(function (request, response) {
    // Get the URL and parse it
    const parsedUrl = url.parse(request.url, true);
    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // Get the query string as an object
    const queryString = parsedUrl.query;
    // Get the HTTP method
    const method = request.method.toLowerCase();
    // Send the response
    response.end(trimmedPath);
    // Log the request path
    console.log('Received: ' + method + ' request on '  + trimmedPath + ' with : ', queryString);
});

// Start the server and have it listen on port 3000
server.listen(3000, function () {
    console.log("Server's listening on port 3000 now");
});