class GameView{

	constructor(){

	}

	afficheCoup(echiquier,socket){

	    socket.emit('update',echiquier);
	    socket.broadcast.emit('update',echiquier);

	}

	afficheBroadcastMessage(socket,message,sender =  "console"){
		let msg = ((sender=="console") ? "" : (socket.player.status() + " : ")) + message.replace("@","");
		let voc = ((sender=="console") ? "" : (socket.player.getPseudo() + " vous envoit un message : ")) + message;
		socket.emit('chat', {text: msg, sender: sender, vocale: voc});
		socket.broadcast.emit('chat',{text: msg, sender: sender, vocale: voc});
	}

	afficheMessage(socket,message){
		socket.emit('chat',{text: message, sender: "console",vocale : message});
	}

	afficheMessageAdversaire(socket,message){
		socket.broadcast.emit('chat',{text: message, sender: "console",vocale : message});
	}
}

module.exports.gameView = function(){
	return new GameView();
}