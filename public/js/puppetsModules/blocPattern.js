var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");

Puppets.entity('bloc1',{components : ['position','render','size','collider',"polygone"]});


var blocFactory = function (){

    var params = { x:150, y:200 , angle :   45, width : 50, height : 100  , shape : "square", ctx : canvasConf.ctx, type:"bloc",lines :{},fill :"#ffffff" };

    params.lines = basic.computePolygone(params.x,params.y,params.width,params.height,params.angle);
    console.log(params.lines.lineTop.a.x ,"yoPLA");
    this.init(params);
};

blocFactory.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('bloc1',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        render   :{ctx: params.ctx,shape : params.shape,fill:params.fill},
                                                        collider :{type:params.type},
                                                        polygone :{lines:params.lines}});
};


module.exports = new blocFactory();