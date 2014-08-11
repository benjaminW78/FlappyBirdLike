// require Of all files Needed
var Puppets               = require("../libs/puppets");
var EasyInputs            = require("../libs/EasyInput");
var EventController       = require("../modules/EventController");
var canvasConf            = require("../modules/configCanvas");
// var Game;
var Puuppets = new Puppets();
var count = 0;
function initGame(){

    window.Game = {
                Puppets          :  Puuppets,
                Inputs           : new EasyInputs(),
                ctx              : canvasConf.ctx,
                canvas           : canvasConf.domCanvas,
                // playerController : new modulePlayer(),   
                eventController  : EventController
            };

var modulePlayer= require("../puppetsModules/Player");
// console.log("FDEPUTERIEEEEEEEEEEEEE");
    require("../Components/basicsComponents");


var cam = require("../puppetsModules/camera");
    Game.playerController = new modulePlayer(Game);
    new cam(300,-300);
    require("../Systems/render");
    require("../puppetsModules/ennemiPattern1");
    require("../puppetsModules/gate");
    // require("../puppetsModules/wall");
    require("../Systems/collider");
    require("../Systems/polygoneUpdate");
    require("../puppetsModules/ennemiesGenerator");
    require("../Systems/killModulesPast");
    require("../Systems/cameraFocus");
    window.addEventListener("touchstart",function(){console.log("TOUCH START BIATCH ");Game.eventController.emit("go-forward");});
    return Game;
}

// add of input controls
// Game.Inputs.addEvent("keydown", window);
// Game.Inputs.addEvent("touchstart", Game.canvas);

// Game.Inputs.setKeyBind(0,{"touchstart":function (){console.log("TOUCH START BIATCH ");Game.eventController.emit("go-forward");}});

// Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("rebound");}});

// console.log(Game.Inputs.getKeysBind());

// create entities 

// export browserify 
module.exports = initGame;
