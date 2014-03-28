var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");
var eventsController = require("../modules/EventController");

Puppets.system("collider",function(position,collider,size,others,polygone){


    var x           = position.x,
        y           = position.y,
        angle       = position.angle,
        width       = size.width,
        height      = size.height;
        
        for (var i in polygone.lines){
            var _playerLine1x = polygone.lines[i].a.x,
                _playerLine1y = polygone.lines[i].a.y,
                _playerLine2x = polygone.lines[i].b.x,
                _playerLine2y = polygone.lines[i].b.y;

                 for (var p = 0;p<others.lines.length;++p){
                    
                    var _otherLine1x = others.lines[p].a.x,
                        _otherLine1y = others.lines[p].a.y,
                        _otherLine2x = others.lines[p].b.x,
                        _otherLine2y = others.lines[p].b.y;
                        // test if lines are paralles if they are  test =  0.
                        testParalle = ((_playerLine2y - _playerLine1y)* (_otherLine2x - _otherLine1x)) - ((_playerLine2x - _playerLine1x)*(_otherLine2y- _otherLine1y));

                        var testCrossLineToLineA = (((_playerLine2x-_playerLine1x)*(_otherLine1y- _playerLine1y))-((_playerLine2y-_playerLine1y)*(_otherLine1x- _playerLine1x)))/testParalle;
                        var testCrossLineToLineB = (((_otherLine2x-_otherLine1x) * (_otherLine1y - _playerLine1y))-((_otherLine2y - _otherLine1y) * (_otherLine1x - _playerLine1x))) / testParalle;
                    
                    if ((testCrossLineToLineA < 0) || (testCrossLineToLineA > 1) || (testCrossLineToLineB < 0) || (testCrossLineToLineB > 1)){
                        // console.log("yolo ca ce croise pas !");
                    }
                    else {
                        if(others.lines[p].colliderType === "bloc")
                        {
                            console.log("collision");
                            eventsController.emit('rebound');
                            
                        }
                        else if(others.lines[p].colliderType === "gate")
                        {
                            eventsController.emit('score++');
                            console.log("score upgrade");

                        }
                    }                            
                 }

        }   
},{components : ['position','collider','size','others','polygone']});

module.exports = this; 
