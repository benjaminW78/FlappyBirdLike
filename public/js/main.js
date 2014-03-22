window.onload = function(){

    var Game = require('./loader/game');
    var requestAnimFrame = require('./libs/requestAnimationFrame');

    (function gameloop(){    
        // clear of canvas  
        Game.ctx.clearRect(0, 0, Game.canvas.width,Game.canvas.height);
        Game.Puppets.run();
        requestAnimFrame(gameloop);

    })();
};