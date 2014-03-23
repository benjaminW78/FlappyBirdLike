var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");
var eventsController = require("../modules/EventController");

Puppets.system("cameraFocus",function(position,targetCamera){

    // console.log(targetCamera);
    var targetx     = targetCamera.ref.position.x,
        targety     = targetCamera.ref.position.y;

        position.y = targety;        
        
},{components : ["position","targetCamera"]});

Puppets.system("cameraMove",function(position,targetCamera,render){

    var x     = position.x,
        y     = position.y,
        ctx         = render.ctx,
        lineTop     = targetCamera.ref.polygone.lines.lineTop,
        lineLeft    = targetCamera.ref.polygone.lines.lineLeft,
        lineRight   = targetCamera.ref.polygone.lines.lineRight,
        lineBottom  = targetCamera.ref.polygone.lines.lineBottom;


        ctx.beginPath();
        ctx.save();
        ctx.translate(targetCamera.ref.position.x,targetCamera.ref.position.y);
        
        ctx.moveTo(lineTop.a.x,lineTop.a.y);
        ctx.lineTo(lineRight.a.x,lineRight.a.y);
        ctx.lineTo(lineBottom.b.x,lineBottom.b.y);
        ctx.lineTo(lineLeft.b.x,lineLeft.b.y);
        ctx.lineTo(lineLeft.a.x,lineLeft.a.y);
        
        // targetCamera.position.ref
        ctx.restore();
        ctx.closePath();
},{components : ["position","targetCamera","render"]});

module.exports = this; 
