// require Of all files Needed
var Puppets               = require("../libs/puppets");
var EasyInputs            = require("../libs/EasyInput");
var EventController       = require("../modules/EventController");
var canvasConf            = require("../modules/configCanvas");
require("../puppetsModules/ennemiPattern1");
require("../puppetsModules/gate");
// require("../puppetsModules/wall");
require("../Systems/render");
require("../Systems/cameraFocus");
require("../Systems/collider");
var modulePlayer= require("../puppetsModules/Player");
require("../puppetsModules/camera");
require("../Systems/polygoneUpdate");
require("../puppetsModules/ennemiesGenerator");
require("../Systems/killModulesPast");
function initGame(){

var Game;
    Game = {
                Puppets          : Puppets,
                Inputs           : new EasyInputs(),
                ctx              : canvasConf.ctx,
                canvas           : canvasConf.domCanvas,
                playerController : modulePlayer,
                eventController  : EventController
            };
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
