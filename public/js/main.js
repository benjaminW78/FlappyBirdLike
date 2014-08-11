
window.onload = function(){
    start();
};

function start(){
    var game = require('./loader/game');
    
    var Game = game();
    // console.log("fuckers")
    Game.eventController.add('gameOver',function(){start();});

    var requestAnimFrame = require('./libs/requestAnimationFrame');
    (function gameloop(){    
        // clear of canvas  
        Game.ctx.clearRect(0, 0, Game.canvas.width,Game.canvas.height);
        Game.Puppets.run();
        requestAnimFrame(gameloop);

    })();
}