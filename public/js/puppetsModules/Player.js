var basicsComponents = require("../Components/basicsComponents");
var canvasConf = require("../modules/configCanvas");
var moduleEventController = require("../puppetsModules/EventController");

// model use for player entity
Puppets.entity('player',{components : ['position','render','size','speed']});

var PlayerController = function (){
    var params = { x:25, y:25, angle:0, width : 20, height : 20  , shape : "square", ctx : canvasConf.ctx, smoothX:0,smoothY:0};

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

Puppets.system("smoothMove",function(position,speed){
        var ctx         = render.ctx,
            strokecolor = render.Strokecolor,
            fillcolor   = render.Fillcolor,
            shape       = render.shape,
            x           = position.x,
            y           = position.y,
            angle       = position.angle,
            width       = size.width,
            height      = size.height;

            if(fillcolor!==undefined)
                ctx.fillStyle=fillcolor;
            if(strokecolor!==undefined)
                ctx.strokeStyle=strokecolor;
        ctx.clearRect(0, 0, canvasConf.domCanvas.width,canvasConf.domCanvas.height);
            console.log(fillcolor);
            ctx.beginPath();
            // mise en place de l'angle
            ctx.save();
                //deplacement vers l'objet par rapport à la camera
            ctx.translate(x,y);
                //rotate du canvas par L'angle de l'objet unity
            ctx.rotate(angle*Math.PI/180);
                //dessins du rectangle
            ctx.fillRect(( width*0.5)*-1, ( height*0.5)*-1,width,height);
                // on restaure le canvas a son etat original.
            ctx.restore();
            // on arrete de dessiner
            ctx.closePath();
    }  
},{components : ['position','speed']});
module.exports = new PlayerController();