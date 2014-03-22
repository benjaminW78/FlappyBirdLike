var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

// component move smooth for player;
Puppets.component("move",function(data,entity,undefined){
    return {value:data.value||0, diviseur : data.diviseur || 1.5,direction : data.direction || 5};
});

Puppets.entity('player',{components : ['position','render','size','speed','move','collider',"polygone"]});

// system use to move player.
Puppets.system("move-forward",function(position,speed,move){
        var _speed = speed.value,
        _move      = move.value;
        _diviseur  = move.diviseur;
       
        if(_move>0){
            if(_speed<0)
                position.x-=_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur;
            else if(_speed>0)
                position.x+=_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur;

            position.y-=3*_diviseur;
            move.value-=0.1/_diviseur;  
        }
        else{
            if(position.angle==90 || position.angle==-90)
            {   
                speed.value*=-1;
                move.direction*=-1;
            }

            if(Math.sin(position.angle*Math.PI / 180)!==1&&Math.sin(position.angle*Math.PI / 180)!==-1)
                position.y += _speed*Math.sin(position.angle*Math.PI / 180);
    
            position.x += _speed*Math.cos(position.angle*Math.PI / 180);

            position.angle+= move.direction;
        }
        
},{components : ['position','speed','move']});

var PlayerController = function (){

    var params = { x:canvasConf.domCanvas.width/2, y:256, angle:90, width : 20, height : 20  , shape : "square", ctx : canvasConf.ctx, smoothX:0,smoothY:0,type:"player",lines :{}};

    params.lines = basic.computePolygone(params.x,params.y,params.width,params.height,params.angle);

    this.init(params);
};

PlayerController.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('player',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        render   :{ctx: params.ctx,shape : params.shape},
                                                        collider :{type:params.type},
                                                        polygone :{lines:params.lines}});

    this.setEvents();
};

PlayerController.prototype.setEvents = function(){

    moduleEventController.add("go-forward",function(){  
        var _self = Puppets.getComponents(this.entityNumber)[0];
        _self.move.value +=1; 
    }.bind(this));
};


// browserify export
module.exports = new PlayerController();