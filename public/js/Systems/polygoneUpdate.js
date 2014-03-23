var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");

// puppet System Draw 
Puppets.system("polygoneUpdate",function(position,size,polygone){
        var x           = position.x,
            y           = position.y,
            angle       = position.angle,
            width       = size.width,
            height      = size.height;

        
    if(polygone.lines.lineTop!==undefined){
    polygone.lines.lineTop.a.x = Math.cos(angle*Math.PI / 180)*((x+(width*-1)/2)-x) - Math.sin(angle*Math.PI / 180) * ((y+(height*-1)/2)-y)+x;
    polygone.lines.lineTop.a.y = Math.sin(angle*Math.PI / 180)*((x+(width*-1)/2)-x) + Math.cos(angle*Math.PI / 180)* ((y+(height*-1)/2)-y)+y;
    polygone.lines.lineTop.b.x = Math.cos(angle*Math.PI / 180)*((x+width/2)-x) - Math.sin(angle*Math.PI / 180) * ((y+(height*-1)/2)-y)+x;
    polygone.lines.lineTop.b.y = Math.sin(angle*Math.PI / 180)*((x+width/2)-x) + Math.cos(angle*Math.PI / 180)* ((y+(height*-1)/2)-y)+y;
    }
                    
        
    if(polygone.lines.lineLeft!==undefined){
    polygone.lines.lineLeft.a.x = Math.cos(angle*Math.PI / 180)*((x+(width*-1)/2)-x) - Math.sin(angle*Math.PI / 180) * ((y+(height*-1)/2)-y)+x;
    polygone.lines.lineLeft.a.y = Math.sin(angle*Math.PI / 180)*((x+(width*-1)/2)-x) + Math.cos(angle*Math.PI / 180)* ((y+(height*-1)/2)-y)+y;
    polygone.lines.lineLeft.b.x = Math.cos(angle*Math.PI / 180)*((x+(width*-1)/2)-x) - Math.sin(angle*Math.PI / 180) * ((y+height/2)-y)+x;
    polygone.lines.lineLeft.b.y = Math.sin(angle*Math.PI / 180)*((x+(width*-1)/2)-x) + Math.cos(angle*Math.PI / 180)* ((y+height/2)-y)+y;
    }
        

    if(polygone.lines.lineRight!==undefined){
    polygone.lines.lineRight.a.x = Math.cos(angle*Math.PI / 180)*((x+width/2)-x) - Math.sin(angle*Math.PI / 180) * ((y+(height*-1)/2)-y)+x;
    polygone.lines.lineRight.a.y = Math.sin(angle*Math.PI / 180)*((x+width/2)-x) + Math.cos(angle*Math.PI / 180)* ((y+(height*-1)/2)-y)+y;
    polygone.lines.lineRight.b.x = Math.cos(angle*Math.PI / 180)*((x+width/2)-x) - Math.sin(angle*Math.PI / 180) * ((y+height/2)-y)+x;
    polygone.lines.lineRight.b.y = Math.sin(angle*Math.PI / 180)*((x+width/2)-x) + Math.cos(angle*Math.PI / 180)* ((y+height/2)-y)+y;

    }
    
        
    if(polygone.lines.lineBottom!==undefined){
                  // cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
    polygone.lines.lineBottom.a.x = Math.cos(angle*Math.PI / 180)*((x+(width*-1)/2)-x) - Math.sin(angle*Math.PI / 180) * ((y+height/2)-y)+x;
                 // sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy
    polygone.lines.lineBottom.a.y = Math.sin(angle*Math.PI / 180)*((x+(width*-1)/2)-x) + Math.cos(angle*Math.PI / 180)* ((y+height/2)-y)+y;
    polygone.lines.lineBottom.b.x = Math.cos(angle*Math.PI / 180)*((x+width/2)-x) - Math.sin(angle*Math.PI / 180)* ((y+height/2)-y)+x;
    polygone.lines.lineBottom.b.y = Math.sin(angle*Math.PI / 180)*((x+width/2)-x) + Math.cos(angle*Math.PI / 180)* ((y+height/2)-y)+y;
    }

   // debugger;            
},{components : ["position","size","polygone"]});

module.exports = this; 
