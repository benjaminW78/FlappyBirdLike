var basic = {};
basic.computePolygone= function(x,y,width,height,angle){
    
    var _lineTop = {a:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)}};
    var _lineLeft = {a:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)}};
    var _lineRight = {a:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)}};
    var _lineBottom = {a:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)}};

    return {'lineTop':_lineTop,'lineBottom':_lineBottom,'lineRight':_lineRight,'lineLeft':_lineLeft};
};

module.exports = basic; 
