//Could use a two-dimensional array, but a one-dimensional array is easy enough for the 8 victory conditions.  Two-dimensional array would be better for general solution on Tic-Tac-Toe board of N-size

function Board() {
    "use strict";
    var squares, i;
    squares = [];
    for (i = 0; i < 9; i += 1) {
        squares[i] = null;
    }
    return squares;
}

function Player(symbol) {
    "use strict";
    this.Symbol = symbol;
}

function Game(board, calculated) {
    "use strict";
    var i;
    
    if (calculated) {
        this.Calculated = true;
    } else {
        this.Calculated = false;
    }
    
    this.Player1 = new Player('X');
    this.Player2 = new Player('O');
    if (!board) {
        this.Board = new Board();
    } else {
        this.Board = board;
    }
    this.MoveHistory = [];
    for (i = 0; i < this.Board.length; i += 1) {
        if (this.Board[i] !== null) {
            this.MoveHistory.push({Player: this.Board[i], Move: this.MoveHistory.length});
        }
    }
    this.Winner = null;
}

function Simulator(board) {
    "use strict";
    this.SimulationCount = 10000;
    this.Board = board.slice();
    this.Results = {
        X: {
            WinCount: 0,
            Histories: []
        },
        O: {
            WinCount: 0,
            Histories: []
        },
        C: {
            WinCount: 0,
            Histories: []
        }
    };
}


Game.prototype.currentPlayer = function () {
    "use strict";
    if (this.MoveHistory.length % 2 === 0) {
        return this.Player1;
    } else {
        return this.Player2;
    }
};

Game.prototype.randomMove = function () {
    "use strict";
    var selectedSquare;
    while ((selectedSquare === undefined) || (this.Board[selectedSquare] !== null)) {
        selectedSquare = Math.floor(Math.random() * this.Board.length);
    }
    return selectedSquare;
};

Game.prototype.calculatedMove = function () {
    "use strict";
    var simulator;
    simulator = new Simulator(this.Board);
    simulator.simulate();
    return simulator.choose();
};

Game.prototype.won = function () {
    "use strict";
    var i;
    //Check all possible ways to win
    if ((this.Board[0] !== null) && (this.Board[0] === this.Board[1]) && (this.Board[0] === this.Board[2])) {
        return this.Board[0];
    }
    
    if ((this.Board[3] !== null) && (this.Board[3] === this.Board[4]) && (this.Board[3] === this.Board[5])) {
        return this.Board[3];
    }
    
    if ((this.Board[6] !== null) && (this.Board[6] === this.Board[7]) && (this.Board[6] === this.Board[8])) {
        return this.Board[6];
    }
    
    if ((this.Board[0] !== null) && (this.Board[0] === this.Board[3]) && (this.Board[0] === this.Board[6])) {
        return this.Board[0];
    }
    
    if ((this.Board[1] !== null) && (this.Board[1] === this.Board[4]) && (this.Board[1] === this.Board[7])) {
        return this.Board[1];
    }
    
    if ((this.Board[2] !== null) && (this.Board[2] === this.Board[5]) && (this.Board[2] === this.Board[8])) {
        return this.Board[2];
    }
    
    if ((this.Board[0] !== null) && (this.Board[0] === this.Board[4]) && (this.Board[0] === this.Board[8])) {
        return this.Board[0];
    }
    
    if ((this.Board[2] !== null) && (this.Board[2] === this.Board[4]) && (this.Board[2] === this.Board[6])) {
        return this.Board[2];
    }
    
    for (i = 0; i < this.Board.length; i += 1) {
        if (this.Board[i] === null) {
            return false;
        }
    }
    
    return "C";
};

Game.prototype.play = function () {
    "use strict";
    var move, moveHistory, symbol;
    while (this.won() === false) {
        if(this.Calculated){
            move = this.calculatedMove();
        } else{
            move = this.randomMove();
        }
        symbol = this.currentPlayer().Symbol;
        moveHistory = { Player : symbol, Move: move };
        this.MoveHistory.push(moveHistory);
        this.Board[move] = symbol;
    }
    this.Winner = this.won();
};

Simulator.prototype.simulate = function () {
    "use strict";
    var i, game;
    for (i = 0; i < this.SimulationCount; i += 1) {
        game = new Game(this.Board.slice());
        game.play();
        this.Results[game.Winner].WinCount += 1;
        this.Results[game.Winner].Histories.push(game.MoveHistory);
    }
};

Simulator.prototype.choose = function () {
    "use strict";
    var game, group1, group2, group3, max, i;
    game = new Game(this.Board.slice());
    
    group1 = this.groupResults(this.Results[game.currentPlayer().Symbol], game.MoveHistory.length);
    
    group2 = this.groupResults(this.Results.C, game.MoveHistory.length);
    
    group3 = [];
    for (i = 0; i < group1.length; i += 1) {
        group3[i] = group1[i] + group2[i];
    }
    max = 0;
    for (i = 1; i < group3.length; i += 1) {
        if (group3[max] < group3[i]) {
            max = i;
        }
    }
    return max;
};

Simulator.prototype.groupResults = function (result, move) {
    "use strict";
    var i, grouping;
    grouping = [];
    for (i = 0; i < 9; i += 1) {
        grouping[i] = 0;
    }
    for (i = 0; i < result.Histories.length; i += 1) {
        grouping[result.Histories[i][move].Move] += 1;
    }
    return grouping;
};
function runSimulation(){
    var game = new Game(null, true);
    game.play();
    game.MoveHistory.forEach(function(move){
        //document.write("<p>" + move.Player + " chooses " + move.Move +"</p>")
        document.getElementById(move.Move).innerHTML = move.Player;
    })
}