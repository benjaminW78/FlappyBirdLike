    var Puppets    = require("../libs/puppets");
    var canvasConf = require("../modules/configCanvas");
var eventsController = require("../modules/EventController");

var getIdCamera = Puppets.find('targetCamera');
    camera = Puppets.getComponents(getIdCamera[0])[0];

Puppets.system("cameraFocus",function(position,targetCamera){

    // console.log(targetCamera);
    var targetx     = targetCamera.ref.position.x,
        targety     = targetCamera.ref.position.y;

        // debugger;
        // if(targety >position.y)
        //     position.y -=0.1;        
        

},{components : ["position","targetCamera"]});

// Puppets.system("cameraMove",function(position,collider,render){
//     // debugger;

//         position.y = camera.position.y-position.y;


// },{components : ["position","collider","render"]});

module.exports = this; 
