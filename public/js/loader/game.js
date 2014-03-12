// require Of all files Needed
var Puppets = require("../libs/puppets");
var EasyInputs = require("../libs/EasyInput");
var canvasConf = require("../modules/configCanvas");
var modulePlayer = require("../puppetsModules/Player");
var moduleEventController = require("../puppetsModules/EventController");
var moduleDraw = require("../puppetsModules/draw");
// do something

var Game = {
				Puppets          : Puppets,
				Inputs           : new EasyInputs(),
				ctx              : canvasConf.ctx,
				canvas           : canvasConf.domCanvas,
				playerController : modulePlayer,
				eventController  : moduleEventController
			};

Game.Puppets.systemList(["clearCanvas","draw"]);

// add of input controls
Game.Inputs.addEvent("keydown", window);
Game.Inputs.setKeyBind('left',{"keydown":function (){Game.eventController.emit("go-forward")}});

// console.log(Game.Inputs.getKeysBind());

// create entities 

// export browserify 
module.exports = Game;
