const game = require('../../Model/Game.js');
const view = require('../../View/gameView.js');

class GameController{

  constructor(){
    this.partie = game.game(true);
    this.gameView = view.gameView();
  }

  onCoupPlateau(coup,player,socket){

    if(this.partie.tourCourrant() == player.couleur){
        if(this.partie.estPromotion(coup) && !socket.promotion)
          this.onPromotion(socket,coup);
        else{
          if(this.partie.jouerCoupPlateau(coup) != null){

            this.gameView.afficheMessageAdversaire(socket, "Votre adversaire a joué "+ coup.from + " vers "+ coup.to);
            this.resetAndUpdate(socket);//Envoit a la vue et reset les var

           }else{

            this.gameView.afficheMessage(socket,"Coup Invalide ! ");         
           }
        }
     }else
      this.gameView.afficheMessage(socket,"Ce n'est pas votre Tour !");
  }

  onCoupChat(coup,player,socket){

    if(this.partie.tourCourrant() == player.couleur){

      if(!socket.estValide){  
          let cp = this.partie.verifCoup(coup,player);
          if( cp .from!= null){ // Il y a un coup valide

            if(this.partie.estPromotion(cp) && !socket.promotion){
              this.onPromotion(socket,cp);
              return;
            }
            socket.estValide = true;
            socket.coup = cp;
            socket.validation = (!socket.confirmation);
            if(!socket.validation)
              this.gameView.afficheMessage(socket, "Vous voulez jouer "+cp.from+" vers "+cp.to+" ? (Oui/Non)");
          }else{
            this.gameView.afficheMessage(socket, "Coup Invalide !");
         }
       }

       if(socket.validation){ //Si le coup a été confirmé

          this.partie.jouerCoupPlateau(socket.coup); //joue le coup
          this.gameView.afficheMessageAdversaire(socket, "Votre adversaire a joué "+ socket.coup.from + " vers "+ socket.coup.to);
          
          this.resetAndUpdate(socket);
          
      }
    }else{
      this.gameView.afficheMessage(socket, "Ce n'est pas votre Tour !")
    }
  }

   onPromotion(socket,coup){
    this.gameView.afficheMessage(socket,"Ce coup vous permet de promouvoir votre pion, Choisissez votre nouvelle pièce ! (Q/B/N/R)");         
    socket.estValide = true;
    socket.promotion = true;
    socket.coup = coup;
    }

  resetAndUpdate(socket){
    socket.coup="";
    socket.estValide = false;
    socket.validation = false;
    socket.promotion = false;

    if(this.partie.echec()){
      this.gameView.afficheBroadcastMessage(socket,"Echec !");
    }


    this.gameView.afficheCoup(this.partie.etat(),socket); //envoit a la vue
    this.onTourCourrant(socket);

    if(this.partie.end()) this.gameView.afficheBroadcastMessage(socket,this.partie.stringEnd(player));
  }

  onListeCoups(pos,socket,couleur){
    let c = (couleur == "white") ? 'w' : 'b';
    if(this.partie.tourCourrant() == c){
      socket.emit('listeCoups', this.partie.listeDesCoups(pos));
    }
  }

  onTourCourrant(socket){
    let tourCourrant = ((this.partie.tourCourrant() === 'w')? 'white' : 'black');
    if(this.partie.end())
      tourCourrant = null;
    socket.emit('tourCourrant', tourCourrant);
    socket.broadcast.emit('tourCourrant', tourCourrant);
  }

  onLoad(load,socket){

    if(this.partie.verifLoad(load)){
      this.gameView.afficheCoup(this.partie.etat(),socket);
    }else{
      this.gameView.afficheMessage(socket,"Les données de la partie sont érronées.");
      }
    }

  onUpdate(socket){
    this.gameView.afficheCoup(this.partie.etat(),socket);
  }

  quelPiece(socket,square){
    this.gameView.afficheMessage(socket, this.partie.pieceSurCase(square));
  }

  quelsCases(socket,player,piece){
    this.gameView.afficheMessage(socket, this.partie.casePiece(player,piece));
  }

}

module.exports.gameController = function(){
  return new GameController();
}
