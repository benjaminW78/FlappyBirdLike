// require Of all files Needed
var Puppets               = require("../libs/puppets");
var EasyInputs            = require("../libs/EasyInput");
var EventController       = require("../modules/EventController");
var canvasConf            = require("../modules/configCanvas");
require("../puppetsModules/blocPattern");
require("../puppetsModules/wall");
require("../Systems/render");
require("../Systems/collider");
require("../Systems/polygoneUpdate");
var modulePlayer          = require("../puppetsModules/Player");
require("../puppetsModules/camera");
require("../Systems/cameraFocus");


var Game = {
                Puppets          : Puppets,
                Inputs           : new EasyInputs(),
                ctx              : canvasConf.ctx,
                canvas           : canvasConf.domCanvas,
                playerController : modulePlayer,
                eventController  : EventController
            };


// add of input controls
Game.Inputs.addEvent("keydown", window);
Game.Inputs.addEvent("touchend", window);

Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("go-forward");}});
// Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("rebound");}});

// console.log(Game.Inputs.getKeysBind());

// create entities 

// export browserify 
module.exports = Game;
