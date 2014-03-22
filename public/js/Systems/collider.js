var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");

// puppet System Draw 
Puppets.system("collider",function(position,collider,size){

        var x           = position.x,
            y           = position.y,
            angle       = position.angle,
            width       = size.width,
            height      = size.height;
        // Pa =A1 +ua(A2 −A1)
            //line up widht 4 points for define line positions
        var lineUp1x = (x+(width*-1)/2),
            lineUp1y = y+(height*-1)/2,
            
            lineUp2x = x+width/2,
            lineUp2y = y+(height*-1)/2,
            
            lineLeft1x = (x+(width*-1)/2),
            lineLeft1y = y+(height*-1)/2,
            lineLeft2x = (x+(width*-1)/2),
            lineLeft2y = y+height/2;

            // test if lines are paralles if they are  test =  0.
            testParalle=((lineUp2y - lineUp1y)* (lineLeft2x - lineLeft1x)) - ((lineUp2x - lineUp1x)*(lineLeft2y- lineLeft1y));
            // test if lines crossing result is between 0 and 1 they are crossing between points segment line points 
            var testCrossLineToLine = (((lineUp2x-lineUp1x)*(lineLeft1y- lineUp1y))-((lineUp2y-lineUp1y)*(lineLeft1x- lineUp1x)))/testParalle;

            // console.log(testParalle ,testCrossLineToLine);
            // debugger;
            
        // ctx.moveTo((width*-1)/2,(height*-1)/2);
        // ctx.lineTo(width,(height*-1)/2);
        // ctx.lineTo(width,height);
        // ctx.lineTo((width*-1)/2,height);
        // ctx.lineTo((width*-1)/2,(height*-1)/2);
   
},{components : ['position','collider','size']});

module.exports = this; 
