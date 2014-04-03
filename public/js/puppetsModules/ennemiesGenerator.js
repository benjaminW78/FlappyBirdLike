var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");
var moduleEventController = require("../modules/EventController");
var blocFactory=require("../puppetsModules/ennemiPattern1");

// component move smooth for bloc1;
// Puppets.component('blocMove1',function(data,entity,undefined){
//     return {type:data.type||0, x : data.x || 2, distance:data.distance ||canvasConf.domCanvas.width};
// });

// Puppets.entity('bloc1',{components : ['position','render','speed','size','collider',"polygone","blocMove1"]});

// // system use to move bloc pattern 1.
// Puppets.system("movebloc1",function(position,speed,blocMove1){

//     position.x+=speed.value;
//     if(position.x>=canvasConf.domCanvas.width || position.x<=0){
//         speed.value*=-1;
//     }

// },{components : ['position','speed','blocMove1']});


var EnnemieGenerator = function (){

    EnnemieGenerator.prototype.init = function(){
        this.setEvents()
    };

    EnnemieGenerator.prototype.setEvents = function(){

        moduleEventController.add("generateEnemie",function(posPlayer){
            Puppets.find('collider');
            console.log("YOLOOO",posPlayer);
            new blocFactory(50,posPlayer.y-168,45,25,25);

        });

    };

    this.init();
};

// 84
new EnnemieGenerator(50,298,45,25,25);
module.exports = this;