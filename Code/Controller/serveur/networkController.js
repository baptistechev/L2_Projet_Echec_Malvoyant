const player = require('../../View/player.js');

let lastProfil = null;
let couleur = 'w'
nbProf = 0;

class NetworkController{

	constructor(){
	}

	onChoixCouleur(couleur,socket){
		socket.player = player.player(1,couleur,"undefined");
		lastProfil = socket.player;
	}

	onCoGame(pseudo,socket){
		if(nbProf < 2){
			if(lastProfil != null){
				socket.player = lastProfil;
				socket.player.setPseudo(pseudo);
				couleur = (socket.player.getCouleur() == 'w') ? 'b' : 'w';
				lastProfil = null;
			}else{
				socket.player = player.player(2,couleur,pseudo);
				couleur = 'b'; //pour faire des tests
			}
			nbProf++;
			socket.emit('couleur',socket.player.getCouleur());
		}else{
			console.log("Il existe déja 2 profils !!");
		}
	}
}

module.exports.networkController = function(){
	return new NetworkController();
}

