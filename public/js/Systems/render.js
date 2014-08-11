var canvasConf = require("../modules/configCanvas");

// puppet System Draw
    
Game.Puppets.system("draw",function(polygone,render,size){
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

var getIdCamera = Game.Puppets.find('targetCamera');
    camera = Game.Puppets.getComponents(getIdCamera[0])[0];

Game.Puppets.system("draw1",function(position,render,imageRender,size){
        // console.log(imageRender.image);
        // debugger;
    if(render.ctx !== undefined)
    {
        
        var ctx         = render.ctx,
           

            x           = position.x,
            y           = position.y-camera.position.y,
            angle       = position.angle,
            width       = size.width,
            height      = size.height;

        // if(fillcolor!==undefined)
        //     ctx.fillStyle=fillcolor;
        // if(strokecolor!==undefined)
        //     ctx.strokeStyle=strokecolor;

        ctx.beginPath();
        // mise en place de l'angle
        ctx.save();
        //deplacement vers l'objet par rapport à la camera
        ctx.translate(x,y);
        ctx.rotate((angle-imageRender.angle)*Math.PI/180);
        ctx.drawImage(imageRender.image,0,0,imageRender.image.width,imageRender.image.height,width*-0.5,height*-0.5,width,height);
        //rotate du canvas par L'angle de l'objet unity
        //dessins du rectangle by lines from position x and y
        // ctx.moveTo(lineTop.a.x,lineTop.a.y);
        // ctx.lineTo(lineRight.a.x,lineRight.a.y);
        // ctx.lineTo(lineBottom.b.x,lineBottom.b.y);
        // ctx.lineTo(lineLeft.b.x,lineLeft.b.y);
        // ctx.lineTo(lineLeft.a.x,lineLeft.a.y);

        // on restaure le canvas a son etat original.
        ctx.restore();
        
        // on arrete de dessiner
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }   
},{components : ['position','render','imageRender','size']});
module.exports = this; 

