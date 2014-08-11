    // var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");
var eventsController = require("../modules/EventController");


Game.Puppets.system("cameraFocus",function(position,targetCamera){
        if(targetCamera.ref!==undefined){
            targety = targetCamera.ref.position.y;
            if(targety <position.y+200)
               position.y -=2;        
        }
},{components : ["position","targetCamera"]});

module.exports = this; 
