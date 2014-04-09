var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");
var moduleEventController = require("../modules/EventController");
var blocFactory           = require("../puppetsModules/ennemiPattern1");
var gate                  = require("../puppetsModules/gate");

var EnnemieGenerator = function (){

    EnnemieGenerator.prototype.init = function(){
        this.setEvents();
    };

    EnnemieGenerator.prototype.setEvents = function(){

        moduleEventController.add("generateEnemie",function(posPlayer){
            new blocFactory(50,posPlayer.y-168,45,25,25);
            new gate(0,posPlayer.y-168,0,10000,1);

        });

    };

    this.init();
};

// 84
new EnnemieGenerator();
module.exports = this;