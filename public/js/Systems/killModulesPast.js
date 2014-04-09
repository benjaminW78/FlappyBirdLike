var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");
var eventsController = require("../modules/EventController");

    var getIdPlayer = Puppets.find('score');
        player = Puppets.getComponents(getIdPlayer[0])[0];
    var getIdCamera = Puppets.find('targetCamera');
        camera = Puppets.getComponents(getIdCamera[0])[0];

Puppets.system("garbageCollector",function(position,size,collider,polygone,entity){

        if(player.position.y!==undefined && collider.type !== player.collider.type){
             
            if(position.y>player.position.y+250)
            {
                Puppets.removeEntity(entity);
            }
        }
        

},{components : ["position",'size','collider',"polygone"]});

module.exports = this;
