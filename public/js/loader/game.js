// require Of all files Needed
var Puppets = require("../libs/puppets");
var EasyInputs = require("../libs/EasyInput");
var canvasConf = require("../modules/configCanvas");
var modulePlayer = require("../puppetsModules/Player");
var moduleDraw = require("../puppetsModules/draw");
var basicsComponents = require("../Components/basicsComponents");
// do something
var Game = {
				Puppets : Puppets,
				Inputs  : new EasyInputs(),
				ctx     : canvasConf.ctx,
				canvas  : canvasConf.domCanvas
			};

// add of input controls
// Game.Inputs.addEvent("keydown", window);
// Game.Inputs.setKeyBind('left');

console.log(Game.Inputs.getKeysBind());

// create entities 

// instantiate player entity
Puppets.createEntity('player',{position:{x:150, y:100 , angle : 45}, size:{w: 100 , h: 80} ,render:{ctx: Game.ctx} });


// export browserify 
module.exports = Game;
