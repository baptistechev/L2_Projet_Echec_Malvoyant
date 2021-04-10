var socket = io.connect('http://localhost:8080');

var pseudo = prompt('Quel est votre pseudo ?');
socket.emit('coGame', pseudo);
