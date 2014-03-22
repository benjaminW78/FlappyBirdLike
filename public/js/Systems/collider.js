var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");

// puppet System Draw 
Puppets.system("collider",function(position,collider,size,others,polygone){

        var x           = position.x,
            y           = position.y,
            angle       = position.angle,
            width       = size.width,
            height      = size.height;
        // Pa =A1 +ua(A2 −A1)
            
            for (var i in polygone.lines){
            // console.log(polygone.lines[i]);
                var _playerLine1x = polygone.lines[i].a.x,
                    _playerLine1y = polygone.lines[i].a.y,
                    _playerLine2x = polygone.lines[i].b.x,
                    _playerLine2y = polygone.lines[i].b.y

                     for (var i = 0;i<others.lines.length;i++){
                        
                    // console.log(others)
                        var _otherLine1x = others.lines[i].a.x,
                            _otherLine1y = others.lines[i].a.y,
                            _otherLine2x = others.lines[i].b.x,
                            _otherLine2y = others.lines[i].b.y
            // test if lines are paralles if they are  test =  0.
            testParalle=((_playerLine2y - _playerLine1y)* (_otherLine2x - _otherLine1x)) - ((_playerLine2x - _playerLine1x)*(_otherLine2y- _otherLine1y));

            var testCrossLineToLine = (((_playerLine2x-_playerLine1x)*(_otherLine1y- _playerLine1y))-((_playerLine2y-_playerLine1y)*(_otherLine1x- _playerLine1x)))/testParalle;
                        console.log(testCrossLineToLine);
                        // debugger
                        if(testCrossLineToLine<0 || testCrossLineToLine>1)
                        {

                            // console.log("yolo ca ce croise pas !");
                            console.log("MOTHEUUUUUR FUCKER SISI");
                        }
                        else {
                            debugger;
                        }                            

                     }
                // polygone.lines[i].
            }
            //line up widht 4 points for define line positions
        // var lineUp1x = (x+(width*-1)/2),
        //     lineUp1y = y+(height*-1)/2,
            
        //     lineUp2x = x+width/2,
        //     lineUp2y = y+(height*-1)/2,
            
        //     lineLeft1x = (x+(width*-1)/2),
        //     lineLeft1y = y+(height*-1)/2,
        //     lineLeft2x = (x+(width*-1)/2),
        //     lineLeft2y = y+height/2;

            // test if lines are paralles if they are  test =  0.
            // testParalle=((lineUp2y - lineUp1y)* (lineLeft2x - lineLeft1x)) - ((lineUp2x - lineUp1x)*(lineLeft2y- lineLeft1y));
            // test if lines crossing result is between 0 and 1 they are crossing between points segment line points 
            // var testCrossLineToLine = (((lineUp2x-lineUp1x)*(lineLeft1y- lineUp1y))-((lineUp2y-lineUp1y)*(lineLeft1x- lineUp1x)))/testParalle;

            // console.log(testParalle ,testCrossLineToLine);
            // debugger;
            
        // ctx.moveTo((width*-1)/2,(height*-1)/2);
        // ctx.lineTo(width,(height*-1)/2);
        // ctx.lineTo(width,height);
        // ctx.lineTo((width*-1)/2,height);
        // ctx.lineTo((width*-1)/2,(height*-1)/2);
   
},{components : ['position','collider','size','others','polygone']});

module.exports = this; 
