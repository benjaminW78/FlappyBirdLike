window.onload = function(){

    var Game = require('./loader/game');
    var requestAnimFrame = require('./libs/requestAnimationFrame');

    (function gameloop(){    
            Game.Puppets.run();
            requestAnimFrame(gameloop);
    })();
};