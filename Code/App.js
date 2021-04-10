const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
const gC = require('./Controller/serveur/generalController.js');

app.use(express.static(__dirname + '/HTML/'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/HTML/index.html'));
});

app.get('/game', function (req, res) {
    res.sendFile(path.join(__dirname + '/HTML/game.html'));
});

let generalController = gC.generalController();

io.sockets.on('connection', function (socket, player) {	

    generalController.handleEvent(socket);
    
});

server.listen(8080);
