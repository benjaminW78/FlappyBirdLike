var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");

// puppet System Draw 
Puppets.system("draw",function(position,render,size){
    if(render.ctx !== undefined)
    {
        var ctx         = render.ctx,
            strokecolor = render.Strokecolor,
            fillcolor   = render.Fillcolor,
            shape       = render.shape,
            x           = position.x,
            y           = position.y,
            angle       = position.angle,
            width       = size.width,
            height      = size.height;

        if(fillcolor!==undefined)
            ctx.fillStyle=fillcolor;
        if(strokecolor!==undefined)
            ctx.strokeStyle=strokecolor;
        // clear of canvas  
        ctx.clearRect(0, 0, canvasConf.domCanvas.width,canvasConf.domCanvas.height);

        ctx.beginPath();
        // mise en place de l'angle
        ctx.save();
        //deplacement vers l'objet par rapport à la camera
        ctx.translate(x,y);
        //rotate du canvas par L'angle de l'objet unity
        ctx.rotate(angle*Math.PI/180);
        //dessins du rectangle
        ctx.fillRect(( width*0.5)*-1, ( height*0.5)*-1,width,height);
        // on restaure le canvas a son etat original.
        ctx.restore();
        // on arrete de dessiner
        ctx.closePath();
    }   
},{components : ['position','render','size']});

module.exports = this; 
