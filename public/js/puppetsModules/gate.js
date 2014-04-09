var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");


Puppets.entity('gate',{components : ['position','render','size','collider',"polygone"]});




var gateFactory = function (x,y,angle,w,h){

    var params = { x:x, y:y , angle :   angle, width : w, height : h  , shape : "square", ctx : canvasConf.ctx, type:"gate",lines :{},fill :"rgba(29, 240, 214,0.8)" };

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
    this.init(params);
};

gateFactory.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('gate',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        render   :{ctx: params.ctx,fill:params.fill},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines}});
};

gateFactory.prototype.setEvents = function(){

};
// 84
new gateFactory(0,320,0,10000,1);
module.exports = gateFactory;

