var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");

// component move smooth for bloc1;
Puppets.component('blocMove1',function(data,entity,undefined){
    return {type:data.type||0, x : data.x || 2, distance:data.distance ||canvasConf.domCanvas.width};
});

Puppets.entity('bloc1',{components : ['position','render','imageRender','speed','size','collider',"polygone","blocMove1"]});

// system use to move bloc pattern 1.
Puppets.system("movebloc1",function(position,speed,blocMove1){

    position.x+=speed.value;

    if(position.x>=canvasConf.domCanvas.width || position.x<=0){
        speed.value*=-1;
    }

},{components : ['position','speed','blocMove1']});


var blocFactory = function (x,y,angle,w,h,speed){

    var params = { x:x, y:y , angle :   angle, width : w, height : h ,imgAngle : 45,path:"",name:"gosht-" , shape : "square", speed:speed ,ctx : canvasConf.ctx, type:"bloc",lines :{},fill :"#ffffff" };

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
    this.init(params);
};

blocFactory.prototype.init = function(params){
    var test = Math.floor(Math.random()*3);
    params.image = new Image();
    params.image.src = params.path+params.name+test+'.png';

    this.entityNumber = Puppets.createEntity('bloc1',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        render   :{ctx: params.ctx},
                                                        imageRender   :{path : params.path ,imgAngle:params.imgAngle, name : params.name, image : params.image},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines},
                                                        blocMove1:{type : "horizontal"},
                                                        speed    :{value : 5}});
    // new gateFactory(params.x,params.y,0,10000,1);

};

blocFactory.prototype.setEvents = function(){

};
// 84
new blocFactory(50,350,45,25,25);
module.exports = blocFactory;

