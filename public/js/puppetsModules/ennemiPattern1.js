var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");

// component move smooth for bloc1;
Puppets.component('blocMove1',function(data,entity,undefined){
    return {type:data.type||0, x : data.x || 2, distance:data.distance ||canvasConf.domCanvas.width};
});

Puppets.entity('bloc1',{components : ['position','render','speed','size','collider',"polygone","blocMove1"]});

// system use to move bloc pattern 1.
Puppets.system("movebloc1",function(position,speed,blocMove1){

    position.x+=speed.value;
<<<<<<< HEAD
    if(position.x==590||position.x==10){
=======
    if(position.x>=canvasConf.domCanvas.width || position.x<=0){
>>>>>>> master
        speed.value*=-1;
    }

},{components : ['position','speed','blocMove1']});


var blocFactory = function (x,y,angle,w,h,speed){

    var params = { x:x, y:y , angle :   angle, width : w, height : h  , shape : "square", speed:speed ,ctx : canvasConf.ctx, type:"bloc",lines :{},fill :"#ffffff" };

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
    this.init(params);
};

blocFactory.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('bloc1',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        render   :{ctx: params.ctx,fill:params.fill},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines},
                                                        blocMove1:{type : "horizontal"},
                                                        speed    :{value : 5}});
    // new gateFactory(params.x,params.y,0,10000,1);

};

blocFactory.prototype.setEvents = function(){

};
// 84
<<<<<<< HEAD
new blocFactory(50,350,45,25,25);
module.exports = blocFactory;
=======
// new blocFactory(50,298,45,25,25);
module.exports = blocFactory;
>>>>>>> cc997c7f7ecc2aa25039aa655f04b127f41c2d01
