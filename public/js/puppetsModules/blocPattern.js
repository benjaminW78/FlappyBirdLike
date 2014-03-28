// var basicsComponents      = require("../Components/basicsComponents");
// var canvasConf            = require("../modules/configCanvas");
// var basic                 = require("../modules/basicMethodes");

// Puppets.entity('bloc1',{components : ['position','render','size','collider',"polygone"]});


// var blocFactory = function (x,y,angle,w,h){

//     var params = { x:x, y:y , angle :   angle, width : w, height : h  , shape : "square", ctx : canvasConf.ctx, type:"bloc",lines :{},fill :"#ffffff" };

//     params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
//     this.init(params);
// };

// blocFactory.prototype.init = function(params){

//     this.entityNumber = Puppets.createEntity('bloc1',{position:{x:params.x, y:params.y , angle : params.angle},
//                                                         size     :{w: params.width , h: params.height},
//                                                         render   :{ctx: params.ctx,fill:params.fill},
//                                                         collider :{type:params.type,shape : params.shape},
//                                                         polygone :{lines:params.lines}});
// };


// new blocFactory(550,300,90,50,200);
// new blocFactory(500,200,90,50,400);
// new blocFactory(200,100,70,50,400);
// module.exports = new blocFactory(60,300,90,50,200);