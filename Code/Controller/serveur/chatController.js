const gameC = require('./gameController.js');
const view = require('../../View/gameView.js');
const ent = require('ent');

class ChatController{

	constructor(){
		this.gameController = gameC.gameController(); 
		this.gameView = view.gameView();
		this.confirmation = true;
	}

	onMessage(socket,player,message){

		message = ent.encode(message);
	
		socket.confirmation = this.confirmation;
		//Trie des messages

		if(message.indexOf("@") == 0){//Si message normal

			this.gameView.afficheBroadcastMessage(socket,message.replace("@",""),player.getCouleur());

		}else if(message.indexOf("/") == 0){			
			this.onCommande(socket,player,message.replace("/",""));
		}else{ // Si c'est un coup ou autre
		//trier

			if(socket.promotion)
				this.choixPromotionMessage(socket,player,message.toLowerCase());
			else if(socket.estValide)
				this.validationMessage(socket,player,message.toLowerCase());
			else
				this.chatParser(socket,player,message);
		}
	}

	onCommande(socket,player,message){
		if(message.includes('help'))
			this.gameView.afficheMessage(socket, "Liste des commandes : \n /fen \n /generateFen \n /moves \n /confirmation");
		else if(message.includes('fen')){
			this.gameView.afficheMessage(socket, "Chargement de la fen ...");
			message = message.replace("fen ","");
			this.gameController.onLoad(message,socket);
		}else if(message.includes('generateFen')){
			this.gameView.afficheMessage(socket, "fen : "+ this.gameController.partie.generateFen());
		}else if(message.includes('moves')){			
			this.gameView.afficheMessage(socket, "Liste des coups : " + this.gameController.partie.tousLesCoups());
			console.log(this.gameController.partie.tousLesCoups());
		}else if(message.includes('confirmation')){
			message = message.replace("confirmation ","");
			if(message.includes('on')){
				this.confirmation = true;
			}else if(message.includes('off')){
				this.confirmation = false
			}
			this.gameView.afficheMessage(socket, "La double confirmation est " +((this.confirmation)? 'activé' : 'désactivé'));
		}else
			this.gameView.afficheMessage(socket, "Cette commande n'existe pas ! Faite /help pour avoir la liste des commandes !");	
	}

	choixPromotionMessage(socket,player,message){
		if(message == 'b' || message == 'q' || message == 'n' || message == 'r'){
			socket.coup.promotion = message;
			this.gameController.onCoupPlateau(socket.coup,player,socket);
			this.gameController.onTourCourrant(socket);
		}else{
			this.gameView.afficheMessage(socket,"Selectionnez une piece ! (Q/B/N/R)");
		}
	}

	validationMessage(socket,player,message){
		if(message == "oui"){
			socket.validation = true;
			this.gameController.onCoupChat(message,player,socket);
		}else if(message == "non"){
			socket.estValide = false;	
		}else{
		this.gameView.afficheMessage(socket,"Veuillez confirmer votre coup en entrant 'oui' ou 'non'");
		}
	}

	chatParser(socket,player,message){
		let msg = message.toLowerCase();

		if(this.includePieces(msg)!=null || this.includeSquare(msg)!=null){
			
			let piece1 =null, piece2=null,square=null;
			piece1=this.includePieces(msg);
			let id1=-1,id2=-1;
			switch (piece1){
				case "":
					id1 = msg.indexOf('pion');
					msg = msg.replace('pion',"");
					break;
				case "R":
					id1 = msg.indexOf('tour');
					msg = msg.replace('tour',"");
					break;
				case "N":
					id1 = (msg.indexOf('cavalier') == -1)? msg.indexOf('chevalier') : id1 = msg.indexOf('cavalier');
					msg = msg.replace('cavalier',"").replace('chevalier',"");
					break;
				case "B":
					id1 = msg.indexOf('fou');
					msg = msg.replace('fou',"");
					break;
				case "Q":
					id1 = (msg.indexOf('reine') == -1)? msg.indexOf('dame') : id1 = msg.indexOf('reine');
					msg = msg.replace('reine',"").replace("dame","");
					break;
				case "K":
					id1 = msg.indexOf('roi');
					msg = msg.replace('roi',"");
					break;
			}
			piece2=this.includePieces(msg);
			square=this.includeSquare(msg);

			if(piece1==null){ //L'utilisateur demande la piece sur la case 
				this.gameController.quelPiece(socket,square);
			}else if(square==null){//L'utilisateur demande ou se trouve la piece
				this.gameController.quelsCases(socket,player,piece1);
			}else if(piece2 == null){//Mouvement simple
				let coup = {
					from: null,
     				to: square,
        			promotion: 'b',
        			piece: piece1
				}
				this.gameController.onCoupChat(coup,player,socket);	
			}else{ //Prise

				switch (piece2){
					case "":
						id2 = message.indexOf('pion');
						break;
					case "R":
						id2 = message.indexOf('tour');
						break;
					case "N":
						id2 = (message.indexOf('cavalier') == -1)? message.indexOf('chevalier') : message.indexOf('cavalier');
						break;
					case "B":
						id2 = message.indexOf('fou');
						break;
					case "Q":
						id2 = (message.indexOf('reine') == -1)? message.indexOf('dame') : message.indexOf('reine');
						break;
					case "K":
						id2 = message.indexOf('roi');
						break;
				}
				if(id2<id1){
					let pie = piece2;
					piece2 = piece1;
					piece1 = pie;
				}

				let coup = {
					from: null,
     				to: square,
        			promotion: 'b',
        			piece: null
				}				

				if(msg.indexOf('avec')!=-1){
					coup.piece = piece2;
				}else{
					coup.piece = piece1;
				}

				this.gameController.onCoupChat(coup,player,socket);
				
			}

			//this.gameView.afficheMessage(socket, piece1+","+piece2+","+square);

		}else{
			this.gameView.afficheMessage(socket,"Votre message n'est pas bien formé, Utilisez le caractère spécial @ pour envoyer un message !");
			return null;
		}


	}

	includePieces(message){
		if(message.includes('pion')){
			return "";
		}else if(message.includes('tour')){
			return "R";
		}else if(message.includes('cavalier' ||  message.includes('chevalier'))){
			return "N";
		}else if(message.includes('fou')){
			return "B";
		}else if(message.includes('reine') || message.includes('dame')){
			return "Q";
		}else if(message.includes('roi')){
			return "K";
		}else{
			return null;
		}
	}

	includeSquare(message){

		let index = message.search(/[a-h][0-8]/);
		if(index!=-1)
			return message.substring(index, index+2);
		else
			return null;
	}

}

module.exports.chatController = function(){
	return new ChatController();
}