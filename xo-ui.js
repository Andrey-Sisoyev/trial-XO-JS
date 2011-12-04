jQuery(function($){
    var gms = new XO();
    
    jQuery("#btnNewGame").bind("click", function(){gms.newGame(1);});
    gms.on("new-game", function(){
        jQuery('.xo-cell').empty();
        gameLog("xo-log-important", "New game started.");
    });
    
    function gameCellId(xx,yy) {
        return "xo_c_" + xx + "_" + yy;
    }
    
    function gameLog(style,message) {
        jQuery('#gameStatus').prepend('<span class="' + style + '">' + message + '</span>');
    }
    
    var x,y;
    for(x = 0; x<3 ; x++) {       
        for(y = 0; y<3 ; y++) {
            (function(xx,yy) {
                jQuery("#" + gameCellId(xx,yy)).bind("click", function() { gms.makeMove(xx,yy); });
            })(x,y);
        }
    }
    gms.on("move-made", function(xx,yy) {
        var curPlayer = gms.currentPlayer();
        var playerCode = 'x';
        if(curPlayer === -1) playerCode = 'o';
        
        jQuery('#' + gameCellId(xx,yy)).append('<span>' + playerCode + "</span>");
        gameLog("xo-log-ordinary", "Player '" + curPlayer + "' made move (" + xx + "," + yy + ")!");
    });
    
    gms.on("illegal-move", function(xx,yy, msg) {
        gameLog("xo-log-err", "Illegal move! " + msg);
    });
    
    gms.on("game-over", function(winner) {
        gameLog("xo-log-important", "Player '" + winner + "' won!");
    });
    
    gms.on("switch-player", function(fromPlayer,toPlayer) {
        gameLog("xo-log-ordinary", "Player's '" + toPlayer + "' turn.");
    });
})