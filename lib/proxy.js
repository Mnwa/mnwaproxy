module.exports = function(app){
    'use strict'
    let http = require('http'),
        url = require('url');
    return app.all('*', function(req,res){
        let ph = url.parse(req.url),
            options = {
                port: ph.port,
                hostname: ph.hostname,
                method: req.method,
                path: ph.path,
                headers: req.headers
            },
            proxyRequest = http.request(options);
        
        proxyRequest.on('response', function(proxyResponse) {
            proxyResponse.on('data', function(chunk) {
                res.write(chunk, 'binary');
            });
            proxyResponse.on('end', function() {
                res.end() 
            });
            res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        });
        req.on('data', function(chunk) {
            proxyRequest.write(chunk, 'binary');
        });
        req.on('end', function() {
            proxyRequest.end(); 
        });
    });
}