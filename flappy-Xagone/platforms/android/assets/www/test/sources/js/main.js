(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Basic components for entities !

Puppets.component("position",function(data,entity,undefined){
    return { angle : data.angle || 0 , x : data.x || 0  , y : data.y || 0 };
});

Puppets.component("render",function(data,entity,undefined){
    return { ctx : data.ctx ,Fillcolor : data.fill || "rgba(0,0,0,0)" , Strokecolor : data.stroke || "rgba(0,0,0,0)" };
});

Puppets.component("size",function(data,entity,undefined){
    return { width : data.w || 50  , height : data.h || 50 };
});

Puppets.component("speed",function(data,entity,undefined){
    return { value : data.value || 5 };
});

Puppets.component("collider",function(data,entity,undefined){
    return { type : data.type || "block",shape : data.shape || '',entity : data.entity||-1};
});

Puppets.component("imageRender",function(data,entity,undefined){
    return { path : data.path || "./assets", name : data.name||"", image : data.image,angle : data.imgAngle};
});

Puppets.component("polygone",function(data,entity,undefined){
    return { lines : data.lines};
});

module.exports = this; 
},{}],2:[function(require,module,exports){
    var Puppets    = require("../libs/puppets");
    var canvasConf = require("../modules/configCanvas");
var eventsController = require("../modules/EventController");


Puppets.system("cameraFocus",function(position,targetCamera){
        if(targetCamera.ref!==undefined){
                      
           targety = targetCamera.ref.position.y;
           if(targety <position.y+200)
               position.y -=2;        
        }
        

},{components : ["position","targetCamera"]});

module.exports = this; 

},{"../libs/puppets":9,"../modules/EventController":12,"../modules/configCanvas":14}],3:[function(require,module,exports){
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
                            console.log("collision");
                        if(others.lines[p].colliderType === "bloc")
                        {
                            eventsController.emit('gameOver');
                        }
                        else if(others.lines[p].colliderType === "gate")
                        {
                            eventsController.emit('score++');
                            // console.log("score upgrade");

                        }
                    }                            
                 }

        }   
},{components : ['position','collider','size','others','polygone']});

module.exports = this; 

},{"../libs/puppets":9,"../modules/EventController":12,"../modules/configCanvas":14}],4:[function(require,module,exports){
var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");
var eventsController = require("../modules/EventController");

    var getIdPlayer = Puppets.find('score');
        player = Puppets.getComponents(getIdPlayer[0])[0];
    var getIdCamera = Puppets.find('targetCamera');
        camera = Puppets.getComponents(getIdCamera[0])[0];

Puppets.system("garbageCollector",function(position,size,collider,polygone,entity){

        if(player.position.y!==undefined && collider.type !== player.collider.type){
             
            if(position.y>player.position.y+250)
            {
                Puppets.removeEntity(entity);
            }
        }
        

},{components : ["position",'size','collider',"polygone"]});

module.exports = this;

},{"../libs/puppets":9,"../modules/EventController":12,"../modules/configCanvas":14}],5:[function(require,module,exports){
var Puppets    = require("../libs/puppets");
var canvasConf = require("../modules/configCanvas");


var getIdCamera = Puppets.find('targetCamera');
    camera = Puppets.getComponents(getIdCamera[0])[0];


// puppet System Draw 
Puppets.system("polygoneUpdate",function(position,size,polygone,collider){
        var x           = position.x,
            y           = position.y-camera.position.y,
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

    if(polygone.lines.lineTop!==undefined&&polygone.lines.lineTop.colliderType===undefined &&
        polygone.lines.lineLeft!==undefined&&polygone.lines.lineLeft.colliderType===undefined &&
        polygone.lines.lineRight!==undefined&&polygone.lines.lineRight.colliderType===undefined &&
        polygone.lines.lineBottom!==undefined&&polygone.lines.lineBottom.colliderType===undefined )
    {   
        polygone.lines.lineTop.colliderType =polygone.lines.lineLeft.colliderType =polygone.lines.lineRight.colliderType =polygone.lines.lineBottom.colliderType = collider.type ;  
    }
   // debugger;            
},{components : ["position","size","polygone","collider"]});

module.exports = this; 

},{"../libs/puppets":9,"../modules/configCanvas":14}],6:[function(require,module,exports){
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

var getIdCamera = Puppets.find('targetCamera');
    camera = Puppets.getComponents(getIdCamera[0])[0];

Puppets.system("draw1",function(position,render,imageRender,size){
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


},{"../libs/puppets":9,"../modules/configCanvas":14}],7:[function(require,module,exports){
window.onload = function(){

    var Game = require('./loader/game');
    var requestAnimFrame = require('./libs/requestAnimationFrame');

    (function gameloop(){    
        // clear of canvas  
        Game.ctx.clearRect(0, 0, Game.canvas.width,Game.canvas.height);
        Game.Puppets.run();
        requestAnimFrame(gameloop);

    })();
};
},{"./libs/requestAnimationFrame":10,"./loader/game":11}],8:[function(require,module,exports){
// create by : winckell benjamin
/*
*class of input event gestion.
*this lib can be use for manage simples inputs with multi events
*Need to be instanciate in init of your game.

*HOW TO BIND A EVENT TO A INPUT:
*   Add in your array keyBind like That :  var keyBind = { KeyNumberOfInput :  { eventToCall : functionToActive() } }
    

*HOW TO INSTANTIATE EasyInput : 
    
    * var whatYouWant = new EasyInput(first) Argument : --> first : object of keyBinding,with event and functions call.

    

*Methodes of EasyInput : 
*   addEvent(first,second) 2 params necessary    --> first : string of the event who will be add (keydown,keyup,mousemove etc...); 
                                                 --> second : dom object like window or a document.getElementBy of what you want;
    use : for add event listenner on object;
*   removeEvent(first,second) 2 params necessary --> first : string of the event who will be remove (keydown,keyup,mousemove etc...);
                                                 --> second : dom object who had event listenner;
    use : for remove event listenner of an object;
*   setKeyBind(first,second) 2 params necessary  --> first : integer of the key you want to bind with event(s).                                      
                                                 --> second : object of event(s) you want to use and function call by this event: {keypress : function(){}, keydown : functionWhoDoSomething };
    use : for add or edit one key with event(s);    

*   getKeysBind() 
    use : return you object who contain all keys binding and all events call for those keys.
*/
'use strict';

var EasyInput = function()
{
    var key = {};
    var gamePadDictionnary = { 
            buttons:{0:"a",
                    1:"b",
                    2:"x",
                    3:"y",
                    4:"lb",
                    5:"rb",
                    6:"lt",
                    7:"rt",
                    8:"select",
                    9:"start",
                    10:"leftStickPress",
                    11:"rightStickPress",
                    12:"d-pad top",
                    13:"d-pad bottom",
                    14:"d-pad left",
                    15:"d-pad right"},
            axes:{ 0: "stick-left-x",
                1: "stick-left-y",
                2: "stick-right-x",
                3: "stick-right-y"}
        }

    var DictonnaryKey =  {
        0: "\\",
        8: "backspace",
        9: "tab",
        12: "num",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "caps",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        44: "print",
        45: "insert",
        46: "delete",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        91: "cmd",
        92: "cmd",
        93: "cmd",
        96: "num_0",
        97: "num_1",
        98: "num_2",
        99: "num_3",
        100: "num_4",
        101: "num_5",
        102: "num_6",
        103: "num_7",
        104: "num_8",
        105: "num_9",
        106: "num_multiply",
        107: "num_add",
        108: "num_enter",
        109: "num_subtract",
        110: "num_decimal",
        111: "num_divide",
        124: "print",
        144: "num",
        145: "scroll",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "\'",
        223: "`",
        224: "cmd",
        225: "alt",
        57392: "ctrl",
        63289: "num"
    };
    EasyInput.prototype.addEvent = function(input , target)
    {   
        if(input === "gamepad" && !!navigator.webkitGetGamepads ){
            this.startGamePadLoop(target);
            return
        }
        else 
            target.addEventListener(input, this.functionCall,false);
    };
    EasyInput.prototype.functionCall = function(e)
    {
        if(key.hasOwnProperty(e.keyCode) && typeof key[e.keyCode][e.type] === "function")
            key[e.keyCode][e.type](e);
    };
    EasyInput.prototype.removeEvent = function(input , target)
    {
        target.removeEventListener(input,this.functionCall,false);
    };
    EasyInput.prototype.setKeyBind = function(submittedKey , object)
    {
        if(key.hasOwnProperty(submittedKey) === false)
        {
            if(typeof submittedKey ==='string')
                var submittedKey = this.findInKey(submittedKey);

            key[submittedKey] = object;
        }
        else if(key.hasOwnProperty(submittedKey))
        {  
            if(typeof submittedKey ==='string')
                var submittedKey = this.findInKey(submittedKey);

            for (var index in object)
                key[submittedKey][index] = object[index]; 
        } 
    };
    EasyInput.prototype.getKeysBind = function()
    {
        return key;
    };
    EasyInput.prototype.findInKey = function(submittedKey){
        var index = -1;
        var i;
        for( i in DictonnaryKey) {
            if (DictonnaryKey[i] === submittedKey) {
                index = i;    
                break;
            }
        }
        return index;
    };
    EasyInput.prototype.startGamePadLoop = function()
    {
        var gamePadFrameBefore =[];
        var currentGamepads = [];
        var gamepads ;

        var gamepadLoop = setInterval(function(){
                                        gamepads = navigator.webkitGetGamepads();
                                        for (var i=0;i<gamepads.length;i++){
                                            if(gamePadFrameBefore.length===0){
                                                if(gamepads[i]!==undefined)
                                                    gamePadFrameBefore[i]=this.hashCode(JSON.stringify(gamepads[i]));
                                            }
                                            else{   
                                                if(gamepads[i]!==undefined)
                                                    currentGamepads[i]=this.hashCode(JSON.stringify(gamepads[i]));
                                                
                                                // if(currentGamepads[i]!==undefined&&gamePadFrameBefore[i]!==currentGamepads[i])

                                            }
                                            
                                        }


                                    },1000/60)

    };
    EasyInput.prototype.hashCode = function(string){
        
        var hash = 0, i, chr, len;
        
        if (this.length == 0) return hash;
        
        for (i = 0, len = this.length; i < len; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
      return hash;
    };

};

module.exports = EasyInput;

},{}],9:[function(require,module,exports){
Puppets = function (config)
{
    this.ARRAY = [];
    this.Systems =
    {
        COMPONENTS : [],
        order : [],
        list : {},
        runs : 0,

        launchSystems : function()
        {
            var nbCollections = Puppets.Entities.orderCollections.length;
            var puppy, puppo, i;
            var system, id;
            var orderLength = this.order.length;
            
            for(puppy = 0; puppy < nbCollections; puppy+=1)
            {
                var collection = Puppets.Entities.orderCollections[puppy];
                for(puppo in Puppets.Entities.collections[collection])
                {
                    id = Puppets.Entities.collections[collection][puppo];
                    for(i = 0; i < orderLength; i++)
                    {
                       system = this.list[this.order[i]];
                       if(system !== undefined && (system.delay === undefined || system.delay === null || this.runs % system.delay === 0))
                          this.callSystem(id, system.components, system.method, system.data); 
                    }
                }
            }
            this.runs++;
        },
        callSystem : function(id, listOfComponents, method, data) 
        {
            var entity = Puppets.Entities.list[id];
            var components = this.COMPONENTS;
            var i;
            var component;
            if(entity !== null && entity !== undefined)
            {
                for(i = 0; i < listOfComponents.length; i++)
                {
                    component = listOfComponents[i];
                    if(entity[component] === null || entity[component] === undefined ||
                     Puppets.Components.list=== null || Puppets.Components.list === undefined ||
                     !Puppets.Components.list[component][entity[component]].enabled) 
                    {
                        this.COMPONENTS.length = 0;
                        return;
                    }

                    components.push(Puppets.Components.list[component][entity[component]]);
                }
                components.push(id);
                method.apply(data, components);
                this.COMPONENTS.length = 0;
            }
        },
        load : function(name, method, data)
        {
            if(this.list[name] !== undefined && this.list[name] !== null)
                console.warn("Name "+name+" overrided by system "+method);
            if(data === undefined)
            {
                throw console.error("data argument can not be undefined");
                return false;
            }

            this.list[name] = { components : data.components, method : method , delay : data.delay, data : data};

            var indexSystem = this.order.indexOf(name);
            if(indexSystem >= 0)
                this.order.splice(indexSystem, 1);

            if(typeof(data.position) === 'number')
                this.order.splice(data.position, 0, name);
            else
                this.order.push(name);

            return true;
        }
    };

    this.Entities =
    {
        models : {},
        list : {},
        collections : {},
        orderCollections : [],
        length : 0,

        count : function()
        {
            var count = 0;
            for (var entity in this.list) 
            {
                if (this.list.hasOwnProperty(entity)) 
                   ++count;
            }

           return count;
        },
        createEntity : function(model, constructor, collection)
        {
            if(this.models[model] === undefined)
            {
                console.warn("Entity "+model+" doesn't exist in Puppet, you have to load it");
                return false;
            }
            model = this.models[model];
            var entity = {};
            var argument = {};
            var lengthComponents = model.components.length;
            var i, o, id;
            for (i = 0; i < lengthComponents; i++)
            {
                if(typeof model.components[i] === "object")
                {
                    var component = Object.keys(model.components[i])[0];
                    if(typeof(constructor[component]) !== 'object')
                        constructor[component] = {};

                    for (o in model.components[i][component])
                    {
                        if(constructor[component][o] !== undefined && constructor[component][o] !== null)
                            model.components[i][component][o] = constructor[component][o];
                    }
                    constructor[component][o] = model.components[i][component][o];
                }
                else
                    var component = model.components[i];

                if(constructor[component] !== undefined && constructor[component] !== null)
                    id = Puppets.Components.addComponent(this.length, component, constructor[component], constructor[component].enabled);
                else
                    id = Puppets.Components.addComponent(this.length, component, constructor[component]);

                entity[component] = id;
                argument[component] = Puppets.Components.list[component][id];
            }
            id = this.length;
            this.list[id] = entity;
            if(this.collections[collection] !== undefined && this.collections[collection] !== null)
                this.collections[collection][id] = ""+id+"";
            else
                this.collections.world[id] = ""+id+"";
            this.length++;

            return this.length-1;
        },
        addComponent : function(entity, component, settings, enabled, undefined)
        {
            if(!Array.isArray(entity))
                entity = [entity];
            
            var id;
            
            for(var puppy = 0; puppy < entity.length; puppy++)
            {
                if(!this.list[entity[puppy]].hasOwnProperty(component))
                {
                    id = Puppets.Components.addComponent(entity[puppy], component, settings, enabled);
                    this.list[entity[puppy]][component] = id;
                }
                else
                    return false;
            }
            return true;
        },
        removeComponent : function(entity, component, undefined)
        {
            if(!Array.isArray(entity))
                entity = [entity];
            
            var id;
            
            for(var puppy = 0; puppy < entity.length; puppy++)
            {
                if(this.list[entity[puppy]].hasOwnProperty(component))
                {
                    id = this.list[entity[puppy]][component];
                    Puppets.Components.removeComponent(id, component);
                    delete this.list[entity[puppy]][component];
                }
                else
                    return false;
            }

            return true;
        },
        removeEntity : function(entity)
        {
            if(typeof entity == "string")
                entity = entity.split('.');

            if(!Array.isArray(entity))
                entity = [entity];

            var nb = entity.length;
            var puppy;
            var e, puppo;
            
            for(puppy = 0; puppy < nb; puppy++)
            {
                e = entity[puppy];
                if(this.list[e] !== null && this.list[e] !== undefined)
                {
                    for(puppo in this.collections)
                    {
                        if(this.collections[puppo][e] !== null && this.collections[puppo][e] !== undefined)
                        {
                            delete this.collections[puppo][e];
                            break;
                        }
                    }
                    delete this.list[e];
                }
            }
        },
        switchCollection : function(entity, collection)
        {
            if(this.collections[collections] !== null && this.collections[collections] !== undefined)
            {
                if(!Array.isArray(entity))
                entity = [entity];
                
                var puppy;
                var moveEntity, puppo;
                
                for(puppy = 0; puppy < entity.length; puppy++)
                {
                    if(typeof entity[puppy] == "number")
                        moveEntity = ""+entity[puppy]+"";
                    else
                        moveEntity = entity[puppy];

                    for(puppo in this.collections)
                    {
                        if(this.collections[puppo].indexOf(moveEntity) > -1)
                        {
                            delete this.collections[puppo][moveEntity];
                            this.collections[collection][moveEntity] = moveEntity;
                            break;
                        }
                    }
                }
                return true;
            }

            return false;
        },
        copy : function(entity, number, collection)
        {
            entity = arrayzation(entity);
            var nb = entity.length;

            if(typeof number !== "number")
            {
                collection = number;
                number = 1;
            }
            else if(collection === undefined || typeof collection !== "string")
                collection = "world";

            for(var puppy = 0; puppy < nb; puppy++)
            {
                var copy = entity[puppy];
                var puppo, puppa;
                var newCopy, constructor;
                
                if(this.list[copy] !== undefined && this.list[copy] !== null)
                {
                    for(puppo = 0; puppo < number; puppo++)
                    {
                        newCopy = JSON.parse(JSON.stringify(this.list[copy]));
                        for(puppa in newCopy)
                        {
                            constructor = Puppets.Components.list[puppa][newCopy[puppa]];
                            newCopy[puppa] = Puppets.Components.addComponent(copy, puppa, constructor);
                        }
                        this.list[this.length] = newCopy;
                        this.length++;
                    }
                }
            }
        },
        find : function(clue)
        {
            clue = this._analyseString(clue);
            var list = this.list;
            var results = [];
            if(typeof clue == "object")
            {
                for(var puppy in list)
                {
                    if(list[puppy].hasOwnProperty(clue.clue) && Function("object", clue.compare)(Puppets.Components.list[clue.clue][list[puppy][clue.clue]]))
                        results.push(puppy);    
                }   
            }
            else
                for(var puppy in list)
                {
                    if(list[puppy].hasOwnProperty(clue))
                        results.push(puppy);
                }

            return results;
        },

        _analyseString : function(clue)
        {
            clue = clue.split(" ");
            if(clue.length <= 1)
                return clue[0];

            return {clue : clue[0], compare : "if(object."+clue[1]+"){return true;}else{return false}"};
        },

        getComponents : function(entity)
        {
            if(!Array.isArray(entity))
                entity = [entity];

            var object = {};
            var puppy, puppo;
            var refComp, result;
            
            for(puppy = 0; puppy < entity.length; puppy++)
            {
                result = {};
                refComp = this.list[entity[puppy]];

                if(refComp !== undefined && refComp !== null)
                {
                    for(puppo in refComp)
                        result[puppo] = Puppets.Components.list[puppo][refComp[puppo]];

                    object[puppy] = result;
                }
            }

            return object;
        },
        merge : function(createNew, params)
        {
            if(arguments.length < 4)
                return false;

            if(params === undefined || params === null)
                params = {};

            var entitiesToMerge = [];
            var puppy, puppo;
            
            for(puppy = 2; puppy < arguments.length; puppy++)
            {
                if(Array.isArray(arguments[puppy]))
                {
                    for(puppo = 0; puppo < arguments[puppy].length; puppo++)
                    {
                        if(typeof arguments[puppy][puppo] == "string" || typeof arguments[puppy][puppo] == "number")
                            entitiesToMerge.push(arguments[puppy][puppo]);
                    }
                }
                else if(typeof arguments[puppy] == "string" || typeof arguments[puppy] == "number")
                    entitiesToMerge.push(arguments[puppy]);
            }
            entitiesToMerge = this.getComponents(entitiesToMerge);

        },
        load : function(name, constructor)
        {
            if(this.models[name] !== undefined && this.models[name] !== null)
                console.warn("Name "+name+" overrided by entity "+constructor);

            this.models[name] = {components : constructor.components, data : constructor.data };
            return true;
        },
    };

    this.Components =
    {
        models : {},
        list : {},
        length : {},

        count : function(component)
        {
            var count = 0;
            for (var element in this.list[component]) 
            {
                if (this.list[component].hasOwnProperty(element)) 
                   ++count;
            }

           return count;
        },
        addComponent : function(entity, component, constructor, enabled)
        {
            if(this.list[component] === null || this.list[component] === undefined)
            {
                this.list[component] = {};
                this.length[component] = 0;
            }

            var id = this.length[component];
            this.list[component][id] = this.models[component].constructor(constructor || {}, entity);

            if(enabled !== undefined)
                this.list[component][id].enabled = enabled;
            else
                this.list[component][id].enabled = true;

            this.length[component]++;

            return id;
        },
        removeComponent : function(id, component, undefined)
        {
            if(this.list[component][id] !== null && this.list[component][id] !== undefined)
            {
                delete this.list[component][id];
            }
        },
        load : function(name, constructor, data)
        {
            if(this.models[name] !== undefined && this.models[name] !== null)
                console.warn("Name "+name+" overrided by component "+ constructor);

            this.models[name] = {constructor : constructor, data : data };
            return true;
        },
    };
    var arrayzation = function(value)
    {
        if(!Array.isArray(value))
                return [value];
    };

    var init = function(self)
    {
        window.Puppets = self;
        if(typeof(config) === "string")
            self.load(config);

        if(self.Entities.orderCollections.indexOf("world") < 0)
        {
            self.Entities.collections.world = {};
            self.Entities.orderCollections.push("world");
        }
    }(this);
    return this;
};

Puppets.prototype.run = function()
{
    this.Systems.launchSystems();
};

Puppets.prototype.find = function(clue, aplane)
{
    var results = [];
    if(aplane === undefined)
        aplane = true;
    
    clue = clue.split(',');

    var nb = clue.length;
    var puppy, puppo;
    
    for(puppy = 0; puppy < nb; puppy++)
    {
        if(clue[puppy].slice(0, 1) == ".")
        {
            results.push(this.Entities.collections[clue[puppy].slice(1)]);
            var tmp = [];
            for(puppo in results[results.length-1])
                tmp.push(results[results.length-1][puppo]);

            results[results.length-1] = tmp;
        }
        else
            results.push(this.Entities.find(clue[puppy]));
    }

    if(aplane)
    {
        var tmp = [];
        var array;
        
        for(puppy = 0; puppy < results.length; puppy++)
        {
            array = results[puppy];
            for(puppo = 0; puppo < array.length; puppo++)
            {
                if(tmp.indexOf(array[puppo]) < 0)
                    tmp.push(array[puppo]);
            }
        }
        results = tmp;
    }

    return results;
};

Puppets.prototype.removeEntity = function(entity)
{
    return this.Entities.removeEntity(entity);
};
Puppets.prototype.removeComponent = function(entity, component)
{
    return this.Entities.removeComponent(entity, component);
};
Puppets.prototype.addComponent = function(entity, component, settings, enabled, undefined)
{
    return this.Entities.addComponent(entity, component, settings, enabled);
};
Puppets.prototype.createEntity = function(model, constructor, collection)
{
    return this.Entities.createEntity(model, constructor, collection);
};
Puppets.prototype.getComponents = function(entity)
{
    return this.Entities.getComponents(entity);
};
Puppets.prototype.switchCollection = function(entity, collection)
{
    return this.Entities.switchCollection(entity, collection);
};
Puppets.prototype.copy = function(entity, number, collection)
{
    return this.Entities.copy(entity, number, collection);
};
Puppets.prototype.load = function(file, success, error)
{
    var request =new XMLHttpRequest();
    request.open("GET", file, false);
    request.send();
    if(request.response === "")
    {
        if(typeof(error) === 'function')
            error(request.response);

        throw console.warn("An error occured loading "+file);
        return false;
    }
    if(typeof(success) === "function")
        success(request.response);

    var module = document.createElement('script');
    module.innerHTML = request.response;
    document.body.appendChild(module);
    document.body.removeChild(module);
};
Puppets.prototype.entity = function(name, data){
    return this.Entities.load(name, data);
};
Puppets.prototype.component = function(name, method, data){
    return this.Components.load(name, method, data);
};
Puppets.prototype.system = function(name, method, data){
    return this.Systems.load(name, method, data);
};
Puppets.prototype.collection = function(collection, position){
    if(Array.isArray(collection))
    {
        this.Entities.orderCollections = collection;
        for(var puppy = 0; puppy < collection.length; puppy+=1)
            this.Entities.collections[collection[puppy]] = {};

        console.warn("Set new collection list : "+collection);
        return true;
    }
    else if(typeof(collection) === "string")
    {
        var indexCollection = this.Entities.orderCollections.indexOf(collection);

        if(indexCollection >= 0)
            this.Entities.orderCollections.splice(indexCollection, 1);

        if(typeof(position) !== "number")
        {
            this.Entities.orderCollections.push(collection);

            if(this.Entities.collections[collection] !== undefined)
                console.warn("Collection "+collection+" overrided");
        }
        else
            this.Entities.orderCollections.splice(position, 0, collection);

        this.Entities.collections[collection] = {};
        return true;
    }
    else
    {
        console.warn("Can not set collection : "+collection);
        return false;
    }
};
Puppets.prototype.systemList = function(list)
{
    if(Array.isArray(list))
        this.Systems.order = list;

    return this.Systems.order;
};

module.exports = new Puppets();

},{}],10:[function(require,module,exports){

var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

module.exports = requestAnimFrame;
},{}],11:[function(require,module,exports){
// require Of all files Needed
var Puppets               = require("../libs/puppets");
var EasyInputs            = require("../libs/EasyInput");
var EventController       = require("../modules/EventController");
var canvasConf            = require("../modules/configCanvas");
require("../puppetsModules/ennemiPattern1");
require("../puppetsModules/gate");
// require("../puppetsModules/wall");
require("../Systems/render");
require("../Systems/cameraFocus");
require("../Systems/collider");
var modulePlayer          = require("../puppetsModules/Player");
require("../puppetsModules/camera");
require("../Systems/polygoneUpdate");
require("../puppetsModules/ennemiesGenerator");
require("../Systems/killModulesPast");

var Game = {
                Puppets          : Puppets,
                Inputs           : new EasyInputs(),
                ctx              : canvasConf.ctx,
                canvas           : canvasConf.domCanvas,
                playerController : modulePlayer,
                eventController  : EventController
            };

// add of input controls
Game.Inputs.addEvent("keydown", window);
Game.Inputs.addEvent("touchend", Game.canvas);

Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("go-forward");}});

Game.eventController.add('gameOver',function(){window.location=window.location;});

// Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("rebound");}});

// console.log(Game.Inputs.getKeysBind());

// create entities 

// export browserify 
module.exports = Game;

},{"../Systems/cameraFocus":2,"../Systems/collider":3,"../Systems/killModulesPast":4,"../Systems/polygoneUpdate":5,"../Systems/render":6,"../libs/EasyInput":8,"../libs/puppets":9,"../modules/EventController":12,"../modules/configCanvas":14,"../puppetsModules/Player":15,"../puppetsModules/camera":16,"../puppetsModules/ennemiPattern1":17,"../puppetsModules/ennemiesGenerator":18,"../puppetsModules/gate":19}],12:[function(require,module,exports){

var EventsController = function (){ };
    
    EventsController.prototype.events = {};

    EventsController.prototype.add = function(myEvent,myFunction){
                            if(this.events[myEvent] === undefined)
                                this.events[myEvent]=[];

                            
                            this.events[myEvent].push(myFunction);

                            return this.events[myEvent].lengt-1;
                        };

    EventsController.prototype.emit = function(){
                            var args = Array.prototype.slice.call(arguments);
                            var eventName = args.shift();
                            
                            var listeners = this.events[eventName];

                            for (var i=0; i < listeners.length; i++) 
                            {
                                listeners[i].apply(this, args);
                            }
                        };
    EventsController.prototype.getEvent = function(string){
                            if(string.indexOf('*')!==-1)
                            {
                                return this.events;
                            }
                            else if(string.indexOf('*')=== -1)
                            {
                                var array  = string.split(' ');
                                var objetEvent = {};
                                for (var index in array)
                                    objetEvent[array[index]] = this.events[array[index]];
                                            
                                return objetEvent;
                            }                               
                        };
var controller = new EventsController();
// export browserify 
module.exports = controller;

},{}],13:[function(require,module,exports){
var basic = {};
basic.computePolygone= function(shape,x,y,width,height,angle){
    if(shape === "square"){

        var _lineTop = {a:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)}};
        var _lineBottom = {a:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)}};
        var _lineLeft = {a:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)}};
        var _lineRight = {a:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)}};

        return {'lineTop':_lineTop,'lineBottom':_lineBottom,'lineRight':_lineRight,'lineLeft':_lineLeft};
    }
    else if(shape==="VerticalLine"){
        
        var _lineLeft = {a:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+(width*-1)/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)}};
        var _lineRight = {a:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+(height*-1)/2)},b:{x:Math.cos(angle*Math.PI / 180)*(x+width/2),y:Math.sin(angle*Math.PI / 180)*(y+height/2)}};
        
        return {'lineRight':_lineRight,'lineLeft':_lineLeft};       
    }
};

