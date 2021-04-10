class Player{

    constructor(idPlayer,couleur,pseudo){
       this.idPlayer = idPlayer;
	   this.couleur = couleur;
	   this.pseudo = pseudo;
    }

    status(){
	return this.pseudo + '(' + ((this.couleur == 'w') ? 'Blanc' : 'Noir') + ')';
    }

    setPseudo(pseudo){
    	this.pseudo = pseudo;
    }

    getPseudo(){
        return this.pseudo;
    }

    getCouleur(){
        return this.couleur;
    }
}

module.exports.player = function(idPlayer,couleur,pseudo){
    return new Player(idPlayer,couleur,pseudo);
}
