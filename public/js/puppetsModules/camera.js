var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

Puppets.entity('camera',{components : ['position']});

var Camera = function (x,y,w,h){

    var params = { x:x, y:y};
    
    this.init(params);
};

Camera.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('camera',{position:{x:params.x, y:params.y}});

    var _playerEntity = Puppets.find('move');
    var _playerRef = Puppets.getComponents(_playerEntity)[0];
    // component move smooth for player;
    Puppets.component("targetCamera",function(data,entity,undefined){
        return {ref:data.target};
    });

    Puppets.addComponent(this.entityNumber,"targetCamera",{target : _playerRef});
};
module.exports = new Camera(0,10);
