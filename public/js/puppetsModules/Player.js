var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

// component move smooth for player;
Puppets.component("move",function(data,entity,undefined){
    return {value:data.value||0, diviseur : data.diviseur || 2.5,direction : data.direction || 5 ,invertSwitch : false};
});

Puppets.component("score",function(data,entity,undefined){
    return {value:data.value||0};
});

Puppets.entity('player',{components : ['position',"imageRender",'render','size','speed','move','collider',"polygone","score"]});

var getIdCamera = Puppets.find('targetCamera');
    camera = Puppets.getComponents(getIdCamera[0])[0];

// system use to move player.
Puppets.system("move-forward",function(position,speed,move){
        var _speed = speed.value,
        _move      = move.value;
        _diviseur  = move.diviseur;

        if(position.x>=canvasConf.domCanvas.width||position.x<=0){
            moduleEventController.emit('gameOver');
            return;   
        }


            if(_move>0){
                if(_speed<0 && (position.x-_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur)>10)
                    position.x-=_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur;
                else if(_speed>0 && (position.x+_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur)<580)
                    position.x+=_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur;
                // camera.position.y -= 3*_diviseur;
                position.y-=3*_diviseur;
                move.value-=0.15/_diviseur;  
            }
            else{
                if((position.angle==90 || position.angle==-90) ){   
                    speed.value*=-1;
                    move.direction*=-1;
                    move.invertSwitch=false;
                }
                if(Math.sin(position.angle*Math.PI / 180)<1&&Math.sin(position.angle*Math.PI / 180)>-1 && position.x<580 && position.x<580)
                    position.y += _speed*Math.sin(position.angle*Math.PI / 180);
                if((Math.cos(position.angle*Math.PI / 180)<1&&Math.cos(position.angle*Math.PI / 180)>-1 && position.x<580))
                    position.x += _speed*Math.cos(position.angle*Math.PI / 180);
                
                position.angle+= move.direction;
            }
     
        
},{components : ['position','speed','move']});

var PlayerController = function (){

    var params = { x:canvasConf.domCanvas.width/2, y:0, angle:0,imgAngle : 90,path:"sources/assets/",name:"pac-man.png", width : 50, height : 50  , shape : "square", ctx : canvasConf.ctx, fill :"#ff00ee", smoothX:0,smoothY:0,type:"player",lines :{}};

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);

    this.init(params);
};

PlayerController.prototype.init = function(params){
    params.image = new Image();
    params.image.src = params.path+params.name;
    console.log(params.image)

    this.entityNumber = Puppets.createEntity('player',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        imageRender   :{path : params.path , name : params.name, image : params.image,imgAngle : params.imgAngle},
                                                        render   :{ctx: params.ctx},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines}});
    var entitys = Puppets.find('collider');
    var othersComponents = [];
    entitys.forEach(function(element,index,array){
        
        var _myEntity = Puppets.getComponents(element)[0];
        if(_myEntity.collider.type !== 'player'){
            for (var i in _myEntity.polygone.lines){
                othersComponents.push(_myEntity.polygone.lines[i]);
            } 
        }
    
    });

    
    Puppets.component("others",function(data,entity,undefined){
        return { lines : data.others};
    });

    Puppets.addComponent(this.entityNumber,'others',{others : othersComponents});

    this.setEvents();
};

PlayerController.prototype.setEvents = function(){

    moduleEventController.add("go-forward",function(){  
        var _self = Puppets.getComponents(this.entityNumber)[0];
        _self.move.value +=1; 
        moduleEventController.emit("generateEnemie",_self.position);
    }.bind(this));
    
    moduleEventController.add("generateEnemie",function(){
        var entitys = Puppets.find('collider');
        var othersComponents = [];

        entitys.forEach(function(element,index,array){
            
            var _myEntity = Puppets.getComponents(element)[0];
            if(_myEntity.collider.type !== 'player'){
                for (var i in _myEntity.polygone.lines){
                    othersComponents.push(_myEntity.polygone.lines[i]);
                } 
            }
        
        });

        Puppets.getComponents(this.entityNumber)[0].others.lines = othersComponents;

    }.bind(this));
    moduleEventController.add("rebound",function(){ 

        var _self = Puppets.getComponents(this.entityNumber)[0];
        if(!_self.move.invertSwitch){
            _self.speed.value *=-1; 
            _self.move.direction *=-1; 
            _self.move.invertSwitch = true;     
        }

    }.bind(this));

    moduleEventController.add("score++",function(){ 

        var _self = Puppets.getComponents(this.entityNumber)[0];
            _self.score.value+=1;   
            console.log('your score is of ',_self.score.value);  

    }.bind(this));
};


// browserify export
module.exports = new PlayerController();