var basicsComponents = require("../Components/basicsComponents");
var canvasConf = require("../modules/configCanvas");
var moduleEventController = require("../puppetsModules/EventController");

// model use for player entity
Puppets.entity('player',{components : ['position','render','size','speed']});

var PlayerController = function (){
    var params = { x:25, y:25, angle:0, width : 100, height : 100  , shape : "square", ctx : canvasConf.ctx};

    this.init(params);
};

PlayerController.prototype.init = function(params){
	this.entityNumber = Puppets.createEntity('player',{position:{x:params.x, y:params.y , angle : params.angle}, size:{w: params.width , h: params.height} ,render:{ctx: params.ctx,shape : params.shape} });

	this.setEvents();
};

PlayerController.prototype.setEvents = function(){
	moduleEventController.add("go-forward",function(){
		var _self = Puppets.getComponents(this.entityNumber)[0];
		_self.position.y += 25; 
		console.log(_self.position.y);
	}.bind(this));
};	

module.exports = new PlayerController();