module.exports = basic; 

},{}],14:[function(require,module,exports){
var config = {};
config.domCanvas = document.getElementById("canvas"); 
config.ctx = document.getElementById("canvas").getContext("2d");

module.exports = config; 
},{}],15:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

// component move smooth for player;
Puppets.component("move",function(data,entity,undefined){
    return {value:data.value||0, diviseur : data.diviseur || 2.5,direction : data.direction || 5 ,invertSwitch : false};
});

Puppets.component("score",function(data,entity,undefined){
    return {value:data.value||0};
});

Puppets.entity('player',{components : ['position',"imageRender",'render','size','speed','move','collider',"polygone","score"]});

var getIdCamera = Puppets.find('targetCamera');
    camera = Puppets.getComponents(getIdCamera[0])[0];

// system use to move player.
Puppets.system("move-forward",function(position,speed,move){
        var _speed = speed.value,
        _move      = move.value;
        _diviseur  = move.diviseur;

        if(position.x>=canvasConf.domCanvas.width||position.x<=0){
            moduleEventController.emit('gameOver');
            return;   
        }


            if(_move>0){
                if(_speed<0 && (position.x-_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur)>10)
                    position.x-=_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur;
                else if(_speed>0 && (position.x+_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur)<580)
                    position.x+=_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur;
                // camera.position.y -= 3*_diviseur;
                position.y-=3*_diviseur;
                move.value-=0.15/_diviseur;  
            }
            else{
                if((position.angle==90 || position.angle==-90) ){   
                    speed.value*=-1;
                    move.direction*=-1;
                    move.invertSwitch=false;
                }
                if(Math.sin(position.angle*Math.PI / 180)<1&&Math.sin(position.angle*Math.PI / 180)>-1 && position.x<580 && position.x<580)
                    position.y += _speed*Math.sin(position.angle*Math.PI / 180);
                if((Math.cos(position.angle*Math.PI / 180)<1&&Math.cos(position.angle*Math.PI / 180)>-1 && position.x<580))
                    position.x += _speed*Math.cos(position.angle*Math.PI / 180);
                
                position.angle+= move.direction;
            }
     
        
},{components : ['position','speed','move']});

var PlayerController = function (){

    var params = { x:canvasConf.domCanvas.width/2, y:0, angle:0,imgAngle : 90,path:"sources/assets/",name:"pac-man.png", width : 50, height : 50  , shape : "square", ctx : canvasConf.ctx, fill :"#ff00ee", smoothX:0,smoothY:0,type:"player",lines :{}};

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);

    this.init(params);
};

PlayerController.prototype.init = function(params){
    params.image = new Image();
    params.image.src = params.path+params.name;
    console.log(params.image)

    this.entityNumber = Puppets.createEntity('player',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        imageRender   :{path : params.path , name : params.name, image : params.image,imgAngle : params.imgAngle},
                                                        render   :{ctx: params.ctx},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines}});
    var entitys = Puppets.find('collider');
    var othersComponents = [];
    entitys.forEach(function(element,index,array){
        
        var _myEntity = Puppets.getComponents(element)[0];
        if(_myEntity.collider.type !== 'player'){
            for (var i in _myEntity.polygone.lines){
                othersComponents.push(_myEntity.polygone.lines[i]);
            } 
        }
    
    });

    
    Puppets.component("others",function(data,entity,undefined){
        return { lines : data.others};
    });

    Puppets.addComponent(this.entityNumber,'others',{others : othersComponents});

    this.setEvents();
};

PlayerController.prototype.setEvents = function(){

    moduleEventController.add("go-forward",function(){  
        var _self = Puppets.getComponents(this.entityNumber)[0];
        _self.move.value +=1; 
        moduleEventController.emit("generateEnemie",_self.position);
    }.bind(this));
    
    moduleEventController.add("generateEnemie",function(){
        var entitys = Puppets.find('collider');
        var othersComponents = [];

        entitys.forEach(function(element,index,array){
            
            var _myEntity = Puppets.getComponents(element)[0];
            if(_myEntity.collider.type !== 'player'){
                for (var i in _myEntity.polygone.lines){
                    othersComponents.push(_myEntity.polygone.lines[i]);
                } 
            }
        
        });

        Puppets.getComponents(this.entityNumber)[0].others.lines = othersComponents;

    }.bind(this));
    moduleEventController.add("rebound",function(){ 

        var _self = Puppets.getComponents(this.entityNumber)[0];
        if(!_self.move.invertSwitch){
            _self.speed.value *=-1; 
            _self.move.direction *=-1; 
            _self.move.invertSwitch = true;     
        }

    }.bind(this));

    moduleEventController.add("score++",function(){ 

        var _self = Puppets.getComponents(this.entityNumber)[0];
            _self.score.value+=1;   
            console.log('your score is of ',_self.score.value);  

    }.bind(this));
};


// browserify export
module.exports = new PlayerController();
},{"../Components/basicsComponents":1,"../modules/EventController":12,"../modules/basicMethodes":13,"../modules/configCanvas":14}],16:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 = require("../modules/basicMethodes");

Puppets.entity('camera',{components : ['position']});

var Camera = function (x,y){

    var params = { x:x, y:y,angle:0,width:600,height:400};
    
    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
    this.init(params);
};

Camera.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('camera',{position:{x:params.x, y:params.y,angle: params.angle}
    });

    var _playerEntity = Puppets.find('move');
    var _playerRef = Puppets.getComponents(_playerEntity)[0];
    // component move smooth for player;
    Puppets.component("targetCamera",function(data,entity,undefined){
        return {ref:data.target};
    });

    Puppets.addComponent(this.entityNumber,"targetCamera",{target : _playerRef});
};
module.exports = new Camera(300,-300);

},{"../Components/basicsComponents":1,"../modules/EventController":12,"../modules/basicMethodes":13,"../modules/configCanvas":14}],17:[function(require,module,exports){
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

    var params = { x:x, y:y , angle :   angle, width : w, height : h ,imgAngle : 45,path:"sources/assets/",name:"gosht-" , shape : "square", speed:speed ,ctx : canvasConf.ctx, type:"bloc",lines :{},fill :"#ffffff" };

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


},{"../Components/basicsComponents":1,"../modules/basicMethodes":13,"../modules/configCanvas":14}],18:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");
var moduleEventController = require("../modules/EventController");
var blocFactory           = require("../puppetsModules/ennemiPattern1");
var gate                  = require("../puppetsModules/gate");

var EnnemieGenerator = function (){

    EnnemieGenerator.prototype.init = function(){
        this.setEvents();
    };

    EnnemieGenerator.prototype.setEvents = function(){

        moduleEventController.add("generateEnemie",function(posPlayer){
            new blocFactory(50,posPlayer.y-168,45,25,25);
            new gate(0,posPlayer.y-168,0,10000,1);

        });

    };

    this.init();
};

// 84
new EnnemieGenerator(50,298,45,25,25);
module.exports = this;
},{"../Components/basicsComponents":1,"../modules/EventController":12,"../modules/basicMethodes":13,"../modules/configCanvas":14,"../puppetsModules/ennemiPattern1":17,"../puppetsModules/gate":19}],19:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");


Puppets.entity('gate',{components : ['position','render','size','collider',"polygone"]});




var gateFactory = function (x,y,angle,w,h){

    var params = { x:x, y:y , angle :   angle, width : w, height : h  , shape : "square", ctx : canvasConf.ctx, type:"gate",lines :{},fill :"rgba(29, 240, 214,0.8)" };

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
    this.init(params);
};

gateFactory.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('gate',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        render   :{ctx: params.ctx,fill:params.fill},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines}});
};

