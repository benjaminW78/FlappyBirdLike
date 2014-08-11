var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 = require("../modules/basicMethodes");

Game.Puppets.entity('camera',{components : ['position']});

var Camera = function (x,y){

    var params = { x:x, y:y,angle:0,width:400,height:600};
    
    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    this.init(params);
};

Camera.prototype.init = function(params){

    this.entityNumber = Game.Puppets.createEntity('camera',{position:{x:params.x, y:params.y,angle: params.angle}
    });

    var _playerEntity = Game.Puppets.find('move');
    var _playerRef = Game.Puppets.getComponents(_playerEntity)[0];
    // component move smooth for player;
    Game.Puppets.component("targetCamera",function(data,entity,undefined){
        return {ref:data.target};
    });

    console.log("FILSDE PUTERIE",Game.Puppets.addComponent(this.entityNumber,"targetCamera",{target : _playerRef})
    )   
};

module.exports = Camera;
