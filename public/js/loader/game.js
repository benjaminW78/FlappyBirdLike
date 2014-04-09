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
var modulePlayer          = require("../puppetsModules/Player");
require("../puppetsModules/camera");
require("../Systems/polygoneUpdate");
require("../puppetsModules/ennemiesGenerator");
require("../Systems/killModulesPast");

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
Game.Inputs.addEvent("touchend", Game.canvas);
Game.Inputs.addEvent("gamepad", window);

Game.Inputs.setKeyBind("gamepad",function (e){Game.eventController.emit("go-moveAround",e.axes["stick-left-x"],e.axes["stick-left-y"]);});
Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("go-forward");}});

Game.eventController.add('gameOver',function(){window.location=window.location;});

// Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("rebound");}});

// console.log(Game.Inputs.getKeysBind());

// create entities 

// export browserify 
module.exports = Game;
