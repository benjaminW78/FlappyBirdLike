// require Of all files Needed
var Puppets = require("../libs/puppets");
var EasyInputs = require("../libs/EasyInput");
var canvasConf = require("../modules/configCanvas");

// do something
var Game = {
				Puppets : new Puppets(),
				Inputs  : new EasyInputs(),
				ctx     : canvasConf.ctx,
				canvas  : canvasConf.domCanvas
			};
// add of input controls
// Game.Inputs.addEvent("keydown", window);
// Game.Inputs.setKeyBind('left');

console.log(Game.Inputs.getKeysBind());





// export browserify 
module.exports = Game;