gateFactory.prototype.setEvents = function(){

};
// 84
new gateFactory(0,320,0,10000,1);
module.exports = gateFactory;


},{"../Components/basicsComponents":1,"../modules/basicMethodes":13,"../modules/configCanvas":14}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvQ29tcG9uZW50cy9iYXNpY3NDb21wb25lbnRzLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL1N5c3RlbXMvY2FtZXJhRm9jdXMuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvU3lzdGVtcy9jb2xsaWRlci5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9TeXN0ZW1zL2tpbGxNb2R1bGVzUGFzdC5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9TeXN0ZW1zL3BvbHlnb25lVXBkYXRlLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL1N5c3RlbXMvcmVuZGVyLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL2Zha2VfYTg0MmVlNC5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9saWJzL0Vhc3lJbnB1dC5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9saWJzL3B1cHBldHMuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbGlicy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbG9hZGVyL2dhbWUuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbW9kdWxlcy9FdmVudENvbnRyb2xsZXIuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbW9kdWxlcy9iYXNpY01ldGhvZGVzLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL21vZHVsZXMvY29uZmlnQ2FudmFzLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL3B1cHBldHNNb2R1bGVzL1BsYXllci5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9wdXBwZXRzTW9kdWxlcy9jYW1lcmEuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvcHVwcGV0c01vZHVsZXMvZW5uZW1pUGF0dGVybjEuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvcHVwcGV0c01vZHVsZXMvZW5uZW1pZXNHZW5lcmF0b3IuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvcHVwcGV0c01vZHVsZXMvZ2F0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDam1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBCYXNpYyBjb21wb25lbnRzIGZvciBlbnRpdGllcyAhXG5cblB1cHBldHMuY29tcG9uZW50KFwicG9zaXRpb25cIixmdW5jdGlvbihkYXRhLGVudGl0eSx1bmRlZmluZWQpe1xuICAgIHJldHVybiB7IGFuZ2xlIDogZGF0YS5hbmdsZSB8fCAwICwgeCA6IGRhdGEueCB8fCAwICAsIHkgOiBkYXRhLnkgfHwgMCB9O1xufSk7XG5cblB1cHBldHMuY29tcG9uZW50KFwicmVuZGVyXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICByZXR1cm4geyBjdHggOiBkYXRhLmN0eCAsRmlsbGNvbG9yIDogZGF0YS5maWxsIHx8IFwicmdiYSgwLDAsMCwwKVwiICwgU3Ryb2tlY29sb3IgOiBkYXRhLnN0cm9rZSB8fCBcInJnYmEoMCwwLDAsMClcIiB9O1xufSk7XG5cblB1cHBldHMuY29tcG9uZW50KFwic2l6ZVwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHsgd2lkdGggOiBkYXRhLncgfHwgNTAgICwgaGVpZ2h0IDogZGF0YS5oIHx8IDUwIH07XG59KTtcblxuUHVwcGV0cy5jb21wb25lbnQoXCJzcGVlZFwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHsgdmFsdWUgOiBkYXRhLnZhbHVlIHx8IDUgfTtcbn0pO1xuXG5QdXBwZXRzLmNvbXBvbmVudChcImNvbGxpZGVyXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICByZXR1cm4geyB0eXBlIDogZGF0YS50eXBlIHx8IFwiYmxvY2tcIixzaGFwZSA6IGRhdGEuc2hhcGUgfHwgJycsZW50aXR5IDogZGF0YS5lbnRpdHl8fC0xfTtcbn0pO1xuXG5QdXBwZXRzLmNvbXBvbmVudChcImltYWdlUmVuZGVyXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICByZXR1cm4geyBwYXRoIDogZGF0YS5wYXRoIHx8IFwiLi9hc3NldHNcIiwgbmFtZSA6IGRhdGEubmFtZXx8XCJcIiwgaW1hZ2UgOiBkYXRhLmltYWdlLGFuZ2xlIDogZGF0YS5pbWdBbmdsZX07XG59KTtcblxuUHVwcGV0cy5jb21wb25lbnQoXCJwb2x5Z29uZVwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHsgbGluZXMgOiBkYXRhLmxpbmVzfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXM7ICIsIiAgICB2YXIgUHVwcGV0cyAgICA9IHJlcXVpcmUoXCIuLi9saWJzL3B1cHBldHNcIik7XG4gICAgdmFyIGNhbnZhc0NvbmYgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9jb25maWdDYW52YXNcIik7XG52YXIgZXZlbnRzQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcblxuXG5QdXBwZXRzLnN5c3RlbShcImNhbWVyYUZvY3VzXCIsZnVuY3Rpb24ocG9zaXRpb24sdGFyZ2V0Q2FtZXJhKXtcbiAgICAgICAgaWYodGFyZ2V0Q2FtZXJhLnJlZiE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgIHRhcmdldHkgPSB0YXJnZXRDYW1lcmEucmVmLnBvc2l0aW9uLnk7XG4gICAgICAgICAgIGlmKHRhcmdldHkgPHBvc2l0aW9uLnkrMjAwKVxuICAgICAgICAgICAgICAgcG9zaXRpb24ueSAtPTI7ICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBcblxufSx7Y29tcG9uZW50cyA6IFtcInBvc2l0aW9uXCIsXCJ0YXJnZXRDYW1lcmFcIl19KTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aGlzOyBcbiIsInZhciBQdXBwZXRzICAgID0gcmVxdWlyZShcIi4uL2xpYnMvcHVwcGV0c1wiKTtcbnZhciBjYW52YXNDb25mID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIGV2ZW50c0NvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9FdmVudENvbnRyb2xsZXJcIik7XG5cblB1cHBldHMuc3lzdGVtKFwiY29sbGlkZXJcIixmdW5jdGlvbihwb3NpdGlvbixjb2xsaWRlcixzaXplLG90aGVycyxwb2x5Z29uZSl7XG5cblxuICAgIHZhciB4ICAgICAgICAgICA9IHBvc2l0aW9uLngsXG4gICAgICAgIHkgICAgICAgICAgID0gcG9zaXRpb24ueSxcbiAgICAgICAgYW5nbGUgICAgICAgPSBwb3NpdGlvbi5hbmdsZSxcbiAgICAgICAgd2lkdGggICAgICAgPSBzaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQgICAgICA9IHNpemUuaGVpZ2h0O1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaSBpbiBwb2x5Z29uZS5saW5lcyl7XG4gICAgICAgICAgICB2YXIgX3BsYXllckxpbmUxeCA9IHBvbHlnb25lLmxpbmVzW2ldLmEueCxcbiAgICAgICAgICAgICAgICBfcGxheWVyTGluZTF5ID0gcG9seWdvbmUubGluZXNbaV0uYS55LFxuICAgICAgICAgICAgICAgIF9wbGF5ZXJMaW5lMnggPSBwb2x5Z29uZS5saW5lc1tpXS5iLngsXG4gICAgICAgICAgICAgICAgX3BsYXllckxpbmUyeSA9IHBvbHlnb25lLmxpbmVzW2ldLmIueTtcblxuICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMDtwPG90aGVycy5saW5lcy5sZW5ndGg7KytwKXtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBfb3RoZXJMaW5lMXggPSBvdGhlcnMubGluZXNbcF0uYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgX290aGVyTGluZTF5ID0gb3RoZXJzLmxpbmVzW3BdLmEueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9vdGhlckxpbmUyeCA9IG90aGVycy5saW5lc1twXS5iLngsXG4gICAgICAgICAgICAgICAgICAgICAgICBfb3RoZXJMaW5lMnkgPSBvdGhlcnMubGluZXNbcF0uYi55O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGVzdCBpZiBsaW5lcyBhcmUgcGFyYWxsZXMgaWYgdGhleSBhcmUgIHRlc3QgPSAgMC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RQYXJhbGxlID0gKChfcGxheWVyTGluZTJ5IC0gX3BsYXllckxpbmUxeSkqIChfb3RoZXJMaW5lMnggLSBfb3RoZXJMaW5lMXgpKSAtICgoX3BsYXllckxpbmUyeCAtIF9wbGF5ZXJMaW5lMXgpKihfb3RoZXJMaW5lMnktIF9vdGhlckxpbmUxeSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdENyb3NzTGluZVRvTGluZUEgPSAoKChfcGxheWVyTGluZTJ4LV9wbGF5ZXJMaW5lMXgpKihfb3RoZXJMaW5lMXktIF9wbGF5ZXJMaW5lMXkpKS0oKF9wbGF5ZXJMaW5lMnktX3BsYXllckxpbmUxeSkqKF9vdGhlckxpbmUxeC0gX3BsYXllckxpbmUxeCkpKS90ZXN0UGFyYWxsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0Q3Jvc3NMaW5lVG9MaW5lQiA9ICgoKF9vdGhlckxpbmUyeC1fb3RoZXJMaW5lMXgpICogKF9vdGhlckxpbmUxeSAtIF9wbGF5ZXJMaW5lMXkpKS0oKF9vdGhlckxpbmUyeSAtIF9vdGhlckxpbmUxeSkgKiAoX290aGVyTGluZTF4IC0gX3BsYXllckxpbmUxeCkpKSAvIHRlc3RQYXJhbGxlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0ZXN0Q3Jvc3NMaW5lVG9MaW5lQSA8IDApIHx8ICh0ZXN0Q3Jvc3NMaW5lVG9MaW5lQSA+IDEpIHx8ICh0ZXN0Q3Jvc3NMaW5lVG9MaW5lQiA8IDApIHx8ICh0ZXN0Q3Jvc3NMaW5lVG9MaW5lQiA+IDEpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwieW9sbyBjYSBjZSBjcm9pc2UgcGFzICFcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xsaXNpb25cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvdGhlcnMubGluZXNbcF0uY29sbGlkZXJUeXBlID09PSBcImJsb2NcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHNDb250cm9sbGVyLmVtaXQoJ2dhbWVPdmVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKG90aGVycy5saW5lc1twXS5jb2xsaWRlclR5cGUgPT09IFwiZ2F0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50c0NvbnRyb2xsZXIuZW1pdCgnc2NvcmUrKycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2NvcmUgdXBncmFkZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgfSAgIFxufSx7Y29tcG9uZW50cyA6IFsncG9zaXRpb24nLCdjb2xsaWRlcicsJ3NpemUnLCdvdGhlcnMnLCdwb2x5Z29uZSddfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpczsgXG4iLCJ2YXIgUHVwcGV0cyAgICA9IHJlcXVpcmUoXCIuLi9saWJzL3B1cHBldHNcIik7XG52YXIgY2FudmFzQ29uZiA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2NvbmZpZ0NhbnZhc1wiKTtcbnZhciBldmVudHNDb250cm9sbGVyID0gcmVxdWlyZShcIi4uL21vZHVsZXMvRXZlbnRDb250cm9sbGVyXCIpO1xuXG4gICAgdmFyIGdldElkUGxheWVyID0gUHVwcGV0cy5maW5kKCdzY29yZScpO1xuICAgICAgICBwbGF5ZXIgPSBQdXBwZXRzLmdldENvbXBvbmVudHMoZ2V0SWRQbGF5ZXJbMF0pWzBdO1xuICAgIHZhciBnZXRJZENhbWVyYSA9IFB1cHBldHMuZmluZCgndGFyZ2V0Q2FtZXJhJyk7XG4gICAgICAgIGNhbWVyYSA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyhnZXRJZENhbWVyYVswXSlbMF07XG5cblB1cHBldHMuc3lzdGVtKFwiZ2FyYmFnZUNvbGxlY3RvclwiLGZ1bmN0aW9uKHBvc2l0aW9uLHNpemUsY29sbGlkZXIscG9seWdvbmUsZW50aXR5KXtcblxuICAgICAgICBpZihwbGF5ZXIucG9zaXRpb24ueSE9PXVuZGVmaW5lZCAmJiBjb2xsaWRlci50eXBlICE9PSBwbGF5ZXIuY29sbGlkZXIudHlwZSl7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihwb3NpdGlvbi55PnBsYXllci5wb3NpdGlvbi55KzI1MClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBQdXBwZXRzLnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuXG59LHtjb21wb25lbnRzIDogW1wicG9zaXRpb25cIiwnc2l6ZScsJ2NvbGxpZGVyJyxcInBvbHlnb25lXCJdfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpcztcbiIsInZhciBQdXBwZXRzICAgID0gcmVxdWlyZShcIi4uL2xpYnMvcHVwcGV0c1wiKTtcbnZhciBjYW52YXNDb25mID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xuXG5cbnZhciBnZXRJZENhbWVyYSA9IFB1cHBldHMuZmluZCgndGFyZ2V0Q2FtZXJhJyk7XG4gICAgY2FtZXJhID0gUHVwcGV0cy5nZXRDb21wb25lbnRzKGdldElkQ2FtZXJhWzBdKVswXTtcblxuXG4vLyBwdXBwZXQgU3lzdGVtIERyYXcgXG5QdXBwZXRzLnN5c3RlbShcInBvbHlnb25lVXBkYXRlXCIsZnVuY3Rpb24ocG9zaXRpb24sc2l6ZSxwb2x5Z29uZSxjb2xsaWRlcil7XG4gICAgICAgIHZhciB4ICAgICAgICAgICA9IHBvc2l0aW9uLngsXG4gICAgICAgICAgICB5ICAgICAgICAgICA9IHBvc2l0aW9uLnktY2FtZXJhLnBvc2l0aW9uLnksXG4gICAgICAgICAgICBhbmdsZSAgICAgICA9IHBvc2l0aW9uLmFuZ2xlLFxuICAgICAgICAgICAgd2lkdGggICAgICAgPSBzaXplLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgPSBzaXplLmhlaWdodDtcbiAgICAgICAgXG4gICAgaWYocG9seWdvbmUubGluZXMubGluZVRvcCE9PXVuZGVmaW5lZCl7XG4gICAgcG9seWdvbmUubGluZXMubGluZVRvcC5hLnggPSBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrKHdpZHRoKi0xKS8yKS14KSAtIE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApICogKCh5KyhoZWlnaHQqLTEpLzIpLXkpK3g7XG4gICAgcG9seWdvbmUubGluZXMubGluZVRvcC5hLnkgPSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrKHdpZHRoKi0xKS8yKS14KSArIE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkrKGhlaWdodCotMSkvMikteSkreTtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lVG9wLmIueCA9IE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCt3aWR0aC8yKS14KSAtIE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApICogKCh5KyhoZWlnaHQqLTEpLzIpLXkpK3g7XG4gICAgcG9seWdvbmUubGluZXMubGluZVRvcC5iLnkgPSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrd2lkdGgvMikteCkgKyBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5KyhoZWlnaHQqLTEpLzIpLXkpK3k7XG4gICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgXG4gICAgaWYocG9seWdvbmUubGluZXMubGluZUxlZnQhPT11bmRlZmluZWQpe1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0LmEueCA9IE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCsod2lkdGgqLTEpLzIpLXgpIC0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkgKiAoKHkrKGhlaWdodCotMSkvMikteSkreDtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lTGVmdC5hLnkgPSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrKHdpZHRoKi0xKS8yKS14KSArIE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkrKGhlaWdodCotMSkvMikteSkreTtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lTGVmdC5iLnggPSBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrKHdpZHRoKi0xKS8yKS14KSAtIE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApICogKCh5K2hlaWdodC8yKS15KSt4O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0LmIueSA9IE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCsod2lkdGgqLTEpLzIpLXgpICsgTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeStoZWlnaHQvMikteSkreTtcbiAgICB9XG4gICAgICAgIFxuXG4gICAgaWYocG9seWdvbmUubGluZXMubGluZVJpZ2h0IT09dW5kZWZpbmVkKXtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lUmlnaHQuYS54ID0gTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4K3dpZHRoLzIpLXgpIC0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkgKiAoKHkrKGhlaWdodCotMSkvMikteSkreDtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lUmlnaHQuYS55ID0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4K3dpZHRoLzIpLXgpICsgTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeSsoaGVpZ2h0Ki0xKS8yKS15KSt5O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVSaWdodC5iLnggPSBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrd2lkdGgvMikteCkgLSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSAqICgoeStoZWlnaHQvMikteSkreDtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lUmlnaHQuYi55ID0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4K3dpZHRoLzIpLXgpICsgTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeStoZWlnaHQvMikteSkreTtcblxuICAgIH1cbiAgICBcbiAgICAgICAgXG4gICAgaWYocG9seWdvbmUubGluZXMubGluZUJvdHRvbSE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAvLyBjb3ModGhldGEpICogKHB4LW94KSAtIHNpbih0aGV0YSkgKiAocHktb3kpICsgb3hcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lQm90dG9tLmEueCA9IE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCsod2lkdGgqLTEpLzIpLXgpIC0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkgKiAoKHkraGVpZ2h0LzIpLXkpK3g7XG4gICAgICAgICAgICAgICAgIC8vIHNpbih0aGV0YSkgKiAocHgtb3gpICsgY29zKHRoZXRhKSAqIChweS1veSkgKyBveVxuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVCb3R0b20uYS55ID0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4Kyh3aWR0aCotMSkvMikteCkgKyBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5K2hlaWdodC8yKS15KSt5O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVCb3R0b20uYi54ID0gTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4K3dpZHRoLzIpLXgpIC0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeStoZWlnaHQvMikteSkreDtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lQm90dG9tLmIueSA9IE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCt3aWR0aC8yKS14KSArIE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkraGVpZ2h0LzIpLXkpK3k7XG4gICAgfVxuXG4gICAgaWYocG9seWdvbmUubGluZXMubGluZVRvcCE9PXVuZGVmaW5lZCYmcG9seWdvbmUubGluZXMubGluZVRvcC5jb2xsaWRlclR5cGU9PT11bmRlZmluZWQgJiZcbiAgICAgICAgcG9seWdvbmUubGluZXMubGluZUxlZnQhPT11bmRlZmluZWQmJnBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0LmNvbGxpZGVyVHlwZT09PXVuZGVmaW5lZCAmJlxuICAgICAgICBwb2x5Z29uZS5saW5lcy5saW5lUmlnaHQhPT11bmRlZmluZWQmJnBvbHlnb25lLmxpbmVzLmxpbmVSaWdodC5jb2xsaWRlclR5cGU9PT11bmRlZmluZWQgJiZcbiAgICAgICAgcG9seWdvbmUubGluZXMubGluZUJvdHRvbSE9PXVuZGVmaW5lZCYmcG9seWdvbmUubGluZXMubGluZUJvdHRvbS5jb2xsaWRlclR5cGU9PT11bmRlZmluZWQgKVxuICAgIHsgICBcbiAgICAgICAgcG9seWdvbmUubGluZXMubGluZVRvcC5jb2xsaWRlclR5cGUgPXBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0LmNvbGxpZGVyVHlwZSA9cG9seWdvbmUubGluZXMubGluZVJpZ2h0LmNvbGxpZGVyVHlwZSA9cG9seWdvbmUubGluZXMubGluZUJvdHRvbS5jb2xsaWRlclR5cGUgPSBjb2xsaWRlci50eXBlIDsgIFxuICAgIH1cbiAgIC8vIGRlYnVnZ2VyOyAgICAgICAgICAgIFxufSx7Y29tcG9uZW50cyA6IFtcInBvc2l0aW9uXCIsXCJzaXplXCIsXCJwb2x5Z29uZVwiLFwiY29sbGlkZXJcIl19KTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aGlzOyBcbiIsInZhciBQdXBwZXRzICAgID0gcmVxdWlyZShcIi4uL2xpYnMvcHVwcGV0c1wiKTtcbnZhciBjYW52YXNDb25mID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xuXG4vLyBwdXBwZXQgU3lzdGVtIERyYXdcbiAgICBcblB1cHBldHMuc3lzdGVtKFwiZHJhd1wiLGZ1bmN0aW9uKHBvbHlnb25lLHJlbmRlcixzaXplKXtcbiAgICBpZihyZW5kZXIuY3R4ICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICB2YXIgY3R4ICAgICAgICAgPSByZW5kZXIuY3R4LFxuICAgICAgICAgICAgc3Ryb2tlY29sb3IgPSByZW5kZXIuU3Ryb2tlY29sb3IsXG4gICAgICAgICAgICBmaWxsY29sb3IgICA9IHJlbmRlci5GaWxsY29sb3IsXG4gICAgICAgICAgICBsaW5lVG9wICAgICA9IHBvbHlnb25lLmxpbmVzLmxpbmVUb3AsXG4gICAgICAgICAgICBsaW5lTGVmdCAgICA9IHBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0LFxuICAgICAgICAgICAgbGluZVJpZ2h0ICAgPSBwb2x5Z29uZS5saW5lcy5saW5lUmlnaHQsXG4gICAgICAgICAgICBsaW5lQm90dG9tICA9IHBvbHlnb25lLmxpbmVzLmxpbmVCb3R0b207XG5cblxuICAgICAgICAgICAgLy8geCAgICAgICAgICAgPSBwb3NpdGlvbi54LFxuICAgICAgICAgICAgLy8geSAgICAgICAgICAgPSBwb3NpdGlvbi55LFxuICAgICAgICAgICAgLy8gYW5nbGUgICAgICAgPSBwb3NpdGlvbi5hbmdsZSxcbiAgICAgICAgICAgIC8vIHdpZHRoICAgICAgID0gc2l6ZS53aWR0aCxcbiAgICAgICAgICAgIC8vIGhlaWdodCAgICAgID0gc2l6ZS5oZWlnaHQ7XG4gICAgICAgIGlmKGZpbGxjb2xvciE9PXVuZGVmaW5lZClcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGU9ZmlsbGNvbG9yO1xuICAgICAgICBpZihzdHJva2Vjb2xvciE9PXVuZGVmaW5lZClcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZT1zdHJva2Vjb2xvcjtcblxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIC8vIG1pc2UgZW4gcGxhY2UgZGUgbCdhbmdsZVxuICAgICAgICAvLyBjdHguc2F2ZSgpO1xuICAgICAgICAvLyAvL2RlcGxhY2VtZW50IHZlcnMgbCdvYmpldCBwYXIgcmFwcG9ydCDDoCBsYSBjYW1lcmFcbiAgICAgICAgLy8gY3R4LnRyYW5zbGF0ZSh4LHkpO1xuICAgICAgICAvLyAvL3JvdGF0ZSBkdSBjYW52YXMgcGFyIEwnYW5nbGUgZGUgbCdvYmpldCB1bml0eVxuICAgICAgICAvLyBjdHgucm90YXRlKGFuZ2xlKk1hdGguUEkvMTgwKTtcbiAgICAgICAgLy9kZXNzaW5zIGR1IHJlY3RhbmdsZSBieSBsaW5lcyBmcm9tIHBvc2l0aW9uIHggYW5kIHlcbiAgICAgICAgLy8gY3R4Lm1vdmVUbyh4Kyh3aWR0aCotMSkvMix5KyhoZWlnaHQqLTEpLzIpO1xuICAgICAgICAvLyBjdHgubGluZVRvKHgrd2lkdGgseSsoaGVpZ2h0Ki0xKS8yKTtcbiAgICAgICAgLy8gY3R4LmxpbmVUbyh4K3dpZHRoLHkraGVpZ2h0KTtcbiAgICAgICAgLy8gY3R4LmxpbmVUbyh4Kyh3aWR0aCotMSkvMix5K2hlaWdodCk7XG4gICAgICAgIC8vIGN0eC5saW5lVG8oeCsod2lkdGgqLTEpLzIseSsoaGVpZ2h0Ki0xKS8yKTtcbiAgICAgICAgXG4gICAgICAgIGN0eC5tb3ZlVG8obGluZVRvcC5hLngsbGluZVRvcC5hLnkpO1xuICAgICAgICBjdHgubGluZVRvKGxpbmVSaWdodC5hLngsbGluZVJpZ2h0LmEueSk7XG4gICAgICAgIGN0eC5saW5lVG8obGluZUJvdHRvbS5iLngsbGluZUJvdHRvbS5iLnkpO1xuICAgICAgICBjdHgubGluZVRvKGxpbmVMZWZ0LmIueCxsaW5lTGVmdC5iLnkpO1xuICAgICAgICBjdHgubGluZVRvKGxpbmVMZWZ0LmEueCxsaW5lTGVmdC5hLnkpO1xuXG4gICAgICAgIC8vIG9uIHJlc3RhdXJlIGxlIGNhbnZhcyBhIHNvbiBldGF0IG9yaWdpbmFsLlxuICAgICAgICAvLyBjdHgucmVzdG9yZSgpO1xuICAgICAgICBcbiAgICAgICAgLy8gb24gYXJyZXRlIGRlIGRlc3NpbmVyXG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIH0gICBcbn0se2NvbXBvbmVudHMgOiBbJ3BvbHlnb25lJywncmVuZGVyJywnc2l6ZSddfSk7XG5cbnZhciBnZXRJZENhbWVyYSA9IFB1cHBldHMuZmluZCgndGFyZ2V0Q2FtZXJhJyk7XG4gICAgY2FtZXJhID0gUHVwcGV0cy5nZXRDb21wb25lbnRzKGdldElkQ2FtZXJhWzBdKVswXTtcblxuUHVwcGV0cy5zeXN0ZW0oXCJkcmF3MVwiLGZ1bmN0aW9uKHBvc2l0aW9uLHJlbmRlcixpbWFnZVJlbmRlcixzaXplKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaW1hZ2VSZW5kZXIuaW1hZ2UpO1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICBpZihyZW5kZXIuY3R4ICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBcbiAgICAgICAgdmFyIGN0eCAgICAgICAgID0gcmVuZGVyLmN0eCxcbiAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHggICAgICAgICAgID0gcG9zaXRpb24ueCxcbiAgICAgICAgICAgIHkgICAgICAgICAgID0gcG9zaXRpb24ueS1jYW1lcmEucG9zaXRpb24ueSxcbiAgICAgICAgICAgIGFuZ2xlICAgICAgID0gcG9zaXRpb24uYW5nbGUsXG4gICAgICAgICAgICB3aWR0aCAgICAgICA9IHNpemUud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQgICAgICA9IHNpemUuaGVpZ2h0O1xuXG4gICAgICAgIC8vIGlmKGZpbGxjb2xvciE9PXVuZGVmaW5lZClcbiAgICAgICAgLy8gICAgIGN0eC5maWxsU3R5bGU9ZmlsbGNvbG9yO1xuICAgICAgICAvLyBpZihzdHJva2Vjb2xvciE9PXVuZGVmaW5lZClcbiAgICAgICAgLy8gICAgIGN0eC5zdHJva2VTdHlsZT1zdHJva2Vjb2xvcjtcblxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIC8vIG1pc2UgZW4gcGxhY2UgZGUgbCdhbmdsZVxuICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAvL2RlcGxhY2VtZW50IHZlcnMgbCdvYmpldCBwYXIgcmFwcG9ydCDDoCBsYSBjYW1lcmFcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSh4LHkpO1xuICAgICAgICBjdHgucm90YXRlKChhbmdsZS1pbWFnZVJlbmRlci5hbmdsZSkqTWF0aC5QSS8xODApO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltYWdlUmVuZGVyLmltYWdlLDAsMCxpbWFnZVJlbmRlci5pbWFnZS53aWR0aCxpbWFnZVJlbmRlci5pbWFnZS5oZWlnaHQsd2lkdGgqLTAuNSxoZWlnaHQqLTAuNSx3aWR0aCxoZWlnaHQpO1xuICAgICAgICAvL3JvdGF0ZSBkdSBjYW52YXMgcGFyIEwnYW5nbGUgZGUgbCdvYmpldCB1bml0eVxuICAgICAgICAvL2Rlc3NpbnMgZHUgcmVjdGFuZ2xlIGJ5IGxpbmVzIGZyb20gcG9zaXRpb24geCBhbmQgeVxuICAgICAgICAvLyBjdHgubW92ZVRvKGxpbmVUb3AuYS54LGxpbmVUb3AuYS55KTtcbiAgICAgICAgLy8gY3R4LmxpbmVUbyhsaW5lUmlnaHQuYS54LGxpbmVSaWdodC5hLnkpO1xuICAgICAgICAvLyBjdHgubGluZVRvKGxpbmVCb3R0b20uYi54LGxpbmVCb3R0b20uYi55KTtcbiAgICAgICAgLy8gY3R4LmxpbmVUbyhsaW5lTGVmdC5iLngsbGluZUxlZnQuYi55KTtcbiAgICAgICAgLy8gY3R4LmxpbmVUbyhsaW5lTGVmdC5hLngsbGluZUxlZnQuYS55KTtcblxuICAgICAgICAvLyBvbiByZXN0YXVyZSBsZSBjYW52YXMgYSBzb24gZXRhdCBvcmlnaW5hbC5cbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIG9uIGFycmV0ZSBkZSBkZXNzaW5lclxuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9ICAgXG59LHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ3JlbmRlcicsJ2ltYWdlUmVuZGVyJywnc2l6ZSddfSk7XG5tb2R1bGUuZXhwb3J0cyA9IHRoaXM7IFxuXG4iLCJ3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBHYW1lID0gcmVxdWlyZSgnLi9sb2FkZXIvZ2FtZScpO1xuICAgIHZhciByZXF1ZXN0QW5pbUZyYW1lID0gcmVxdWlyZSgnLi9saWJzL3JlcXVlc3RBbmltYXRpb25GcmFtZScpO1xuXG4gICAgKGZ1bmN0aW9uIGdhbWVsb29wKCl7ICAgIFxuICAgICAgICAvLyBjbGVhciBvZiBjYW52YXMgIFxuICAgICAgICBHYW1lLmN0eC5jbGVhclJlY3QoMCwgMCwgR2FtZS5jYW52YXMud2lkdGgsR2FtZS5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgR2FtZS5QdXBwZXRzLnJ1bigpO1xuICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKGdhbWVsb29wKTtcblxuICAgIH0pKCk7XG59OyIsIi8vIGNyZWF0ZSBieSA6IHdpbmNrZWxsIGJlbmphbWluXHJcbi8qXHJcbipjbGFzcyBvZiBpbnB1dCBldmVudCBnZXN0aW9uLlxyXG4qdGhpcyBsaWIgY2FuIGJlIHVzZSBmb3IgbWFuYWdlIHNpbXBsZXMgaW5wdXRzIHdpdGggbXVsdGkgZXZlbnRzXHJcbipOZWVkIHRvIGJlIGluc3RhbmNpYXRlIGluIGluaXQgb2YgeW91ciBnYW1lLlxyXG5cclxuKkhPVyBUTyBCSU5EIEEgRVZFTlQgVE8gQSBJTlBVVDpcclxuKiAgIEFkZCBpbiB5b3VyIGFycmF5IGtleUJpbmQgbGlrZSBUaGF0IDogIHZhciBrZXlCaW5kID0geyBLZXlOdW1iZXJPZklucHV0IDogIHsgZXZlbnRUb0NhbGwgOiBmdW5jdGlvblRvQWN0aXZlKCkgfSB9XHJcbiAgICBcclxuXHJcbipIT1cgVE8gSU5TVEFOVElBVEUgRWFzeUlucHV0IDogXHJcbiAgICBcclxuICAgICogdmFyIHdoYXRZb3VXYW50ID0gbmV3IEVhc3lJbnB1dChmaXJzdCkgQXJndW1lbnQgOiAtLT4gZmlyc3QgOiBvYmplY3Qgb2Yga2V5QmluZGluZyx3aXRoIGV2ZW50IGFuZCBmdW5jdGlvbnMgY2FsbC5cclxuXHJcbiAgICBcclxuXHJcbipNZXRob2RlcyBvZiBFYXN5SW5wdXQgOiBcclxuKiAgIGFkZEV2ZW50KGZpcnN0LHNlY29uZCkgMiBwYXJhbXMgbmVjZXNzYXJ5ICAgIC0tPiBmaXJzdCA6IHN0cmluZyBvZiB0aGUgZXZlbnQgd2hvIHdpbGwgYmUgYWRkIChrZXlkb3duLGtleXVwLG1vdXNlbW92ZSBldGMuLi4pOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tPiBzZWNvbmQgOiBkb20gb2JqZWN0IGxpa2Ugd2luZG93IG9yIGEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5IG9mIHdoYXQgeW91IHdhbnQ7XHJcbiAgICB1c2UgOiBmb3IgYWRkIGV2ZW50IGxpc3Rlbm5lciBvbiBvYmplY3Q7XHJcbiogICByZW1vdmVFdmVudChmaXJzdCxzZWNvbmQpIDIgcGFyYW1zIG5lY2Vzc2FyeSAtLT4gZmlyc3QgOiBzdHJpbmcgb2YgdGhlIGV2ZW50IHdobyB3aWxsIGJlIHJlbW92ZSAoa2V5ZG93bixrZXl1cCxtb3VzZW1vdmUgZXRjLi4uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tPiBzZWNvbmQgOiBkb20gb2JqZWN0IHdobyBoYWQgZXZlbnQgbGlzdGVubmVyO1xyXG4gICAgdXNlIDogZm9yIHJlbW92ZSBldmVudCBsaXN0ZW5uZXIgb2YgYW4gb2JqZWN0O1xyXG4qICAgc2V0S2V5QmluZChmaXJzdCxzZWNvbmQpIDIgcGFyYW1zIG5lY2Vzc2FyeSAgLS0+IGZpcnN0IDogaW50ZWdlciBvZiB0aGUga2V5IHlvdSB3YW50IHRvIGJpbmQgd2l0aCBldmVudChzKS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0+IHNlY29uZCA6IG9iamVjdCBvZiBldmVudChzKSB5b3Ugd2FudCB0byB1c2UgYW5kIGZ1bmN0aW9uIGNhbGwgYnkgdGhpcyBldmVudDoge2tleXByZXNzIDogZnVuY3Rpb24oKXt9LCBrZXlkb3duIDogZnVuY3Rpb25XaG9Eb1NvbWV0aGluZyB9O1xyXG4gICAgdXNlIDogZm9yIGFkZCBvciBlZGl0IG9uZSBrZXkgd2l0aCBldmVudChzKTsgICAgXHJcblxyXG4qICAgZ2V0S2V5c0JpbmQoKSBcclxuICAgIHVzZSA6IHJldHVybiB5b3Ugb2JqZWN0IHdobyBjb250YWluIGFsbCBrZXlzIGJpbmRpbmcgYW5kIGFsbCBldmVudHMgY2FsbCBmb3IgdGhvc2Uga2V5cy5cclxuKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEVhc3lJbnB1dCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdmFyIGtleSA9IHt9O1xyXG4gICAgdmFyIGdhbWVQYWREaWN0aW9ubmFyeSA9IHsgXHJcbiAgICAgICAgICAgIGJ1dHRvbnM6ezA6XCJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgMTpcImJcIixcclxuICAgICAgICAgICAgICAgICAgICAyOlwieFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIDM6XCJ5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgNDpcImxiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgNTpcInJiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgNjpcImx0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgNzpcInJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgODpcInNlbGVjdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIDk6XCJzdGFydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIDEwOlwibGVmdFN0aWNrUHJlc3NcIixcclxuICAgICAgICAgICAgICAgICAgICAxMTpcInJpZ2h0U3RpY2tQcmVzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIDEyOlwiZC1wYWQgdG9wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgMTM6XCJkLXBhZCBib3R0b21cIixcclxuICAgICAgICAgICAgICAgICAgICAxNDpcImQtcGFkIGxlZnRcIixcclxuICAgICAgICAgICAgICAgICAgICAxNTpcImQtcGFkIHJpZ2h0XCJ9LFxyXG4gICAgICAgICAgICBheGVzOnsgMDogXCJzdGljay1sZWZ0LXhcIixcclxuICAgICAgICAgICAgICAgIDE6IFwic3RpY2stbGVmdC15XCIsXHJcbiAgICAgICAgICAgICAgICAyOiBcInN0aWNrLXJpZ2h0LXhcIixcclxuICAgICAgICAgICAgICAgIDM6IFwic3RpY2stcmlnaHQteVwifVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB2YXIgRGljdG9ubmFyeUtleSA9ICB7XHJcbiAgICAgICAgMDogXCJcXFxcXCIsXHJcbiAgICAgICAgODogXCJiYWNrc3BhY2VcIixcclxuICAgICAgICA5OiBcInRhYlwiLFxyXG4gICAgICAgIDEyOiBcIm51bVwiLFxyXG4gICAgICAgIDEzOiBcImVudGVyXCIsXHJcbiAgICAgICAgMTY6IFwic2hpZnRcIixcclxuICAgICAgICAxNzogXCJjdHJsXCIsXHJcbiAgICAgICAgMTg6IFwiYWx0XCIsXHJcbiAgICAgICAgMTk6IFwicGF1c2VcIixcclxuICAgICAgICAyMDogXCJjYXBzXCIsXHJcbiAgICAgICAgMjc6IFwiZXNjXCIsXHJcbiAgICAgICAgMzI6IFwic3BhY2VcIixcclxuICAgICAgICAzMzogXCJwYWdldXBcIixcclxuICAgICAgICAzNDogXCJwYWdlZG93blwiLFxyXG4gICAgICAgIDM1OiBcImVuZFwiLFxyXG4gICAgICAgIDM2OiBcImhvbWVcIixcclxuICAgICAgICAzNzogXCJsZWZ0XCIsXHJcbiAgICAgICAgMzg6IFwidXBcIixcclxuICAgICAgICAzOTogXCJyaWdodFwiLFxyXG4gICAgICAgIDQwOiBcImRvd25cIixcclxuICAgICAgICA0NDogXCJwcmludFwiLFxyXG4gICAgICAgIDQ1OiBcImluc2VydFwiLFxyXG4gICAgICAgIDQ2OiBcImRlbGV0ZVwiLFxyXG4gICAgICAgIDQ4OiBcIjBcIixcclxuICAgICAgICA0OTogXCIxXCIsXHJcbiAgICAgICAgNTA6IFwiMlwiLFxyXG4gICAgICAgIDUxOiBcIjNcIixcclxuICAgICAgICA1MjogXCI0XCIsXHJcbiAgICAgICAgNTM6IFwiNVwiLFxyXG4gICAgICAgIDU0OiBcIjZcIixcclxuICAgICAgICA1NTogXCI3XCIsXHJcbiAgICAgICAgNTY6IFwiOFwiLFxyXG4gICAgICAgIDU3OiBcIjlcIixcclxuICAgICAgICA2NTogXCJhXCIsXHJcbiAgICAgICAgNjY6IFwiYlwiLFxyXG4gICAgICAgIDY3OiBcImNcIixcclxuICAgICAgICA2ODogXCJkXCIsXHJcbiAgICAgICAgNjk6IFwiZVwiLFxyXG4gICAgICAgIDcwOiBcImZcIixcclxuICAgICAgICA3MTogXCJnXCIsXHJcbiAgICAgICAgNzI6IFwiaFwiLFxyXG4gICAgICAgIDczOiBcImlcIixcclxuICAgICAgICA3NDogXCJqXCIsXHJcbiAgICAgICAgNzU6IFwia1wiLFxyXG4gICAgICAgIDc2OiBcImxcIixcclxuICAgICAgICA3NzogXCJtXCIsXHJcbiAgICAgICAgNzg6IFwiblwiLFxyXG4gICAgICAgIDc5OiBcIm9cIixcclxuICAgICAgICA4MDogXCJwXCIsXHJcbiAgICAgICAgODE6IFwicVwiLFxyXG4gICAgICAgIDgyOiBcInJcIixcclxuICAgICAgICA4MzogXCJzXCIsXHJcbiAgICAgICAgODQ6IFwidFwiLFxyXG4gICAgICAgIDg1OiBcInVcIixcclxuICAgICAgICA4NjogXCJ2XCIsXHJcbiAgICAgICAgODc6IFwid1wiLFxyXG4gICAgICAgIDg4OiBcInhcIixcclxuICAgICAgICA4OTogXCJ5XCIsXHJcbiAgICAgICAgOTA6IFwielwiLFxyXG4gICAgICAgIDkxOiBcImNtZFwiLFxyXG4gICAgICAgIDkyOiBcImNtZFwiLFxyXG4gICAgICAgIDkzOiBcImNtZFwiLFxyXG4gICAgICAgIDk2OiBcIm51bV8wXCIsXHJcbiAgICAgICAgOTc6IFwibnVtXzFcIixcclxuICAgICAgICA5ODogXCJudW1fMlwiLFxyXG4gICAgICAgIDk5OiBcIm51bV8zXCIsXHJcbiAgICAgICAgMTAwOiBcIm51bV80XCIsXHJcbiAgICAgICAgMTAxOiBcIm51bV81XCIsXHJcbiAgICAgICAgMTAyOiBcIm51bV82XCIsXHJcbiAgICAgICAgMTAzOiBcIm51bV83XCIsXHJcbiAgICAgICAgMTA0OiBcIm51bV84XCIsXHJcbiAgICAgICAgMTA1OiBcIm51bV85XCIsXHJcbiAgICAgICAgMTA2OiBcIm51bV9tdWx0aXBseVwiLFxyXG4gICAgICAgIDEwNzogXCJudW1fYWRkXCIsXHJcbiAgICAgICAgMTA4OiBcIm51bV9lbnRlclwiLFxyXG4gICAgICAgIDEwOTogXCJudW1fc3VidHJhY3RcIixcclxuICAgICAgICAxMTA6IFwibnVtX2RlY2ltYWxcIixcclxuICAgICAgICAxMTE6IFwibnVtX2RpdmlkZVwiLFxyXG4gICAgICAgIDEyNDogXCJwcmludFwiLFxyXG4gICAgICAgIDE0NDogXCJudW1cIixcclxuICAgICAgICAxNDU6IFwic2Nyb2xsXCIsXHJcbiAgICAgICAgMTg2OiBcIjtcIixcclxuICAgICAgICAxODc6IFwiPVwiLFxyXG4gICAgICAgIDE4ODogXCIsXCIsXHJcbiAgICAgICAgMTg5OiBcIi1cIixcclxuICAgICAgICAxOTA6IFwiLlwiLFxyXG4gICAgICAgIDE5MTogXCIvXCIsXHJcbiAgICAgICAgMTkyOiBcImBcIixcclxuICAgICAgICAyMTk6IFwiW1wiLFxyXG4gICAgICAgIDIyMDogXCJcXFxcXCIsXHJcbiAgICAgICAgMjIxOiBcIl1cIixcclxuICAgICAgICAyMjI6IFwiXFwnXCIsXHJcbiAgICAgICAgMjIzOiBcImBcIixcclxuICAgICAgICAyMjQ6IFwiY21kXCIsXHJcbiAgICAgICAgMjI1OiBcImFsdFwiLFxyXG4gICAgICAgIDU3MzkyOiBcImN0cmxcIixcclxuICAgICAgICA2MzI4OTogXCJudW1cIlxyXG4gICAgfTtcclxuICAgIEVhc3lJbnB1dC5wcm90b3R5cGUuYWRkRXZlbnQgPSBmdW5jdGlvbihpbnB1dCAsIHRhcmdldClcclxuICAgIHsgICBcclxuICAgICAgICBpZihpbnB1dCA9PT0gXCJnYW1lcGFkXCIgJiYgISFuYXZpZ2F0b3Iud2Via2l0R2V0R2FtZXBhZHMgKXtcclxuICAgICAgICAgICAgdGhpcy5zdGFydEdhbWVQYWRMb29wKHRhcmdldCk7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihpbnB1dCwgdGhpcy5mdW5jdGlvbkNhbGwsZmFsc2UpO1xyXG4gICAgfTtcclxuICAgIEVhc3lJbnB1dC5wcm90b3R5cGUuZnVuY3Rpb25DYWxsID0gZnVuY3Rpb24oZSlcclxuICAgIHtcclxuICAgICAgICBpZihrZXkuaGFzT3duUHJvcGVydHkoZS5rZXlDb2RlKSAmJiB0eXBlb2Yga2V5W2Uua2V5Q29kZV1bZS50eXBlXSA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICBrZXlbZS5rZXlDb2RlXVtlLnR5cGVdKGUpO1xyXG4gICAgfTtcclxuICAgIEVhc3lJbnB1dC5wcm90b3R5cGUucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbihpbnB1dCAsIHRhcmdldClcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihpbnB1dCx0aGlzLmZ1bmN0aW9uQ2FsbCxmYWxzZSk7XHJcbiAgICB9O1xyXG4gICAgRWFzeUlucHV0LnByb3RvdHlwZS5zZXRLZXlCaW5kID0gZnVuY3Rpb24oc3VibWl0dGVkS2V5ICwgb2JqZWN0KVxyXG4gICAge1xyXG4gICAgICAgIGlmKGtleS5oYXNPd25Qcm9wZXJ0eShzdWJtaXR0ZWRLZXkpID09PSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzdWJtaXR0ZWRLZXkgPT09J3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICB2YXIgc3VibWl0dGVkS2V5ID0gdGhpcy5maW5kSW5LZXkoc3VibWl0dGVkS2V5KTtcclxuXHJcbiAgICAgICAgICAgIGtleVtzdWJtaXR0ZWRLZXldID0gb2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGtleS5oYXNPd25Qcm9wZXJ0eShzdWJtaXR0ZWRLZXkpKVxyXG4gICAgICAgIHsgIFxyXG4gICAgICAgICAgICBpZih0eXBlb2Ygc3VibWl0dGVkS2V5ID09PSdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgdmFyIHN1Ym1pdHRlZEtleSA9IHRoaXMuZmluZEluS2V5KHN1Ym1pdHRlZEtleSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBvYmplY3QpXHJcbiAgICAgICAgICAgICAgICBrZXlbc3VibWl0dGVkS2V5XVtpbmRleF0gPSBvYmplY3RbaW5kZXhdOyBcclxuICAgICAgICB9IFxyXG4gICAgfTtcclxuICAgIEVhc3lJbnB1dC5wcm90b3R5cGUuZ2V0S2V5c0JpbmQgPSBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH07XHJcbiAgICBFYXN5SW5wdXQucHJvdG90eXBlLmZpbmRJbktleSA9IGZ1bmN0aW9uKHN1Ym1pdHRlZEtleSl7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZm9yKCBpIGluIERpY3Rvbm5hcnlLZXkpIHtcclxuICAgICAgICAgICAgaWYgKERpY3Rvbm5hcnlLZXlbaV0gPT09IHN1Ym1pdHRlZEtleSkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBpOyAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH07XHJcbiAgICBFYXN5SW5wdXQucHJvdG90eXBlLnN0YXJ0R2FtZVBhZExvb3AgPSBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGdhbWVQYWRGcmFtZUJlZm9yZSA9W107XHJcbiAgICAgICAgdmFyIGN1cnJlbnRHYW1lcGFkcyA9IFtdO1xyXG4gICAgICAgIHZhciBnYW1lcGFkcyA7XHJcblxyXG4gICAgICAgIHZhciBnYW1lcGFkTG9vcCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lcGFkcyA9IG5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wO2k8Z2FtZXBhZHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZ2FtZVBhZEZyYW1lQmVmb3JlLmxlbmd0aD09PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihnYW1lcGFkc1tpXSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVQYWRGcmFtZUJlZm9yZVtpXT10aGlzLmhhc2hDb2RlKEpTT04uc3RyaW5naWZ5KGdhbWVwYWRzW2ldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGdhbWVwYWRzW2ldIT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWVwYWRzW2ldPXRoaXMuaGFzaENvZGUoSlNPTi5zdHJpbmdpZnkoZ2FtZXBhZHNbaV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGN1cnJlbnRHYW1lcGFkc1tpXSE9PXVuZGVmaW5lZCYmZ2FtZVBhZEZyYW1lQmVmb3JlW2ldIT09Y3VycmVudEdhbWVwYWRzW2ldKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwxMDAwLzYwKVxyXG5cclxuICAgIH07XHJcbiAgICBFYXN5SW5wdXQucHJvdG90eXBlLmhhc2hDb2RlID0gZnVuY3Rpb24oc3RyaW5nKXtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgaGFzaCA9IDAsIGksIGNociwgbGVuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PSAwKSByZXR1cm4gaGFzaDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNociAgID0gdGhpcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hyO1xyXG4gICAgICAgICAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxyXG4gICAgICAgIH1cclxuICAgICAgcmV0dXJuIGhhc2g7XHJcbiAgICB9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWFzeUlucHV0O1xyXG4iLCJQdXBwZXRzID0gZnVuY3Rpb24gKGNvbmZpZylcclxue1xyXG4gICAgdGhpcy5BUlJBWSA9IFtdO1xyXG4gICAgdGhpcy5TeXN0ZW1zID1cclxuICAgIHtcclxuICAgICAgICBDT01QT05FTlRTIDogW10sXHJcbiAgICAgICAgb3JkZXIgOiBbXSxcclxuICAgICAgICBsaXN0IDoge30sXHJcbiAgICAgICAgcnVucyA6IDAsXHJcblxyXG4gICAgICAgIGxhdW5jaFN5c3RlbXMgOiBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbmJDb2xsZWN0aW9ucyA9IFB1cHBldHMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBwdXBweSwgcHVwcG8sIGk7XHJcbiAgICAgICAgICAgIHZhciBzeXN0ZW0sIGlkO1xyXG4gICAgICAgICAgICB2YXIgb3JkZXJMZW5ndGggPSB0aGlzLm9yZGVyLmxlbmd0aDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihwdXBweSA9IDA7IHB1cHB5IDwgbmJDb2xsZWN0aW9uczsgcHVwcHkrPTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0gUHVwcGV0cy5FbnRpdGllcy5vcmRlckNvbGxlY3Rpb25zW3B1cHB5XTtcclxuICAgICAgICAgICAgICAgIGZvcihwdXBwbyBpbiBQdXBwZXRzLkVudGl0aWVzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gUHVwcGV0cy5FbnRpdGllcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXVtwdXBwb107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgb3JkZXJMZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgc3lzdGVtID0gdGhpcy5saXN0W3RoaXMub3JkZXJbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHN5c3RlbSAhPT0gdW5kZWZpbmVkICYmIChzeXN0ZW0uZGVsYXkgPT09IHVuZGVmaW5lZCB8fCBzeXN0ZW0uZGVsYXkgPT09IG51bGwgfHwgdGhpcy5ydW5zICUgc3lzdGVtLmRlbGF5ID09PSAwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGxTeXN0ZW0oaWQsIHN5c3RlbS5jb21wb25lbnRzLCBzeXN0ZW0ubWV0aG9kLCBzeXN0ZW0uZGF0YSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJ1bnMrKztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbGxTeXN0ZW0gOiBmdW5jdGlvbihpZCwgbGlzdE9mQ29tcG9uZW50cywgbWV0aG9kLCBkYXRhKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBlbnRpdHkgPSBQdXBwZXRzLkVudGl0aWVzLmxpc3RbaWRdO1xyXG4gICAgICAgICAgICB2YXIgY29tcG9uZW50cyA9IHRoaXMuQ09NUE9ORU5UUztcclxuICAgICAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnQ7XHJcbiAgICAgICAgICAgIGlmKGVudGl0eSAhPT0gbnVsbCAmJiBlbnRpdHkgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbGlzdE9mQ29tcG9uZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSBsaXN0T2ZDb21wb25lbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVudGl0eVtjb21wb25lbnRdID09PSBudWxsIHx8IGVudGl0eVtjb21wb25lbnRdID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgICAgICAgICAgUHVwcGV0cy5Db21wb25lbnRzLmxpc3Q9PT0gbnVsbCB8fCBQdXBwZXRzLkNvbXBvbmVudHMubGlzdCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICFQdXBwZXRzLkNvbXBvbmVudHMubGlzdFtjb21wb25lbnRdW2VudGl0eVtjb21wb25lbnRdXS5lbmFibGVkKSBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NUE9ORU5UUy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLnB1c2goUHVwcGV0cy5Db21wb25lbnRzLmxpc3RbY29tcG9uZW50XVtlbnRpdHlbY29tcG9uZW50XV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGlkKTtcclxuICAgICAgICAgICAgICAgIG1ldGhvZC5hcHBseShkYXRhLCBjb21wb25lbnRzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ09NUE9ORU5UUy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2FkIDogZnVuY3Rpb24obmFtZSwgbWV0aG9kLCBkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5saXN0W25hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5saXN0W25hbWVdICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTmFtZSBcIituYW1lK1wiIG92ZXJyaWRlZCBieSBzeXN0ZW0gXCIrbWV0aG9kKTtcclxuICAgICAgICAgICAgaWYoZGF0YSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBjb25zb2xlLmVycm9yKFwiZGF0YSBhcmd1bWVudCBjYW4gbm90IGJlIHVuZGVmaW5lZFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5saXN0W25hbWVdID0geyBjb21wb25lbnRzIDogZGF0YS5jb21wb25lbnRzLCBtZXRob2QgOiBtZXRob2QgLCBkZWxheSA6IGRhdGEuZGVsYXksIGRhdGEgOiBkYXRhfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbmRleFN5c3RlbSA9IHRoaXMub3JkZXIuaW5kZXhPZihuYW1lKTtcclxuICAgICAgICAgICAgaWYoaW5kZXhTeXN0ZW0gPj0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMub3JkZXIuc3BsaWNlKGluZGV4U3lzdGVtLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZihkYXRhLnBvc2l0aW9uKSA9PT0gJ251bWJlcicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yZGVyLnNwbGljZShkYXRhLnBvc2l0aW9uLCAwLCBuYW1lKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmRlci5wdXNoKG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLkVudGl0aWVzID1cclxuICAgIHtcclxuICAgICAgICBtb2RlbHMgOiB7fSxcclxuICAgICAgICBsaXN0IDoge30sXHJcbiAgICAgICAgY29sbGVjdGlvbnMgOiB7fSxcclxuICAgICAgICBvcmRlckNvbGxlY3Rpb25zIDogW10sXHJcbiAgICAgICAgbGVuZ3RoIDogMCxcclxuXHJcbiAgICAgICAgY291bnQgOiBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBlbnRpdHkgaW4gdGhpcy5saXN0KSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGlzdC5oYXNPd25Qcm9wZXJ0eShlbnRpdHkpKSBcclxuICAgICAgICAgICAgICAgICAgICsrY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3JlYXRlRW50aXR5IDogZnVuY3Rpb24obW9kZWwsIGNvbnN0cnVjdG9yLCBjb2xsZWN0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5tb2RlbHNbbW9kZWxdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkVudGl0eSBcIittb2RlbCtcIiBkb2Vzbid0IGV4aXN0IGluIFB1cHBldCwgeW91IGhhdmUgdG8gbG9hZCBpdFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtb2RlbCA9IHRoaXMubW9kZWxzW21vZGVsXTtcclxuICAgICAgICAgICAgdmFyIGVudGl0eSA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgYXJndW1lbnQgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGxlbmd0aENvbXBvbmVudHMgPSBtb2RlbC5jb21wb25lbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGksIG8sIGlkO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoQ29tcG9uZW50czsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgbW9kZWwuY29tcG9uZW50c1tpXSA9PT0gXCJvYmplY3RcIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50ID0gT2JqZWN0LmtleXMobW9kZWwuY29tcG9uZW50c1tpXSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKGNvbnN0cnVjdG9yW2NvbXBvbmVudF0pICE9PSAnb2JqZWN0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3JbY29tcG9uZW50XSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKG8gaW4gbW9kZWwuY29tcG9uZW50c1tpXVtjb21wb25lbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29uc3RydWN0b3JbY29tcG9uZW50XVtvXSAhPT0gdW5kZWZpbmVkICYmIGNvbnN0cnVjdG9yW2NvbXBvbmVudF1bb10gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5jb21wb25lbnRzW2ldW2NvbXBvbmVudF1bb10gPSBjb25zdHJ1Y3Rvcltjb21wb25lbnRdW29dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvcltjb21wb25lbnRdW29dID0gbW9kZWwuY29tcG9uZW50c1tpXVtjb21wb25lbnRdW29dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSBtb2RlbC5jb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGNvbnN0cnVjdG9yW2NvbXBvbmVudF0gIT09IHVuZGVmaW5lZCAmJiBjb25zdHJ1Y3Rvcltjb21wb25lbnRdICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gUHVwcGV0cy5Db21wb25lbnRzLmFkZENvbXBvbmVudCh0aGlzLmxlbmd0aCwgY29tcG9uZW50LCBjb25zdHJ1Y3Rvcltjb21wb25lbnRdLCBjb25zdHJ1Y3Rvcltjb21wb25lbnRdLmVuYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gUHVwcGV0cy5Db21wb25lbnRzLmFkZENvbXBvbmVudCh0aGlzLmxlbmd0aCwgY29tcG9uZW50LCBjb25zdHJ1Y3Rvcltjb21wb25lbnRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdHlbY29tcG9uZW50XSA9IGlkO1xyXG4gICAgICAgICAgICAgICAgYXJndW1lbnRbY29tcG9uZW50XSA9IFB1cHBldHMuQ29tcG9uZW50cy5saXN0W2NvbXBvbmVudF1baWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdFtpZF0gPSBlbnRpdHk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXVtpZF0gPSBcIlwiK2lkK1wiXCI7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbnMud29ybGRbaWRdID0gXCJcIitpZCtcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoLTE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRDb21wb25lbnQgOiBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudCwgc2V0dGluZ3MsIGVuYWJsZWQsIHVuZGVmaW5lZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGVudGl0eSkpXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkgPSBbZW50aXR5XTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBpZDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgcHVwcHkgPSAwOyBwdXBweSA8IGVudGl0eS5sZW5ndGg7IHB1cHB5KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmxpc3RbZW50aXR5W3B1cHB5XV0uaGFzT3duUHJvcGVydHkoY29tcG9uZW50KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IFB1cHBldHMuQ29tcG9uZW50cy5hZGRDb21wb25lbnQoZW50aXR5W3B1cHB5XSwgY29tcG9uZW50LCBzZXR0aW5ncywgZW5hYmxlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0W2VudGl0eVtwdXBweV1dW2NvbXBvbmVudF0gPSBpZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVDb21wb25lbnQgOiBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudCwgdW5kZWZpbmVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkoZW50aXR5KSlcclxuICAgICAgICAgICAgICAgIGVudGl0eSA9IFtlbnRpdHldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGlkO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciBwdXBweSA9IDA7IHB1cHB5IDwgZW50aXR5Lmxlbmd0aDsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5saXN0W2VudGl0eVtwdXBweV1dLmhhc093blByb3BlcnR5KGNvbXBvbmVudCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLmxpc3RbZW50aXR5W3B1cHB5XV1bY29tcG9uZW50XTtcclxuICAgICAgICAgICAgICAgICAgICBQdXBwZXRzLkNvbXBvbmVudHMucmVtb3ZlQ29tcG9uZW50KGlkLCBjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RbZW50aXR5W3B1cHB5XV1bY29tcG9uZW50XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlRW50aXR5IDogZnVuY3Rpb24oZW50aXR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGVudGl0eSA9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gZW50aXR5LnNwbGl0KCcuJyk7XHJcblxyXG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShlbnRpdHkpKVxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gW2VudGl0eV07XHJcblxyXG4gICAgICAgICAgICB2YXIgbmIgPSBlbnRpdHkubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgcHVwcHk7XHJcbiAgICAgICAgICAgIHZhciBlLCBwdXBwbztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihwdXBweSA9IDA7IHB1cHB5IDwgbmI7IHB1cHB5KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGUgPSBlbnRpdHlbcHVwcHldO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5saXN0W2VdICE9PSBudWxsICYmIHRoaXMubGlzdFtlXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihwdXBwbyBpbiB0aGlzLmNvbGxlY3Rpb25zKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jb2xsZWN0aW9uc1twdXBwb11bZV0gIT09IG51bGwgJiYgdGhpcy5jb2xsZWN0aW9uc1twdXBwb11bZV0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29sbGVjdGlvbnNbcHVwcG9dW2VdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMubGlzdFtlXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3dpdGNoQ29sbGVjdGlvbiA6IGZ1bmN0aW9uKGVudGl0eSwgY29sbGVjdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbnNdICE9PSBudWxsICYmIHRoaXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbnNdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGVudGl0eSkpXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkgPSBbZW50aXR5XTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIHB1cHB5O1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdmVFbnRpdHksIHB1cHBvO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IocHVwcHkgPSAwOyBwdXBweSA8IGVudGl0eS5sZW5ndGg7IHB1cHB5KyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGVudGl0eVtwdXBweV0gPT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUVudGl0eSA9IFwiXCIrZW50aXR5W3B1cHB5XStcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUVudGl0eSA9IGVudGl0eVtwdXBweV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihwdXBwbyBpbiB0aGlzLmNvbGxlY3Rpb25zKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jb2xsZWN0aW9uc1twdXBwb10uaW5kZXhPZihtb3ZlRW50aXR5KSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5jb2xsZWN0aW9uc1twdXBwb11bbW92ZUVudGl0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dW21vdmVFbnRpdHldID0gbW92ZUVudGl0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvcHkgOiBmdW5jdGlvbihlbnRpdHksIG51bWJlciwgY29sbGVjdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGVudGl0eSA9IGFycmF5emF0aW9uKGVudGl0eSk7XHJcbiAgICAgICAgICAgIHZhciBuYiA9IGVudGl0eS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBpZih0eXBlb2YgbnVtYmVyICE9PSBcIm51bWJlclwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGNvbGxlY3Rpb24gPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgY29sbGVjdGlvbiAhPT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBcIndvcmxkXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIHB1cHB5ID0gMDsgcHVwcHkgPCBuYjsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvcHkgPSBlbnRpdHlbcHVwcHldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHB1cHBvLCBwdXBwYTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdDb3B5LCBjb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5saXN0W2NvcHldICE9PSB1bmRlZmluZWQgJiYgdGhpcy5saXN0W2NvcHldICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihwdXBwbyA9IDA7IHB1cHBvIDwgbnVtYmVyOyBwdXBwbysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5saXN0W2NvcHldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihwdXBwYSBpbiBuZXdDb3B5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvciA9IFB1cHBldHMuQ29tcG9uZW50cy5saXN0W3B1cHBhXVtuZXdDb3B5W3B1cHBhXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDb3B5W3B1cHBhXSA9IFB1cHBldHMuQ29tcG9uZW50cy5hZGRDb21wb25lbnQoY29weSwgcHVwcGEsIGNvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RbdGhpcy5sZW5ndGhdID0gbmV3Q29weTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpbmQgOiBmdW5jdGlvbihjbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2x1ZSA9IHRoaXMuX2FuYWx5c2VTdHJpbmcoY2x1ZSk7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcy5saXN0O1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgY2x1ZSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIHB1cHB5IGluIGxpc3QpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGlzdFtwdXBweV0uaGFzT3duUHJvcGVydHkoY2x1ZS5jbHVlKSAmJiBGdW5jdGlvbihcIm9iamVjdFwiLCBjbHVlLmNvbXBhcmUpKFB1cHBldHMuQ29tcG9uZW50cy5saXN0W2NsdWUuY2x1ZV1bbGlzdFtwdXBweV1bY2x1ZS5jbHVlXV0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocHVwcHkpOyAgICBcclxuICAgICAgICAgICAgICAgIH0gICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIHB1cHB5IGluIGxpc3QpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGlzdFtwdXBweV0uaGFzT3duUHJvcGVydHkoY2x1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChwdXBweSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfYW5hbHlzZVN0cmluZyA6IGZ1bmN0aW9uKGNsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjbHVlID0gY2x1ZS5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgICAgIGlmKGNsdWUubGVuZ3RoIDw9IDEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2x1ZVswXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7Y2x1ZSA6IGNsdWVbMF0sIGNvbXBhcmUgOiBcImlmKG9iamVjdC5cIitjbHVlWzFdK1wiKXtyZXR1cm4gdHJ1ZTt9ZWxzZXtyZXR1cm4gZmFsc2V9XCJ9O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldENvbXBvbmVudHMgOiBmdW5jdGlvbihlbnRpdHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShlbnRpdHkpKVxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gW2VudGl0eV07XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIHZhciBwdXBweSwgcHVwcG87XHJcbiAgICAgICAgICAgIHZhciByZWZDb21wLCByZXN1bHQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IocHVwcHkgPSAwOyBwdXBweSA8IGVudGl0eS5sZW5ndGg7IHB1cHB5KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcmVmQ29tcCA9IHRoaXMubGlzdFtlbnRpdHlbcHVwcHldXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihyZWZDb21wICE9PSB1bmRlZmluZWQgJiYgcmVmQ29tcCAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IocHVwcG8gaW4gcmVmQ29tcClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3B1cHBvXSA9IFB1cHBldHMuQ29tcG9uZW50cy5saXN0W3B1cHBvXVtyZWZDb21wW3B1cHBvXV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtwdXBweV0gPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXJnZSA6IGZ1bmN0aW9uKGNyZWF0ZU5ldywgcGFyYW1zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA8IDQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZihwYXJhbXMgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMgPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbnRpdGllc1RvTWVyZ2UgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHB1cHB5LCBwdXBwbztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihwdXBweSA9IDI7IHB1cHB5IDwgYXJndW1lbnRzLmxlbmd0aDsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhcmd1bWVudHNbcHVwcHldKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IocHVwcG8gPSAwOyBwdXBwbyA8IGFyZ3VtZW50c1twdXBweV0ubGVuZ3RoOyBwdXBwbysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGFyZ3VtZW50c1twdXBweV1bcHVwcG9dID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGFyZ3VtZW50c1twdXBweV1bcHVwcG9dID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdGllc1RvTWVyZ2UucHVzaChhcmd1bWVudHNbcHVwcHldW3B1cHBvXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0eXBlb2YgYXJndW1lbnRzW3B1cHB5XSA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBhcmd1bWVudHNbcHVwcHldID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXRpZXNUb01lcmdlLnB1c2goYXJndW1lbnRzW3B1cHB5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50aXRpZXNUb01lcmdlID0gdGhpcy5nZXRDb21wb25lbnRzKGVudGl0aWVzVG9NZXJnZSk7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9hZCA6IGZ1bmN0aW9uKG5hbWUsIGNvbnN0cnVjdG9yKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5tb2RlbHNbbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLm1vZGVsc1tuYW1lXSAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5hbWUgXCIrbmFtZStcIiBvdmVycmlkZWQgYnkgZW50aXR5IFwiK2NvbnN0cnVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWxzW25hbWVdID0ge2NvbXBvbmVudHMgOiBjb25zdHJ1Y3Rvci5jb21wb25lbnRzLCBkYXRhIDogY29uc3RydWN0b3IuZGF0YSB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLkNvbXBvbmVudHMgPVxyXG4gICAge1xyXG4gICAgICAgIG1vZGVscyA6IHt9LFxyXG4gICAgICAgIGxpc3QgOiB7fSxcclxuICAgICAgICBsZW5ndGggOiB7fSxcclxuXHJcbiAgICAgICAgY291bnQgOiBmdW5jdGlvbihjb21wb25lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBlbGVtZW50IGluIHRoaXMubGlzdFtjb21wb25lbnRdKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGlzdFtjb21wb25lbnRdLmhhc093blByb3BlcnR5KGVsZW1lbnQpKSBcclxuICAgICAgICAgICAgICAgICAgICsrY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkQ29tcG9uZW50IDogZnVuY3Rpb24oZW50aXR5LCBjb21wb25lbnQsIGNvbnN0cnVjdG9yLCBlbmFibGVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5saXN0W2NvbXBvbmVudF0gPT09IG51bGwgfHwgdGhpcy5saXN0W2NvbXBvbmVudF0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0W2NvbXBvbmVudF0gPSB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoW2NvbXBvbmVudF0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmxlbmd0aFtjb21wb25lbnRdO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RbY29tcG9uZW50XVtpZF0gPSB0aGlzLm1vZGVsc1tjb21wb25lbnRdLmNvbnN0cnVjdG9yKGNvbnN0cnVjdG9yIHx8IHt9LCBlbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgaWYoZW5hYmxlZCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0W2NvbXBvbmVudF1baWRdLmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RbY29tcG9uZW50XVtpZF0uZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aFtjb21wb25lbnRdKys7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVDb21wb25lbnQgOiBmdW5jdGlvbihpZCwgY29tcG9uZW50LCB1bmRlZmluZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmxpc3RbY29tcG9uZW50XVtpZF0gIT09IG51bGwgJiYgdGhpcy5saXN0W2NvbXBvbmVudF1baWRdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RbY29tcG9uZW50XVtpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvYWQgOiBmdW5jdGlvbihuYW1lLCBjb25zdHJ1Y3RvciwgZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMubW9kZWxzW25hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5tb2RlbHNbbmFtZV0gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJOYW1lIFwiK25hbWUrXCIgb3ZlcnJpZGVkIGJ5IGNvbXBvbmVudCBcIisgY29uc3RydWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RlbHNbbmFtZV0gPSB7Y29uc3RydWN0b3IgOiBjb25zdHJ1Y3RvciwgZGF0YSA6IGRhdGEgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbiAgICB2YXIgYXJyYXl6YXRpb24gPSBmdW5jdGlvbih2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICBpZighQXJyYXkuaXNBcnJheSh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW3ZhbHVlXTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbihzZWxmKVxyXG4gICAge1xyXG4gICAgICAgIHdpbmRvdy5QdXBwZXRzID0gc2VsZjtcclxuICAgICAgICBpZih0eXBlb2YoY29uZmlnKSA9PT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgc2VsZi5sb2FkKGNvbmZpZyk7XHJcblxyXG4gICAgICAgIGlmKHNlbGYuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5pbmRleE9mKFwid29ybGRcIikgPCAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5FbnRpdGllcy5jb2xsZWN0aW9ucy53b3JsZCA9IHt9O1xyXG4gICAgICAgICAgICBzZWxmLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnMucHVzaChcIndvcmxkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0odGhpcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblB1cHBldHMucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5TeXN0ZW1zLmxhdW5jaFN5c3RlbXMoKTtcclxufTtcclxuXHJcblB1cHBldHMucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihjbHVlLCBhcGxhbmUpXHJcbntcclxuICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICBpZihhcGxhbmUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICBhcGxhbmUgPSB0cnVlO1xyXG4gICAgXHJcbiAgICBjbHVlID0gY2x1ZS5zcGxpdCgnLCcpO1xyXG5cclxuICAgIHZhciBuYiA9IGNsdWUubGVuZ3RoO1xyXG4gICAgdmFyIHB1cHB5LCBwdXBwbztcclxuICAgIFxyXG4gICAgZm9yKHB1cHB5ID0gMDsgcHVwcHkgPCBuYjsgcHVwcHkrKylcclxuICAgIHtcclxuICAgICAgICBpZihjbHVlW3B1cHB5XS5zbGljZSgwLCAxKSA9PSBcIi5cIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLkVudGl0aWVzLmNvbGxlY3Rpb25zW2NsdWVbcHVwcHldLnNsaWNlKDEpXSk7XHJcbiAgICAgICAgICAgIHZhciB0bXAgPSBbXTtcclxuICAgICAgICAgICAgZm9yKHB1cHBvIGluIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGgtMV0pXHJcbiAgICAgICAgICAgICAgICB0bXAucHVzaChyZXN1bHRzW3Jlc3VsdHMubGVuZ3RoLTFdW3B1cHBvXSk7XHJcblxyXG4gICAgICAgICAgICByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoLTFdID0gdG1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLkVudGl0aWVzLmZpbmQoY2x1ZVtwdXBweV0pKTtcclxuICAgIH1cclxuXHJcbiAgICBpZihhcGxhbmUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHRtcCA9IFtdO1xyXG4gICAgICAgIHZhciBhcnJheTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IocHVwcHkgPSAwOyBwdXBweSA8IHJlc3VsdHMubGVuZ3RoOyBwdXBweSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYXJyYXkgPSByZXN1bHRzW3B1cHB5XTtcclxuICAgICAgICAgICAgZm9yKHB1cHBvID0gMDsgcHVwcG8gPCBhcnJheS5sZW5ndGg7IHB1cHBvKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHRtcC5pbmRleE9mKGFycmF5W3B1cHBvXSkgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRtcC5wdXNoKGFycmF5W3B1cHBvXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0cyA9IHRtcDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxufTtcclxuXHJcblB1cHBldHMucHJvdG90eXBlLnJlbW92ZUVudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSlcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMucmVtb3ZlRW50aXR5KGVudGl0eSk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLnJlbW92ZUNvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50KVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5FbnRpdGllcy5yZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnQpO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5hZGRDb21wb25lbnQgPSBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudCwgc2V0dGluZ3MsIGVuYWJsZWQsIHVuZGVmaW5lZClcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMuYWRkQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50LCBzZXR0aW5ncywgZW5hYmxlZCk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmNyZWF0ZUVudGl0eSA9IGZ1bmN0aW9uKG1vZGVsLCBjb25zdHJ1Y3RvciwgY29sbGVjdGlvbilcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMuY3JlYXRlRW50aXR5KG1vZGVsLCBjb25zdHJ1Y3RvciwgY29sbGVjdGlvbik7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmdldENvbXBvbmVudHMgPSBmdW5jdGlvbihlbnRpdHkpXHJcbntcclxuICAgIHJldHVybiB0aGlzLkVudGl0aWVzLmdldENvbXBvbmVudHMoZW50aXR5KTtcclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUuc3dpdGNoQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGVudGl0eSwgY29sbGVjdGlvbilcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMuc3dpdGNoQ29sbGVjdGlvbihlbnRpdHksIGNvbGxlY3Rpb24pO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24oZW50aXR5LCBudW1iZXIsIGNvbGxlY3Rpb24pXHJcbntcclxuICAgIHJldHVybiB0aGlzLkVudGl0aWVzLmNvcHkoZW50aXR5LCBudW1iZXIsIGNvbGxlY3Rpb24pO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24oZmlsZSwgc3VjY2VzcywgZXJyb3IpXHJcbntcclxuICAgIHZhciByZXF1ZXN0ID1uZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlLCBmYWxzZSk7XHJcbiAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIGlmKHJlcXVlc3QucmVzcG9uc2UgPT09IFwiXCIpXHJcbiAgICB7XHJcbiAgICAgICAgaWYodHlwZW9mKGVycm9yKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgZXJyb3IocmVxdWVzdC5yZXNwb25zZSk7XHJcblxyXG4gICAgICAgIHRocm93IGNvbnNvbGUud2FybihcIkFuIGVycm9yIG9jY3VyZWQgbG9hZGluZyBcIitmaWxlKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZih0eXBlb2Yoc3VjY2VzcykgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBzdWNjZXNzKHJlcXVlc3QucmVzcG9uc2UpO1xyXG5cclxuICAgIHZhciBtb2R1bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIG1vZHVsZS5pbm5lckhUTUwgPSByZXF1ZXN0LnJlc3BvbnNlO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2R1bGUpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChtb2R1bGUpO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5lbnRpdHkgPSBmdW5jdGlvbihuYW1lLCBkYXRhKXtcclxuICAgIHJldHVybiB0aGlzLkVudGl0aWVzLmxvYWQobmFtZSwgZGF0YSk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmNvbXBvbmVudCA9IGZ1bmN0aW9uKG5hbWUsIG1ldGhvZCwgZGF0YSl7XHJcbiAgICByZXR1cm4gdGhpcy5Db21wb25lbnRzLmxvYWQobmFtZSwgbWV0aG9kLCBkYXRhKTtcclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUuc3lzdGVtID0gZnVuY3Rpb24obmFtZSwgbWV0aG9kLCBkYXRhKXtcclxuICAgIHJldHVybiB0aGlzLlN5c3RlbXMubG9hZChuYW1lLCBtZXRob2QsIGRhdGEpO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5jb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgcG9zaXRpb24pe1xyXG4gICAgaWYoQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnMgPSBjb2xsZWN0aW9uO1xyXG4gICAgICAgIGZvcih2YXIgcHVwcHkgPSAwOyBwdXBweSA8IGNvbGxlY3Rpb24ubGVuZ3RoOyBwdXBweSs9MSlcclxuICAgICAgICAgICAgdGhpcy5FbnRpdGllcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uW3B1cHB5XV0gPSB7fTtcclxuXHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiU2V0IG5ldyBjb2xsZWN0aW9uIGxpc3QgOiBcIitjb2xsZWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYodHlwZW9mKGNvbGxlY3Rpb24pID09PSBcInN0cmluZ1wiKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBpbmRleENvbGxlY3Rpb24gPSB0aGlzLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnMuaW5kZXhPZihjb2xsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYoaW5kZXhDb2xsZWN0aW9uID49IDApXHJcbiAgICAgICAgICAgIHRoaXMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5zcGxpY2UoaW5kZXhDb2xsZWN0aW9uLCAxKTtcclxuXHJcbiAgICAgICAgaWYodHlwZW9mKHBvc2l0aW9uKSAhPT0gXCJudW1iZXJcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5wdXNoKGNvbGxlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5FbnRpdGllcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ29sbGVjdGlvbiBcIitjb2xsZWN0aW9uK1wiIG92ZXJyaWRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnMuc3BsaWNlKHBvc2l0aW9uLCAwLCBjb2xsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5FbnRpdGllcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXSA9IHt9O1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcIkNhbiBub3Qgc2V0IGNvbGxlY3Rpb24gOiBcIitjb2xsZWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLnN5c3RlbUxpc3QgPSBmdW5jdGlvbihsaXN0KVxyXG57XHJcbiAgICBpZihBcnJheS5pc0FycmF5KGxpc3QpKVxyXG4gICAgICAgIHRoaXMuU3lzdGVtcy5vcmRlciA9IGxpc3Q7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuU3lzdGVtcy5vcmRlcjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IFB1cHBldHMoKTtcclxuIiwiXG52YXIgcmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuICAgIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgfHxcbiAgICAgICAgZnVuY3Rpb24oIGNhbGxiYWNrICl7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdEFuaW1GcmFtZTsiLCIvLyByZXF1aXJlIE9mIGFsbCBmaWxlcyBOZWVkZWRcbnZhciBQdXBwZXRzICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vbGlicy9wdXBwZXRzXCIpO1xudmFyIEVhc3lJbnB1dHMgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9saWJzL0Vhc3lJbnB1dFwiKTtcbnZhciBFdmVudENvbnRyb2xsZXIgICAgICAgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9FdmVudENvbnRyb2xsZXJcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xucmVxdWlyZShcIi4uL3B1cHBldHNNb2R1bGVzL2VubmVtaVBhdHRlcm4xXCIpO1xucmVxdWlyZShcIi4uL3B1cHBldHNNb2R1bGVzL2dhdGVcIik7XG4vLyByZXF1aXJlKFwiLi4vcHVwcGV0c01vZHVsZXMvd2FsbFwiKTtcbnJlcXVpcmUoXCIuLi9TeXN0ZW1zL3JlbmRlclwiKTtcbnJlcXVpcmUoXCIuLi9TeXN0ZW1zL2NhbWVyYUZvY3VzXCIpO1xucmVxdWlyZShcIi4uL1N5c3RlbXMvY29sbGlkZXJcIik7XG52YXIgbW9kdWxlUGxheWVyICAgICAgICAgID0gcmVxdWlyZShcIi4uL3B1cHBldHNNb2R1bGVzL1BsYXllclwiKTtcbnJlcXVpcmUoXCIuLi9wdXBwZXRzTW9kdWxlcy9jYW1lcmFcIik7XG5yZXF1aXJlKFwiLi4vU3lzdGVtcy9wb2x5Z29uZVVwZGF0ZVwiKTtcbnJlcXVpcmUoXCIuLi9wdXBwZXRzTW9kdWxlcy9lbm5lbWllc0dlbmVyYXRvclwiKTtcbnJlcXVpcmUoXCIuLi9TeXN0ZW1zL2tpbGxNb2R1bGVzUGFzdFwiKTtcblxudmFyIEdhbWUgPSB7XG4gICAgICAgICAgICAgICAgUHVwcGV0cyAgICAgICAgICA6IFB1cHBldHMsXG4gICAgICAgICAgICAgICAgSW5wdXRzICAgICAgICAgICA6IG5ldyBFYXN5SW5wdXRzKCksXG4gICAgICAgICAgICAgICAgY3R4ICAgICAgICAgICAgICA6IGNhbnZhc0NvbmYuY3R4LFxuICAgICAgICAgICAgICAgIGNhbnZhcyAgICAgICAgICAgOiBjYW52YXNDb25mLmRvbUNhbnZhcyxcbiAgICAgICAgICAgICAgICBwbGF5ZXJDb250cm9sbGVyIDogbW9kdWxlUGxheWVyLFxuICAgICAgICAgICAgICAgIGV2ZW50Q29udHJvbGxlciAgOiBFdmVudENvbnRyb2xsZXJcbiAgICAgICAgICAgIH07XG5cbi8vIGFkZCBvZiBpbnB1dCBjb250cm9sc1xuR2FtZS5JbnB1dHMuYWRkRXZlbnQoXCJrZXlkb3duXCIsIHdpbmRvdyk7XG5HYW1lLklucHV0cy5hZGRFdmVudChcInRvdWNoZW5kXCIsIEdhbWUuY2FudmFzKTtcblxuR2FtZS5JbnB1dHMuc2V0S2V5QmluZCgwLHtcInRvdWNoZW5kXCI6ZnVuY3Rpb24gKCl7R2FtZS5ldmVudENvbnRyb2xsZXIuZW1pdChcImdvLWZvcndhcmRcIik7fX0pO1xuXG5HYW1lLmV2ZW50Q29udHJvbGxlci5hZGQoJ2dhbWVPdmVyJyxmdW5jdGlvbigpe3dpbmRvdy5sb2NhdGlvbj13aW5kb3cubG9jYXRpb247fSk7XG5cbi8vIEdhbWUuSW5wdXRzLnNldEtleUJpbmQoMCx7XCJ0b3VjaGVuZFwiOmZ1bmN0aW9uICgpe0dhbWUuZXZlbnRDb250cm9sbGVyLmVtaXQoXCJyZWJvdW5kXCIpO319KTtcblxuLy8gY29uc29sZS5sb2coR2FtZS5JbnB1dHMuZ2V0S2V5c0JpbmQoKSk7XG5cbi8vIGNyZWF0ZSBlbnRpdGllcyBcblxuLy8gZXhwb3J0IGJyb3dzZXJpZnkgXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG4iLCJcbnZhciBFdmVudHNDb250cm9sbGVyID0gZnVuY3Rpb24gKCl7IH07XG4gICAgXG4gICAgRXZlbnRzQ29udHJvbGxlci5wcm90b3R5cGUuZXZlbnRzID0ge307XG5cbiAgICBFdmVudHNDb250cm9sbGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihteUV2ZW50LG15RnVuY3Rpb24pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZXZlbnRzW215RXZlbnRdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW215RXZlbnRdPVtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbbXlFdmVudF0ucHVzaChteUZ1bmN0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2ZW50c1tteUV2ZW50XS5sZW5ndC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgIEV2ZW50c0NvbnRyb2xsZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJncy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgIEV2ZW50c0NvbnRyb2xsZXIucHJvdG90eXBlLmdldEV2ZW50ID0gZnVuY3Rpb24oc3RyaW5nKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdHJpbmcuaW5kZXhPZignKicpIT09LTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmVudHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoc3RyaW5nLmluZGV4T2YoJyonKT09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnJheSAgPSBzdHJpbmcuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamV0RXZlbnQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyYXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpldEV2ZW50W2FycmF5W2luZGV4XV0gPSB0aGlzLmV2ZW50c1thcnJheVtpbmRleF1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamV0RXZlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG52YXIgY29udHJvbGxlciA9IG5ldyBFdmVudHNDb250cm9sbGVyKCk7XG4vLyBleHBvcnQgYnJvd3NlcmlmeSBcbm1vZHVsZS5leHBvcnRzID0gY29udHJvbGxlcjtcbiIsInZhciBiYXNpYyA9IHt9O1xuYmFzaWMuY29tcHV0ZVBvbHlnb25lPSBmdW5jdGlvbihzaGFwZSx4LHksd2lkdGgsaGVpZ2h0LGFuZ2xlKXtcbiAgICBpZihzaGFwZSA9PT0gXCJzcXVhcmVcIil7XG5cbiAgICAgICAgdmFyIF9saW5lVG9wID0ge2E6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrKHdpZHRoKi0xKS8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5KyhoZWlnaHQqLTEpLzIpfSxiOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4K3dpZHRoLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkrKGhlaWdodCotMSkvMil9fTtcbiAgICAgICAgdmFyIF9saW5lQm90dG9tID0ge2E6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrKHdpZHRoKi0xKS8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5K2hlaWdodC8yKX0sYjp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCt3aWR0aC8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5K2hlaWdodC8yKX19O1xuICAgICAgICB2YXIgX2xpbmVMZWZ0ID0ge2E6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrKHdpZHRoKi0xKS8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5KyhoZWlnaHQqLTEpLzIpfSxiOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4Kyh3aWR0aCotMSkvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeStoZWlnaHQvMil9fTtcbiAgICAgICAgdmFyIF9saW5lUmlnaHQgPSB7YTp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCt3aWR0aC8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5KyhoZWlnaHQqLTEpLzIpfSxiOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4K3dpZHRoLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkraGVpZ2h0LzIpfX07XG5cbiAgICAgICAgcmV0dXJuIHsnbGluZVRvcCc6X2xpbmVUb3AsJ2xpbmVCb3R0b20nOl9saW5lQm90dG9tLCdsaW5lUmlnaHQnOl9saW5lUmlnaHQsJ2xpbmVMZWZ0JzpfbGluZUxlZnR9O1xuICAgIH1cbiAgICBlbHNlIGlmKHNoYXBlPT09XCJWZXJ0aWNhbExpbmVcIil7XG4gICAgICAgIFxuICAgICAgICB2YXIgX2xpbmVMZWZ0ID0ge2E6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrKHdpZHRoKi0xKS8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5KyhoZWlnaHQqLTEpLzIpfSxiOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4Kyh3aWR0aCotMSkvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeStoZWlnaHQvMil9fTtcbiAgICAgICAgdmFyIF9saW5lUmlnaHQgPSB7YTp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCt3aWR0aC8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5KyhoZWlnaHQqLTEpLzIpfSxiOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4K3dpZHRoLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkraGVpZ2h0LzIpfX07XG4gICAgICAgIFxuICAgICAgICByZXR1cm4geydsaW5lUmlnaHQnOl9saW5lUmlnaHQsJ2xpbmVMZWZ0JzpfbGluZUxlZnR9OyAgICAgICBcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2ljOyBcbiIsInZhciBjb25maWcgPSB7fTtcbmNvbmZpZy5kb21DYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTsgXG5jb25maWcuY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsgIiwidmFyIGJhc2ljc0NvbXBvbmVudHMgICAgICA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL2Jhc2ljc0NvbXBvbmVudHNcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIG1vZHVsZUV2ZW50Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcbnZhciBiYXNpYyAgICAgICAgICAgICAgICAgPSAgcmVxdWlyZShcIi4uL21vZHVsZXMvYmFzaWNNZXRob2Rlc1wiKTtcblxuLy8gY29tcG9uZW50IG1vdmUgc21vb3RoIGZvciBwbGF5ZXI7XG5QdXBwZXRzLmNvbXBvbmVudChcIm1vdmVcIixmdW5jdGlvbihkYXRhLGVudGl0eSx1bmRlZmluZWQpe1xuICAgIHJldHVybiB7dmFsdWU6ZGF0YS52YWx1ZXx8MCwgZGl2aXNldXIgOiBkYXRhLmRpdmlzZXVyIHx8IDIuNSxkaXJlY3Rpb24gOiBkYXRhLmRpcmVjdGlvbiB8fCA1ICxpbnZlcnRTd2l0Y2ggOiBmYWxzZX07XG59KTtcblxuUHVwcGV0cy5jb21wb25lbnQoXCJzY29yZVwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHt2YWx1ZTpkYXRhLnZhbHVlfHwwfTtcbn0pO1xuXG5QdXBwZXRzLmVudGl0eSgncGxheWVyJyx7Y29tcG9uZW50cyA6IFsncG9zaXRpb24nLFwiaW1hZ2VSZW5kZXJcIiwncmVuZGVyJywnc2l6ZScsJ3NwZWVkJywnbW92ZScsJ2NvbGxpZGVyJyxcInBvbHlnb25lXCIsXCJzY29yZVwiXX0pO1xuXG52YXIgZ2V0SWRDYW1lcmEgPSBQdXBwZXRzLmZpbmQoJ3RhcmdldENhbWVyYScpO1xuICAgIGNhbWVyYSA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyhnZXRJZENhbWVyYVswXSlbMF07XG5cbi8vIHN5c3RlbSB1c2UgdG8gbW92ZSBwbGF5ZXIuXG5QdXBwZXRzLnN5c3RlbShcIm1vdmUtZm9yd2FyZFwiLGZ1bmN0aW9uKHBvc2l0aW9uLHNwZWVkLG1vdmUpe1xuICAgICAgICB2YXIgX3NwZWVkID0gc3BlZWQudmFsdWUsXG4gICAgICAgIF9tb3ZlICAgICAgPSBtb3ZlLnZhbHVlO1xuICAgICAgICBfZGl2aXNldXIgID0gbW92ZS5kaXZpc2V1cjtcblxuICAgICAgICBpZihwb3NpdGlvbi54Pj1jYW52YXNDb25mLmRvbUNhbnZhcy53aWR0aHx8cG9zaXRpb24ueDw9MCl7XG4gICAgICAgICAgICBtb2R1bGVFdmVudENvbnRyb2xsZXIuZW1pdCgnZ2FtZU92ZXInKTtcbiAgICAgICAgICAgIHJldHVybjsgICBcbiAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmKF9tb3ZlPjApe1xuICAgICAgICAgICAgICAgIGlmKF9zcGVlZDwwICYmIChwb3NpdGlvbi54LV9zcGVlZCpNYXRoLnNpbihwb3NpdGlvbi5hbmdsZSpNYXRoLlBJIC8gMTgwKSpfZGl2aXNldXIpPjEwKVxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54LT1fc3BlZWQqTWF0aC5zaW4ocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCkqX2RpdmlzZXVyO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYoX3NwZWVkPjAgJiYgKHBvc2l0aW9uLngrX3NwZWVkKk1hdGguc2luKHBvc2l0aW9uLmFuZ2xlKk1hdGguUEkgLyAxODApKl9kaXZpc2V1cik8NTgwKVxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54Kz1fc3BlZWQqTWF0aC5zaW4ocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCkqX2RpdmlzZXVyO1xuICAgICAgICAgICAgICAgIC8vIGNhbWVyYS5wb3NpdGlvbi55IC09IDMqX2RpdmlzZXVyO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnktPTMqX2RpdmlzZXVyO1xuICAgICAgICAgICAgICAgIG1vdmUudmFsdWUtPTAuMTUvX2RpdmlzZXVyOyAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGlmKChwb3NpdGlvbi5hbmdsZT09OTAgfHwgcG9zaXRpb24uYW5nbGU9PS05MCkgKXsgICBcbiAgICAgICAgICAgICAgICAgICAgc3BlZWQudmFsdWUqPS0xO1xuICAgICAgICAgICAgICAgICAgICBtb3ZlLmRpcmVjdGlvbio9LTE7XG4gICAgICAgICAgICAgICAgICAgIG1vdmUuaW52ZXJ0U3dpdGNoPWZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihNYXRoLnNpbihwb3NpdGlvbi5hbmdsZSpNYXRoLlBJIC8gMTgwKTwxJiZNYXRoLnNpbihwb3NpdGlvbi5hbmdsZSpNYXRoLlBJIC8gMTgwKT4tMSAmJiBwb3NpdGlvbi54PDU4MCAmJiBwb3NpdGlvbi54PDU4MClcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSArPSBfc3BlZWQqTWF0aC5zaW4ocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgICAgICAgICAgaWYoKE1hdGguY29zKHBvc2l0aW9uLmFuZ2xlKk1hdGguUEkgLyAxODApPDEmJk1hdGguY29zKHBvc2l0aW9uLmFuZ2xlKk1hdGguUEkgLyAxODApPi0xICYmIHBvc2l0aW9uLng8NTgwKSlcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueCArPSBfc3BlZWQqTWF0aC5jb3MocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcG9zaXRpb24uYW5nbGUrPSBtb3ZlLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgXG4gICAgICAgIFxufSx7Y29tcG9uZW50cyA6IFsncG9zaXRpb24nLCdzcGVlZCcsJ21vdmUnXX0pO1xuXG52YXIgUGxheWVyQ29udHJvbGxlciA9IGZ1bmN0aW9uICgpe1xuXG4gICAgdmFyIHBhcmFtcyA9IHsgeDpjYW52YXNDb25mLmRvbUNhbnZhcy53aWR0aC8yLCB5OjAsIGFuZ2xlOjAsaW1nQW5nbGUgOiA5MCxwYXRoOlwic291cmNlcy9hc3NldHMvXCIsbmFtZTpcInBhYy1tYW4ucG5nXCIsIHdpZHRoIDogNTAsIGhlaWdodCA6IDUwICAsIHNoYXBlIDogXCJzcXVhcmVcIiwgY3R4IDogY2FudmFzQ29uZi5jdHgsIGZpbGwgOlwiI2ZmMDBlZVwiLCBzbW9vdGhYOjAsc21vb3RoWTowLHR5cGU6XCJwbGF5ZXJcIixsaW5lcyA6e319O1xuXG4gICAgcGFyYW1zLmxpbmVzID0gYmFzaWMuY29tcHV0ZVBvbHlnb25lKHBhcmFtcy5zaGFwZSxwYXJhbXMueCxwYXJhbXMueSxwYXJhbXMud2lkdGgscGFyYW1zLmhlaWdodCxwYXJhbXMuYW5nbGUpO1xuXG4gICAgdGhpcy5pbml0KHBhcmFtcyk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ocGFyYW1zKXtcbiAgICBwYXJhbXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICBwYXJhbXMuaW1hZ2Uuc3JjID0gcGFyYW1zLnBhdGgrcGFyYW1zLm5hbWU7XG4gICAgY29uc29sZS5sb2cocGFyYW1zLmltYWdlKVxuXG4gICAgdGhpcy5lbnRpdHlOdW1iZXIgPSBQdXBwZXRzLmNyZWF0ZUVudGl0eSgncGxheWVyJyx7cG9zaXRpb246e3g6cGFyYW1zLngsIHk6cGFyYW1zLnkgLCBhbmdsZSA6IHBhcmFtcy5hbmdsZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgICAgIDp7dzogcGFyYW1zLndpZHRoICwgaDogcGFyYW1zLmhlaWdodH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlUmVuZGVyICAgOntwYXRoIDogcGFyYW1zLnBhdGggLCBuYW1lIDogcGFyYW1zLm5hbWUsIGltYWdlIDogcGFyYW1zLmltYWdlLGltZ0FuZ2xlIDogcGFyYW1zLmltZ0FuZ2xlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyICAgOntjdHg6IHBhcmFtcy5jdHh9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaWRlciA6e3R5cGU6cGFyYW1zLnR5cGUsc2hhcGUgOiBwYXJhbXMuc2hhcGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2x5Z29uZSA6e2xpbmVzOnBhcmFtcy5saW5lc319KTtcbiAgICB2YXIgZW50aXR5cyA9IFB1cHBldHMuZmluZCgnY29sbGlkZXInKTtcbiAgICB2YXIgb3RoZXJzQ29tcG9uZW50cyA9IFtdO1xuICAgIGVudGl0eXMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LGluZGV4LGFycmF5KXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfbXlFbnRpdHkgPSBQdXBwZXRzLmdldENvbXBvbmVudHMoZWxlbWVudClbMF07XG4gICAgICAgIGlmKF9teUVudGl0eS5jb2xsaWRlci50eXBlICE9PSAncGxheWVyJyl7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIF9teUVudGl0eS5wb2x5Z29uZS5saW5lcyl7XG4gICAgICAgICAgICAgICAgb3RoZXJzQ29tcG9uZW50cy5wdXNoKF9teUVudGl0eS5wb2x5Z29uZS5saW5lc1tpXSk7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9XG4gICAgXG4gICAgfSk7XG5cbiAgICBcbiAgICBQdXBwZXRzLmNvbXBvbmVudChcIm90aGVyc1wiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgICAgIHJldHVybiB7IGxpbmVzIDogZGF0YS5vdGhlcnN9O1xuICAgIH0pO1xuXG4gICAgUHVwcGV0cy5hZGRDb21wb25lbnQodGhpcy5lbnRpdHlOdW1iZXIsJ290aGVycycse290aGVycyA6IG90aGVyc0NvbXBvbmVudHN9KTtcblxuICAgIHRoaXMuc2V0RXZlbnRzKCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5zZXRFdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgbW9kdWxlRXZlbnRDb250cm9sbGVyLmFkZChcImdvLWZvcndhcmRcIixmdW5jdGlvbigpeyAgXG4gICAgICAgIHZhciBfc2VsZiA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyh0aGlzLmVudGl0eU51bWJlcilbMF07XG4gICAgICAgIF9zZWxmLm1vdmUudmFsdWUgKz0xOyBcbiAgICAgICAgbW9kdWxlRXZlbnRDb250cm9sbGVyLmVtaXQoXCJnZW5lcmF0ZUVuZW1pZVwiLF9zZWxmLnBvc2l0aW9uKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIG1vZHVsZUV2ZW50Q29udHJvbGxlci5hZGQoXCJnZW5lcmF0ZUVuZW1pZVwiLGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBlbnRpdHlzID0gUHVwcGV0cy5maW5kKCdjb2xsaWRlcicpO1xuICAgICAgICB2YXIgb3RoZXJzQ29tcG9uZW50cyA9IFtdO1xuXG4gICAgICAgIGVudGl0eXMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LGluZGV4LGFycmF5KXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIF9teUVudGl0eSA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyhlbGVtZW50KVswXTtcbiAgICAgICAgICAgIGlmKF9teUVudGl0eS5jb2xsaWRlci50eXBlICE9PSAncGxheWVyJyl7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBfbXlFbnRpdHkucG9seWdvbmUubGluZXMpe1xuICAgICAgICAgICAgICAgICAgICBvdGhlcnNDb21wb25lbnRzLnB1c2goX215RW50aXR5LnBvbHlnb25lLmxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgUHVwcGV0cy5nZXRDb21wb25lbnRzKHRoaXMuZW50aXR5TnVtYmVyKVswXS5vdGhlcnMubGluZXMgPSBvdGhlcnNDb21wb25lbnRzO1xuXG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBtb2R1bGVFdmVudENvbnRyb2xsZXIuYWRkKFwicmVib3VuZFwiLGZ1bmN0aW9uKCl7IFxuXG4gICAgICAgIHZhciBfc2VsZiA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyh0aGlzLmVudGl0eU51bWJlcilbMF07XG4gICAgICAgIGlmKCFfc2VsZi5tb3ZlLmludmVydFN3aXRjaCl7XG4gICAgICAgICAgICBfc2VsZi5zcGVlZC52YWx1ZSAqPS0xOyBcbiAgICAgICAgICAgIF9zZWxmLm1vdmUuZGlyZWN0aW9uICo9LTE7IFxuICAgICAgICAgICAgX3NlbGYubW92ZS5pbnZlcnRTd2l0Y2ggPSB0cnVlOyAgICAgXG4gICAgICAgIH1cblxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICBtb2R1bGVFdmVudENvbnRyb2xsZXIuYWRkKFwic2NvcmUrK1wiLGZ1bmN0aW9uKCl7IFxuXG4gICAgICAgIHZhciBfc2VsZiA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyh0aGlzLmVudGl0eU51bWJlcilbMF07XG4gICAgICAgICAgICBfc2VsZi5zY29yZS52YWx1ZSs9MTsgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd5b3VyIHNjb3JlIGlzIG9mICcsX3NlbGYuc2NvcmUudmFsdWUpOyAgXG5cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuXG4vLyBicm93c2VyaWZ5IGV4cG9ydFxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUGxheWVyQ29udHJvbGxlcigpOyIsInZhciBiYXNpY3NDb21wb25lbnRzICAgICAgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50cy9iYXNpY3NDb21wb25lbnRzXCIpO1xudmFyIGNhbnZhc0NvbmYgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2NvbmZpZ0NhbnZhc1wiKTtcbnZhciBtb2R1bGVFdmVudENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9FdmVudENvbnRyb2xsZXJcIik7XG52YXIgYmFzaWMgICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvYmFzaWNNZXRob2Rlc1wiKTtcblxuUHVwcGV0cy5lbnRpdHkoJ2NhbWVyYScse2NvbXBvbmVudHMgOiBbJ3Bvc2l0aW9uJ119KTtcblxudmFyIENhbWVyYSA9IGZ1bmN0aW9uICh4LHkpe1xuXG4gICAgdmFyIHBhcmFtcyA9IHsgeDp4LCB5OnksYW5nbGU6MCx3aWR0aDo2MDAsaGVpZ2h0OjQwMH07XG4gICAgXG4gICAgcGFyYW1zLmxpbmVzID0gYmFzaWMuY29tcHV0ZVBvbHlnb25lKHBhcmFtcy5zaGFwZSxwYXJhbXMueCxwYXJhbXMueSxwYXJhbXMud2lkdGgscGFyYW1zLmhlaWdodCxwYXJhbXMuYW5nbGUpO1xuICAgIFxuICAgIHRoaXMuaW5pdChwYXJhbXMpO1xufTtcblxuQ2FtZXJhLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ocGFyYW1zKXtcblxuICAgIHRoaXMuZW50aXR5TnVtYmVyID0gUHVwcGV0cy5jcmVhdGVFbnRpdHkoJ2NhbWVyYScse3Bvc2l0aW9uOnt4OnBhcmFtcy54LCB5OnBhcmFtcy55LGFuZ2xlOiBwYXJhbXMuYW5nbGV9XG4gICAgfSk7XG5cbiAgICB2YXIgX3BsYXllckVudGl0eSA9IFB1cHBldHMuZmluZCgnbW92ZScpO1xuICAgIHZhciBfcGxheWVyUmVmID0gUHVwcGV0cy5nZXRDb21wb25lbnRzKF9wbGF5ZXJFbnRpdHkpWzBdO1xuICAgIC8vIGNvbXBvbmVudCBtb3ZlIHNtb290aCBmb3IgcGxheWVyO1xuICAgIFB1cHBldHMuY29tcG9uZW50KFwidGFyZ2V0Q2FtZXJhXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICAgICAgcmV0dXJuIHtyZWY6ZGF0YS50YXJnZXR9O1xuICAgIH0pO1xuXG4gICAgUHVwcGV0cy5hZGRDb21wb25lbnQodGhpcy5lbnRpdHlOdW1iZXIsXCJ0YXJnZXRDYW1lcmFcIix7dGFyZ2V0IDogX3BsYXllclJlZn0pO1xufTtcbm1vZHVsZS5leHBvcnRzID0gbmV3IENhbWVyYSgzMDAsLTMwMCk7XG4iLCJ2YXIgYmFzaWNzQ29tcG9uZW50cyAgICAgID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudHMvYmFzaWNzQ29tcG9uZW50c1wiKTtcbnZhciBjYW52YXNDb25mICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9jb25maWdDYW52YXNcIik7XG52YXIgYmFzaWMgICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvYmFzaWNNZXRob2Rlc1wiKTtcblxuLy8gY29tcG9uZW50IG1vdmUgc21vb3RoIGZvciBibG9jMTtcblB1cHBldHMuY29tcG9uZW50KCdibG9jTW92ZTEnLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHt0eXBlOmRhdGEudHlwZXx8MCwgeCA6IGRhdGEueCB8fCAyLCBkaXN0YW5jZTpkYXRhLmRpc3RhbmNlIHx8Y2FudmFzQ29uZi5kb21DYW52YXMud2lkdGh9O1xufSk7XG5cblB1cHBldHMuZW50aXR5KCdibG9jMScse2NvbXBvbmVudHMgOiBbJ3Bvc2l0aW9uJywncmVuZGVyJywnaW1hZ2VSZW5kZXInLCdzcGVlZCcsJ3NpemUnLCdjb2xsaWRlcicsXCJwb2x5Z29uZVwiLFwiYmxvY01vdmUxXCJdfSk7XG5cbi8vIHN5c3RlbSB1c2UgdG8gbW92ZSBibG9jIHBhdHRlcm4gMS5cblB1cHBldHMuc3lzdGVtKFwibW92ZWJsb2MxXCIsZnVuY3Rpb24ocG9zaXRpb24sc3BlZWQsYmxvY01vdmUxKXtcblxuICAgIHBvc2l0aW9uLngrPXNwZWVkLnZhbHVlO1xuXG4gICAgaWYocG9zaXRpb24ueD49Y2FudmFzQ29uZi5kb21DYW52YXMud2lkdGggfHwgcG9zaXRpb24ueDw9MCl7XG4gICAgICAgIHNwZWVkLnZhbHVlKj0tMTtcbiAgICB9XG5cbn0se2NvbXBvbmVudHMgOiBbJ3Bvc2l0aW9uJywnc3BlZWQnLCdibG9jTW92ZTEnXX0pO1xuXG5cbnZhciBibG9jRmFjdG9yeSA9IGZ1bmN0aW9uICh4LHksYW5nbGUsdyxoLHNwZWVkKXtcblxuICAgIHZhciBwYXJhbXMgPSB7IHg6eCwgeTp5ICwgYW5nbGUgOiAgIGFuZ2xlLCB3aWR0aCA6IHcsIGhlaWdodCA6IGggLGltZ0FuZ2xlIDogNDUscGF0aDpcInNvdXJjZXMvYXNzZXRzL1wiLG5hbWU6XCJnb3NodC1cIiAsIHNoYXBlIDogXCJzcXVhcmVcIiwgc3BlZWQ6c3BlZWQgLGN0eCA6IGNhbnZhc0NvbmYuY3R4LCB0eXBlOlwiYmxvY1wiLGxpbmVzIDp7fSxmaWxsIDpcIiNmZmZmZmZcIiB9O1xuXG4gICAgcGFyYW1zLmxpbmVzID0gYmFzaWMuY29tcHV0ZVBvbHlnb25lKHBhcmFtcy5zaGFwZSxwYXJhbXMueCxwYXJhbXMueSxwYXJhbXMud2lkdGgscGFyYW1zLmhlaWdodCxwYXJhbXMuYW5nbGUpO1xuICAgIFxuICAgIHRoaXMuaW5pdChwYXJhbXMpO1xufTtcblxuYmxvY0ZhY3RvcnkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihwYXJhbXMpe1xuICAgIHZhciB0ZXN0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjMpO1xuICAgIHBhcmFtcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIHBhcmFtcy5pbWFnZS5zcmMgPSBwYXJhbXMucGF0aCtwYXJhbXMubmFtZSt0ZXN0KycucG5nJztcblxuICAgIHRoaXMuZW50aXR5TnVtYmVyID0gUHVwcGV0cy5jcmVhdGVFbnRpdHkoJ2Jsb2MxJyx7cG9zaXRpb246e3g6cGFyYW1zLngsIHk6cGFyYW1zLnkgLCBhbmdsZSA6IHBhcmFtcy5hbmdsZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgICAgIDp7dzogcGFyYW1zLndpZHRoICwgaDogcGFyYW1zLmhlaWdodH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlciAgIDp7Y3R4OiBwYXJhbXMuY3R4fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VSZW5kZXIgICA6e3BhdGggOiBwYXJhbXMucGF0aCAsaW1nQW5nbGU6cGFyYW1zLmltZ0FuZ2xlLCBuYW1lIDogcGFyYW1zLm5hbWUsIGltYWdlIDogcGFyYW1zLmltYWdlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlkZXIgOnt0eXBlOnBhcmFtcy50eXBlLHNoYXBlIDogcGFyYW1zLnNoYXBlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWdvbmUgOntsaW5lczpwYXJhbXMubGluZXN9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jTW92ZTE6e3R5cGUgOiBcImhvcml6b250YWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkICAgIDp7dmFsdWUgOiA1fX0pO1xuICAgIC8vIG5ldyBnYXRlRmFjdG9yeShwYXJhbXMueCxwYXJhbXMueSwwLDEwMDAwLDEpO1xuXG59O1xuXG5ibG9jRmFjdG9yeS5wcm90b3R5cGUuc2V0RXZlbnRzID0gZnVuY3Rpb24oKXtcblxufTtcbi8vIDg0XG5uZXcgYmxvY0ZhY3RvcnkoNTAsMzUwLDQ1LDI1LDI1KTtcbm1vZHVsZS5leHBvcnRzID0gYmxvY0ZhY3Rvcnk7XG5cbiIsInZhciBiYXNpY3NDb21wb25lbnRzICAgICAgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50cy9iYXNpY3NDb21wb25lbnRzXCIpO1xudmFyIGNhbnZhc0NvbmYgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2NvbmZpZ0NhbnZhc1wiKTtcbnZhciBiYXNpYyAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9iYXNpY01ldGhvZGVzXCIpO1xudmFyIG1vZHVsZUV2ZW50Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcbnZhciBibG9jRmFjdG9yeSAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vcHVwcGV0c01vZHVsZXMvZW5uZW1pUGF0dGVybjFcIik7XG52YXIgZ2F0ZSAgICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL3B1cHBldHNNb2R1bGVzL2dhdGVcIik7XG5cbnZhciBFbm5lbWllR2VuZXJhdG9yID0gZnVuY3Rpb24gKCl7XG5cbiAgICBFbm5lbWllR2VuZXJhdG9yLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcbiAgICB9O1xuXG4gICAgRW5uZW1pZUdlbmVyYXRvci5wcm90b3R5cGUuc2V0RXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICBtb2R1bGVFdmVudENvbnRyb2xsZXIuYWRkKFwiZ2VuZXJhdGVFbmVtaWVcIixmdW5jdGlvbihwb3NQbGF5ZXIpe1xuICAgICAgICAgICAgbmV3IGJsb2NGYWN0b3J5KDUwLHBvc1BsYXllci55LTE2OCw0NSwyNSwyNSk7XG4gICAgICAgICAgICBuZXcgZ2F0ZSgwLHBvc1BsYXllci55LTE2OCwwLDEwMDAwLDEpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCgpO1xufTtcblxuLy8gODRcbm5ldyBFbm5lbWllR2VuZXJhdG9yKDUwLDI5OCw0NSwyNSwyNSk7XG5tb2R1bGUuZXhwb3J0cyA9IHRoaXM7IiwidmFyIGJhc2ljc0NvbXBvbmVudHMgICAgICA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL2Jhc2ljc0NvbXBvbmVudHNcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIGJhc2ljICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2Jhc2ljTWV0aG9kZXNcIik7XG5cblxuUHVwcGV0cy5lbnRpdHkoJ2dhdGUnLHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ3JlbmRlcicsJ3NpemUnLCdjb2xsaWRlcicsXCJwb2x5Z29uZVwiXX0pO1xuXG5cblxuXG52YXIgZ2F0ZUZhY3RvcnkgPSBmdW5jdGlvbiAoeCx5LGFuZ2xlLHcsaCl7XG5cbiAgICB2YXIgcGFyYW1zID0geyB4OngsIHk6eSAsIGFuZ2xlIDogICBhbmdsZSwgd2lkdGggOiB3LCBoZWlnaHQgOiBoICAsIHNoYXBlIDogXCJzcXVhcmVcIiwgY3R4IDogY2FudmFzQ29uZi5jdHgsIHR5cGU6XCJnYXRlXCIsbGluZXMgOnt9LGZpbGwgOlwicmdiYSgyOSwgMjQwLCAyMTQsMC44KVwiIH07XG5cbiAgICBwYXJhbXMubGluZXMgPSBiYXNpYy5jb21wdXRlUG9seWdvbmUocGFyYW1zLnNoYXBlLHBhcmFtcy54LHBhcmFtcy55LHBhcmFtcy53aWR0aCxwYXJhbXMuaGVpZ2h0LHBhcmFtcy5hbmdsZSk7XG4gICAgXG4gICAgdGhpcy5pbml0KHBhcmFtcyk7XG59O1xuXG5nYXRlRmFjdG9yeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHBhcmFtcyl7XG5cbiAgICB0aGlzLmVudGl0eU51bWJlciA9IFB1cHBldHMuY3JlYXRlRW50aXR5KCdnYXRlJyx7cG9zaXRpb246e3g6cGFyYW1zLngsIHk6cGFyYW1zLnkgLCBhbmdsZSA6IHBhcmFtcy5hbmdsZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgICAgIDp7dzogcGFyYW1zLndpZHRoICwgaDogcGFyYW1zLmhlaWdodH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlciAgIDp7Y3R4OiBwYXJhbXMuY3R4LGZpbGw6cGFyYW1zLmZpbGx9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaWRlciA6e3R5cGU6cGFyYW1zLnR5cGUsc2hhcGUgOiBwYXJhbXMuc2hhcGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2x5Z29uZSA6e2xpbmVzOnBhcmFtcy5saW5lc319KTtcbn07XG5cbmdhdGVGYWN0b3J5LnByb3RvdHlwZS5zZXRFdmVudHMgPSBmdW5jdGlvbigpe1xuXG59O1xuLy8gODRcbm5ldyBnYXRlRmFjdG9yeSgwLDMyMCwwLDEwMDAwLDEpO1xubW9kdWxlLmV4cG9ydHMgPSBnYXRlRmFjdG9yeTtcblxuIl19
