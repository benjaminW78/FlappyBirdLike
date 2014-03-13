var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../puppetsModules/EventController");

// entity move smooth for player;
Puppets.component("move",function(data,entity,undefined){
    return { timer: 0,value : data.value || 0,diviseur : data.diviseur || 2 ,direction : data.direction || 1};
});

Puppets.component("clock",function(data,entity,undefined){
    return { value : data.value || 2 };
});
// model use for player entity

Puppets.entity('player',{components : ['position','render','size','speed','move']});

// system use to go forward.
Puppets.system("move-forward",function(position,speed,move){
        var _speed = speed.value,
        _move      = move.value;
        _diviseur  = move.diviseur;
        move.timer+=1;
        if(move.value>0){
            position.y-=2*_diviseur;
            move.value-=0.2/_diviseur;  
        }
        // console.log(_speed*Math.cos(position.angle),_speed,position.angle)
        if(position.angle==90 || position.angle==-90)
            speed.value*=-1;
        
        var toto = 0.5;
        if(move.timer%60<=50)
            toto = 0.5;
        position.x += _speed*toto*Math.cos(position.angle*Math.PI / 180);
        position.y += _speed*toto*Math.sin(position.angle*Math.PI / 180);

        if(position.angle==90 || position.angle==-90)
            move.direction*=-1

        position.angle+=move.direction;

        // console.log(position.angle)


},{components : ['position','speed','move']});
// // system to move automaticaly player by sinus and cosinus
// Puppets.system("move-auto",function(position,speed,move){
//     var _speed = speed.value,
//      _move = move.value;
//      _diviseur = move.diviseur;

//      if(move.value>0){
//          position.y+=_speed/_diviseur;
//          move.value-=0.2/_diviseur;  
//      }
//     ;
// },{components : ['position','speed','move']});

var PlayerController = function (){
    var params = { x:250, y:200/2, angle:50, width : 20, height : 20  , shape : "square", ctx : canvasConf.ctx, smoothX:0,smoothY:0};

    this.init(params);
};

PlayerController.prototype.init = function(params){
    this.entityNumber = Puppets.createEntity('player',{position:{x:params.x, y:params.y , angle : params.angle}, size:{w: params.width , h: params.height} ,render:{ctx: params.ctx,shape : params.shape},move:{} });

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