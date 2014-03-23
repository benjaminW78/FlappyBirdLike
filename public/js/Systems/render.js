var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");

// puppet System Draw 
Puppets.system("draw",function(polygone,render,size){
    if(render.ctx !== undefined)
    {
        var ctx         = render.ctx,
            strokecolor = render.Strokecolor,
            fillcolor   = render.Fillcolor,
            lineTop     = polygone.lines.lineTop,
            lineLeft    = polygone.lines.lineLeft,
            lineRight   = polygone.lines.lineRight,
            lineBottom  = polygone.lines.lineBottom;


            // x           = position.x,
            // y           = position.y,
            // angle       = position.angle,
            // width       = size.width,
            // height      = size.height;
        if(fillcolor!==undefined)
            ctx.fillStyle=fillcolor;
        if(strokecolor!==undefined)
            ctx.strokeStyle=strokecolor;

        ctx.beginPath();
        // mise en place de l'angle
        // ctx.save();
        // //deplacement vers l'objet par rapport à la camera
        // ctx.translate(x,y);
        // //rotate du canvas par L'angle de l'objet unity
        // ctx.rotate(angle*Math.PI/180);
        //dessins du rectangle by lines from position x and y
        // ctx.moveTo(x+(width*-1)/2,y+(height*-1)/2);
        // ctx.lineTo(x+width,y+(height*-1)/2);
        // ctx.lineTo(x+width,y+height);
        // ctx.lineTo(x+(width*-1)/2,y+height);
        // ctx.lineTo(x+(width*-1)/2,y+(height*-1)/2);
        
        ctx.moveTo(lineTop.a.x,lineTop.a.y);
        ctx.lineTo(lineRight.a.x,lineRight.a.y);
        ctx.lineTo(lineBottom.b.x,lineBottom.b.y);
        ctx.lineTo(lineLeft.b.x,lineLeft.b.y);
        ctx.lineTo(lineLeft.a.x,lineLeft.a.y);

        // on restaure le canvas a son etat original.
        // ctx.restore();
        
        // on arrete de dessiner
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }   
},{components : ['polygone','render','size']});

module.exports = this; 
