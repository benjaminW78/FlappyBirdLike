// require Of all files Needed
var Puppets               = require("../libs/puppets");
var EasyInputs            = require("../libs/EasyInput");
var EventController       = require("../modules/EventController");
var canvasConf            = require("../modules/configCanvas");
require("../puppetsModules/blocPattern");
require("../Systems/render");
require("../Systems/collider");
require("../Systems/polygoneUpdate");
var modulePlayer          = require("../puppetsModules/Player");

// do something
// Game.Puppets.systemList(["draw"]);

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
Game.Inputs.addEvent("touch", window);
Game.Inputs.setKeyBind('left',{"keydown":function (){Game.eventController.emit("go-forward");}});

// console.log(Game.Inputs.getKeysBind());

// create entities 

// export browserify 
module.exports = Game;
