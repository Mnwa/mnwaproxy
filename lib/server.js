module.exports = function(http, app, port){
    'use strict'
    return http.createServer(app).on('connect', function(request, socketRequest, head) {
        let url = require('url'),
            net = require('net'),
            ph = url.parse('http://' + request.url),
            socket = net.connect(ph.port, ph.hostname, function() {
            socket.write(head);
            // Сказать клиенту, что соединение установлено
            socketRequest.write("HTTP/" + request.httpVersion + " 200 Connection established\r\n\r\n");
        });
        // Туннелирование к хосту
        socket.on('data', function(chunk) {
            socketRequest.write(chunk);
        });
        socket.on('end', function() {
            socketRequest.end(); 
        });
        socket.on('error', function() {
            // Сказать клиенту, что произошла ошибка
            socketRequest.write("HTTP/" + request.httpVersion + " 500 Connection error\r\n\r\n");
            socketRequest.end();
        });
        // Туннелирование к клиенту
        socketRequest.on('data', function(chunk) { 
            socket.write(chunk); 
        });
        socketRequest.on('end', function() {
            socket.end();
        });
        socketRequest.on('error', function() {
            socket.end();
        });
    }).listen(port)
}