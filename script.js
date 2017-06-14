//Could use a two-dimensional array, but a one-dimensional array is easy enough for the 8 victory conditions.  Two-dimensional array would be better for general solution on Tic-Tac-Toe board of N-size

function Board()
{
    var squares, i;
    squares = [];
    for(i = 0; i <9; i++){
        squares[i] = null;
    }
    return squares;   
}

function Player(symbol){
    this.Symbol = symbol;
}

function Game(board)
{
    var moveCount, i;
    moveCount = 0;
    
    this.Player1 = new Player('X');
    this.Player2 = new Player('O');
    if(!board){
        this.Board = new Board();
    }
    else{
        this.Board = board;
    }
    this.MoveHistory = [];
    for(i = 0; i < this.Board.length; i++){
        if(this.Board[i] !== null){
            this.MoveHistory.push( {Player: this.Board[i], Move: this.MoveHistory.length});
        }
    }
    if(this.MoveHistory.length % 2 == 0){
        this.CurrentPlayer = this.Player1;
    } else {
        this.CurrentPlayer = this.Player2;   
    }
    
    this.Winner = null;
}

Game.prototype.randomMove = function()
{
    var selectedSquare;
    while((selectedSquare === undefined) || (this.Board[selectedSquare] !== null)){
        selectedSquare = Math.floor(Math.random() * this.Board.length);
    }
    return selectedSquare;
}

Game.prototype.won = function()
{
    var i;
    //Check all possible ways to win
    if((this.Board[0] !== null) && (this.Board[0] === this.Board[1]) && (this.Board[0] === this.Board[2])){
        return this.Board[0];
    }
    
    if((this.Board[3] !== null) && (this.Board[3] === this.Board[4]) && (this.Board[3] === this.Board[5])){
        return this.Board[3];
    }
    
    if((this.Board[6] !== null) && (this.Board[6] === this.Board[7]) && (this.Board[6] === this.Board[8])){
        return this.Board[6];
    }
    
    if((this.Board[0] !== null) && (this.Board[0] === this.Board[3]) && (this.Board[0] === this.Board[6])){
        return this.Board[0];
    }
    
    if((this.Board[1] !== null) && (this.Board[1] === this.Board[4]) && (this.Board[1] === this.Board[7])){
        return this.Board[1];
    }
    
    if((this.Board[2] !== null) && (this.Board[2] === this.Board[5]) && (this.Board[2] === this.Board[8])){
        return this.Board[2];
    }
    
    if((this.Board[0] !== null) && (this.Board[0] === this.Board[4]) && (this.Board[0] === this.Board[8])){
        return this.Board[0];
    }
    
    if((this.Board[2] !== null) && (this.Board[2] === this.Board[4]) && (this.Board[2] === this.Board[6])){
        return this.Board[2];
    }
    
    for(i = 0; i < this.Board.length; i++){
        if(this.Board[i] === null){
            return false
        }
    }
    
    return "C";
}

Game.prototype.play = function(){
    var move, moveHistory;
    while(this.won() === false){
        move = this.randomMove();
        moveHistory = { Player : this.CurrentPlayer.Symbol, Move: move };
        this.MoveHistory.push(moveHistory);
        this.Board[move] = this.CurrentPlayer.Symbol;
        if(this.CurrentPlayer === this.Player1){
            this.CurrentPlayer = this.Player2;
        } else {
            this.CurrentPlayer = this.Player1;
        }
    }
    this.Winner = this.won();
}

function playGames(count, board){
    var results, i, game, boardCopy;
    results = {};
    results.X = { WinCount: 0, Histories: [] };
    results.O = { WinCount: 0, Histories: [] };
    results.C = { WinCount: 0, Histories: [] };
    for(i = 0; i < count; i++){
        if(!board){
            game = new Game();
        } else {
            boardCopy = board.slice();
            game = new Game(boardCopy);
        }
        
        game.play();
        results[game.Winner].WinCount += 1;
        results[game.Winner].Histories.push(game.MoveHistory);
    }
    return results;
}

function analyzeResults(result, move){
    var i, grouping;
    grouping = [];
    for(i = 0; i < 9; i++){
        grouping[i] = 0;
    }
    for(i = 0; i < result.Histories.length; i++){
        grouping[result.Histories[i][move].Move] += 1;
    }
    return grouping;
}

var board = new Board();

var gameResults = playGames(10000, board);

//Returns the array for best odds for player and move number
var group1 = analyzeResults(gameResults.X, 0);
var group2 = analyzeResults(gameResults.C, 0);
//console.log(group1);
//console.log(group2);

function bestOutcome(group1, group2){
    var group3, max, i;
    group3 = []
    for(i = 0; i < group1.length; i++){
        group3[i] = group1[i] + group2[i];
    }
    var max = 0;
    for(i = 1; i < group3.length; i++){
        if(group3[max] < group3[i]){
            max = i;
        }
    }
    return max;
    
    return group3;
    
}

console.log(bestOutcome(group1, group2));
//Update the board as needed to respond to changes in the situation
