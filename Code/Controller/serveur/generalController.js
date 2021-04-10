const nC = require('./networkController.js');
const gaC = require('./gameController.js');
const cC = require('./chatController.js');

class GeneralController{

	constructor(){
		this.networkController = nC.networkController();
		this.chatController = cC.chatController();
		this.gameController = gaC.gameController();
	}

	handleEvent(socket){

		socket.on('couleur', (couleur) =>{
	        this.networkController.onChoixCouleur(couleur,socket);
	    });

	    socket.on('coGame', (pseudo) =>{
	        this.networkController.onCoGame(pseudo,socket);
	    });

	    socket.on('chat', (message) =>{
	        this.chatController.onMessage(socket,socket.player,message);
	    });

	    socket.on('listeCoups', (pos,couleur) =>{
	        this.gameController.onListeCoups(pos,socket,couleur);
	    });

	    socket.on('tourCourrant', () =>{
	        this.gameController.onTourCourrant(socket);
	    });

	    socket.on('coupPlateau', (coup) =>{
	        this.gameController.onCoupPlateau(coup,socket.player,socket);
	    });

	    socket.on('update', () =>{
	        this.gameController.onUpdate(socket);
	    });
	}

}

module.exports.generalController = function(){
	return new GeneralController();
}

	