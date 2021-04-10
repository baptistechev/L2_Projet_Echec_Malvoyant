//Initialisation du board dans le bon sens
let board = null;
let config = null;
var c = null;
socket.on('couleur',(couleur) => {
    if (couleur == 'w')
        c = 'white';
    else
        c = 'black';
    config = {
        draggable: true,
        orientation: c,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    }
    board = Chessboard('myBoard', config);
});

$(window).resize(function(){
    board.resize();
    $('.notation-322f9').css('font-size', Math.round(screen.width/45.5));
});

//Fin Initialisation

////////////////////////////////////////////////////////////////////////////////////////////////

let selectedPiece = null;
let moves = [];
let tourCourrant = 'white';

socket.on('listeCoups', (coups) =>{
    moves = coups;
});

socket.on('tourCourrant', (color) => {
    tourCourrant = color;
});

function removeGreySquares () {
    $('#myBoard .square-55d63').css('background', '')
    $('.white-1e1d7').css('background-color',whiteCaseColor);
    $('.black-3c85d').css('background-color',blackCaseColor);
}

function greySquare (square) {
    let $square = $('#myBoard .square-' + square)

    let background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    $square.css('background', background)
}

function coloration (square){

    // get list of possible moves for this square
    let pos = {
        square: square,
        verbose: true
    }

    socket.emit('listeCoups',pos,c);
    setTimeout(() => {
        // exit if there are no moves available for this square
        if (moves.length === 0) return;

        greySquare(square);

        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }

    }, 200);

}

function onDragStart (source, piece) {

    if(tourCourrant === null) return false;
    if(tourCourrant === 'white'){
        if(piece.indexOf("w") == -1) return false;
    }else{
        if(piece.indexOf("b") == -1) return false;
    }

    // do not pick up pieces if the game is over
    if(tourCourrant != c)
        return false;
    if(selectedPiece===null || source != selectedPiece.from)
        coloration(source);
}

function onDrop (source, target) {

    let coup = {
        from: source,
        to: target,
        promotion: 'b'
    };

    //Selection des pieces
    if(source === target){
        selectedPiece = (selectedPiece != null && selectedPiece.from == coup.from && selectedPiece.to == coup.to) ? null : coup;
        removeGreySquares()
        if(selectedPiece != null)
            coloration(selectedPiece.from);
        return;
    }
    jouerCoup(coup);
}

function onSnapEnd () {
    socket.emit('update');
}


let lastSquare = null;

function onMouseoverSquare (square, piece) {
    lastSquare = square;
}

function onMouseoutSquare (square, piece) {
    lastSquare = null;
}

$('#myBoard').click(()=>{
    if(selectedPiece != null && selectedPiece.from!=lastSquare){
        let coup= selectedPiece;
        coup.to = lastSquare;
        jouerCoup(coup);
    }
});

function jouerCoup(coup){
    socket.emit('coupPlateau',coup); //Le coup est joué si il est valide
    selectedPiece = null;
    removeGreySquares()
    socket.emit("tourCourrant"); //On recalcule le tour courrant
}

socket.on('update', (echiquier) =>{
    board.position(echiquier);
});
