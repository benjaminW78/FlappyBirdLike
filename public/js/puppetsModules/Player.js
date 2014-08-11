    var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

// component move smooth for player;
// 
Game.Puppets.component("move",function(data,entity,undefined){
    return {value:data.value||0, diviseur : data.diviseur || 2.5,direction : data.direction || 5 ,invertSwitch : false};
});

Game.Puppets.component("score",function(data,entity,undefined){
    return {value:data.value||0};
});

Game.Puppets.entity('player',{components : ['position',"imageRender",'render','size','speed','move','collider',"polygone","score"]});


var PlayerController = function (){

    var params = { x:canvasConf.domCanvas.width/2, y:0, angle:0,imgAngle : 90,path:"",name:"pac-man.png", width : 50, height : 50  , shape : "square", ctx : canvasConf.ctx, fill :"#ff00ee", smoothX:0,smoothY:0,type:"player",lines :{}};

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);

    this.init(params);
};

PlayerController.prototype.init = function(params){
    params.image = new Image();
    params.image.src = params.path+params.name;


    this.entityNumber = Game.Puppets.createEntity('player',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        imageRender   :{path : params.path , name : params.name, image : params.image,imgAngle : params.imgAngle},
                                                        render   :{ctx: params.ctx},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines}});
    // var entitys = Game.Puppets.find('collider');
    // var othersComponents = [];
    // entitys.forEach(function(element,index,array){
        
    //     var _myEntity = Game.Puppets.getComponents(element)[0];
    //     if(_myEntity.collider.type !== 'player'){
    //         for (var i in _myEntity.polygone.lines){
    //             othersComponents.push(_myEntity.polygone.lines[i]);
    //         } 
    //     }
    
    // });

    
    // Game.Puppets.component("others",function(data,entity,undefined){
    //     return { lines : data.others};
    // });

    // Game.Puppets.addComponent(this.entityNumber,'others',{others : othersComponents});

    this.setEvents();
};

PlayerController.prototype.setEvents = function(){

    moduleEventController.add("go-forward",function(){  
        var _self = Game.Puppets.getComponents(this.entityNumber)[0];
        _self.move.value +=1; 
        moduleEventController.emit("generateEnemie",_self.position);
    }.bind(this));
    
    moduleEventController.add("generateEnemie",function(){
        var entitys = Game.Puppets.find('collider');
        var othersComponents = [];

        entitys.forEach(function(element,index,array){
            
            var _myEntity = Game.Puppets.getComponents(element)[0];
            if(_myEntity.collider.type !== 'player'){
                for (var i in _myEntity.polygone.lines){
                    othersComponents.push(_myEntity.polygone.lines[i]);
                } 
            }
        });

        Game.Puppets.getComponents(this.entityNumber)[0].others.lines = othersComponents;

    }.bind(this));
    moduleEventController.add("rebound",function(){ 

        var _self = Game.Puppets.getComponents(this.entityNumber)[0];
        if(!_self.move.invertSwitch){
            _self.speed.value *=-1; 
            _self.move.direction *=-1; 
            _self.move.invertSwitch = true;     
        }

    }.bind(this));

    moduleEventController.add("score++",function(){ 

        var _self = Game.Puppets.getComponents(this.entityNumber)[0];
            _self.score.value+=1;   
            console.log('your score is of ',_self.score.value);  

    }.bind(this));
};


// browserify export
module.exports = PlayerController;