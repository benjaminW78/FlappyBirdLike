var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

Puppets.entity('wall',{components : ['position','size','collider',"polygone"]});

var wallFactory = function (x,y,w,h){

    var params = { x:x, y:y , angle :   0, width : w, height : h  , shape : "VerticalLine", ctx : canvasConf.ctx, type:"border",lines :{},fill :"#95ffff" };

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
    this.init(params);
};

wallFactory.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('wall',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        // render   :{ctx: params.ctx,fill:params.fill},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines}});
};

module.exports = new wallFactory(300,400,600,-1000); 
