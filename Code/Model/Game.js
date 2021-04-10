const Chess = require('chess.js').Chess;
let chess = new Chess();

class Game{

    constructor(time){
      this.time = time;
    }

    verifCoup(coup,player){
      let From = this.positionsPossible(coup.piece,player);
      let cp = coup;
      let cp2 = {
        from: null,
        to: coup.to,
        promotion: coup.promotion
      };
      From.forEach( (f) =>{
        cp.from = f;
        if(this.verifCoup2Aux(cp)){
          cp2.from  = f;
        }
      });
      return cp2;
    }

    verifCoup2Aux(coup){

      let x = false;
      let lC = this.listeDesCoups({square: coup.from, verbose: true});
      lC.forEach( (cp) =>{
        if(cp.to == coup.to)
          x = true;
      });
      return x;
    }

    estPromotion(coup){

      let x = false;
      let lCoups = this.listeDesCoups({square: coup.from, verbose: true});
      lCoups.forEach( (c) =>{
        x = x || c.promotion!=null;
      });
      return x;

    }

    jouerCoupPlateau(coup){
      return chess.move(coup);
    }

    listeDesCoups(pos){
      return chess.moves(pos);
    }

    tousLesCoups(){
      return chess.moves();
    }

    tourCourrant(){ //renvoit la couleur du joueur dont c'est la tour
        return chess.turn();
    }

    jouerCoup(coup){
      chess.move(coup);
    }

    etat(){
        return chess.fen();
    }

    end(){ //
      return chess.game_over();
    }

    echec(){
      return chess.in_check();
    }

    stringEnd(player){ //Renvoie String si le jeu s'est terminé via échec et mat, blocage, triple répétition ou manque de pièces.
       let M ;
      if (chess.in_checkmate()){
      	M = "Echec et mat ! Le joueur "+player.status()+" a gagné la partie !";
      }
      if(chess.in_stalemate()){
      	M ="Partie nulle ! Pat, le jeu est bloqué";
      }
      if(chess.insufficient_material()){
      	M ="Partie nulle ! Nombre de pièces insuffisant";
      }
      if(chess.in_threefold_repetition()){
      	M = " Partie nulle ! Triple répétition";
      }
      return M ;
    }

    verifLoad(load){
      return chess.load(load);
    }

    pieceSurCase(square){
      let msg="";
      if(chess.get(square)==null)
        return "Il n'y a pas de piece ici "
      switch (chess.get(square).type){
        case "p":
          msg = 'Un pion';
          break;
        case "r":
          msg = 'Une tour';
          break;
        case "n":
          msg = 'Un cavalier';
          break;
        case "b":
          msg = 'Un fou';
          break;
        case "q":
          msg = 'La reine';
          break;
        case "k":
          msg = 'Le roi';
          break;
      }
      msg+=" se trouve en "+square;
      return msg;
    }

    casePiece(player,piece){
      
      let tab = this.positionsPossible(piece,player);
      let p = piece.toLowerCase();
      p = (p=="")? "p":p;
      let msg = "";

      if(tab.length==0)
        return "Vous ne disposez plus de cette piece sur le plateau !"

      switch (p){
        case "p":
          msg = 'Les pions se trouvent en ';
          break;
        case "r":
          msg = 'Les tours se trouvent en ';
          break;
        case "n":
          msg = 'Les cavaliers se trouvent en ';
          break;
        case "b":
          msg = 'Les fous se trouvent en ';
          break;
        case "q":
          msg = 'La reine se trouve en ';
          break;
        case "k":
          msg = 'Le roi se trouve en ';
          break;
      }

      for(let i = 0;i<tab.length;i++){
        msg+= tab[i];
        msg+= (tab[i+1]!=null)?", ":"";
      }
      return msg;

    }

    positionsPossible(piece,player){
      let tab = [];
      let p = piece.toLowerCase();
      p = (p=="")? "p":p;
      this.checkCase(p,'a',tab,player.getCouleur());
      this.checkCase(p,'b',tab,player.getCouleur());
      this.checkCase(p,'c',tab,player.getCouleur());
      this.checkCase(p,'d',tab,player.getCouleur());
      this.checkCase(p,'e',tab,player.getCouleur());
      this.checkCase(p,'f',tab,player.getCouleur());
      this.checkCase(p,'g',tab,player.getCouleur());
      this.checkCase(p,'h',tab,player.getCouleur());
      return tab;
    }

    checkCase(piece,char,tab,color){
      for(let i = 0;i<9;i++){
        if(chess.get(char+i)!=null && chess.get(char+i).type == piece && chess.get(char+i).color == color)
          tab.push(char+i);
      }
    }

    generateFen(){
      console.log(chess.fen());
      return chess.fen();
    }


}

module.exports.game = function(time){
    return new Game(time);
}
