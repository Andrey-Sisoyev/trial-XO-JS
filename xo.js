/* 

api XO {
    void newGame(firstMove_Player) emits "new-game(first-player)";
    int get(); // 0 - not set; (+1) - x; (-1) - o
    int currentPlayer(); // 0 - not set; (+1) - x; (-1) - o
    void makeMove(x,y) emits "game-over(winner)", "switch-player(from-player, to-player)", "move-made(x,y)", "illegal-move(x,y, message)"
} 

*/   

// ======================================================
// ======================================================

function XO() {
    var allowedEvents = ["new-game","game-over","switch-player","move-made","illegal-move"];
    this._super.call(this, allowedEvents);
    
    this._inGame = false;
    this._currentPlayer = undefined; // (+1) - x; (-1) - o 
    this._table = undefined;
}

XO.prototype = Object.create(
    EventEmitter.prototype
  , { _super: {value: EventEmitter}
    , constructor: {value: XO}
    }
  );

// ========================================================
// Private:

XO.prototype._validatePlayer = function(player) {
    if(player !== -1 && player !== 1)
        throw "'" + player + "' is not a supported player ID."
}

XO.prototype._nextPlayer = function() { // int
    if(this._currentPlayer === -1)
        return 1;
    else if (this._currentPlayer === 1)
        return -1;
    else 
        throw "'" + this._currentPlayer + "' is not a supported player ID."
}

XO.prototype._isCellAvailable = function(x,y) { // boolean
    return x < 3 && x >= 0 && y >=0 && y < 3 && this.get(x,y) === 0;
}

// not used, lifted to Event level 
XO.prototype._validateCellAvailable = function(x,y) {
    if(!this._isCellAvailable(x,y))
        throw "Cell (" + x + ", " + y + ") is not available for move."
}

// not used, lifted to Event level 
XO.prototype._validateInGame = function() {
    if(!this._inGame)
        throw "Not in the game."
}

XO.prototype._clearTable = function() {
    this._table = [];
    var i,j;
    for(i = 0; i<3 ; i++) {
       col = []; this._table.push(col);
       for(j = 0; j<3 ; j++) 
           col.push(0);
    }
}

XO.prototype._winningConditionReached = function(player) { // boolean
    var wFallingDiag = true;
    var wRaisingDiag = true;
    function ofFallingDiag(x,y) { return (x === y); }
    function ofRaisingDiag(x,y) { return (x === (2 - y)); }
    
    var wRows = [true,true,true];
    var wCols = [true,true,true];
    
    var x,y;
    for(x = 0; x<3 ; x++) {       
       col = this._table[x];
       for(y = 0; y<3 ; y++) {
           var my = col[y] === player;
           
           wFallingDiag = wFallingDiag && (!ofFallingDiag(x,y) || my);
           wRaisingDiag = wRaisingDiag && (!ofRaisingDiag(x,y) || my);
           wCols[x] = wCols[x] && my;
           wRows[y] = wRows[y] && my;
        }
    }
    
    var iWin = false;
    
    var i;
    for(i = 0; i<3 ; i++) {
        iWin = iWin || wCols[i] || wRows[i];
    }
    iWin = iWin || wFallingDiag || wRaisingDiag;
    
    return iWin;
}

// ========================================================
// Public:

XO.prototype.newGame = function(firstMove_Player) {
    this._validatePlayer(firstMove_Player);
    
    this._clearTable();
    this._inGame = true;
    this._currentPlayer = firstMove_Player;
    
    this.emit("new-game", firstMove_Player);
}

XO.prototype.get = function(x,y) {
    return (this._table[x])[y];    
}

XO.prototype.currentPlayer = function() {
    return this._currentPlayer;    
}

// void makeMove(x,y) emits "game-over(winner)", "switch-player(from-player)", "move-made(x,y)", "illegal-move(x,y)"

XO.prototype.makeMove = function(x,y) {
    if(!this._inGame) {
        this.emit("illegal-move", x, y, "Not in the game!");
        return;        
    }
    if(!this._isCellAvailable(x, y)) {
        this.emit("illegal-move", x, y, "Cell isn't available!");
        return;        
    }
    
    var fromPlayer = this._currentPlayer;
    
    (this._table[x])[y] = fromPlayer;
    
    this.emit("move-made", x, y);
    
    if(this._winningConditionReached(fromPlayer)) {
        this._inGame = false;
        this.emit("game-over", fromPlayer);
    } else {
    
        this._currentPlayer = this._nextPlayer();
        
        this.emit("switch-player", fromPlayer, this._currentPlayer);        
    }
}




















