// app.js

var express = require("express");
var Unblocker = require("unblocker");

// Create Express Server
var app = express();

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/proxy.html');
});

// Create Unblocker Instance, and Configure Our Express Server to Use It
var unblocker = new Unblocker({ 
    prefix: "/proxy/",
    processContentTypes: ['text/html', 'text/css'],
    requestMiddleware: [],
    responseMiddleware: [],
    standardMiddleware: true,
    rewriteStyles: true,
    rewriteScripts: true,
    handleErrors: true,
    // Enhanced URL rewriting
    rewriteUrls: function(uri, response) {
        if (uri.startsWith('/')) {
            // Get the hostname from the current URL
            const targetUrl = new URL(response.redirectTo);
            return targetUrl.protocol + '//' + targetUrl.host + uri;
        }
        return uri;
    }
});
app.use(unblocker);

// Launches Server on Port 8080
app.listen(process.env.PORT || 8080).on("upgrade", unblocker.onUpgrade);
console.log("Node Unblocker Server Running On Port:", process.env.PORT || 8080);
