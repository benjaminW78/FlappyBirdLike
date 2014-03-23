(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Basic components for entities !

Puppets.component("position",function(data,entity,undefined){
    return { angle : data.angle || 0 , x : data.x || 0  , y : data.y || 0 };
});

Puppets.component("render",function(data,entity,undefined){
    return { ctx : data.ctx ,Fillcolor : data.fill || "#22ff33" , Strokecolor : data.stroke || "#22ffff" };
});

Puppets.component("size",function(data,entity,undefined){
    return { width : data.w || 50  , height : data.h || 50 };
});

Puppets.component("speed",function(data,entity,undefined){
    return { value : data.value || 5 };
});

Puppets.component("collider",function(data,entity,undefined){
    return { type : data.type || "block",shape : data.shape || ''};
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

},{"../libs/puppets":8,"../modules/EventController":11,"../modules/configCanvas":13}],3:[function(require,module,exports){
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

                 for (var p = 0;p<others.lines.length;p++){
                    
                    var _otherLine1x = others.lines[p].a.x,
                        _otherLine1y = others.lines[p].a.y,
                        _otherLine2x = others.lines[p].b.x,
                        _otherLine2y = others.lines[p].b.y;
                        // test if lines are paralles if they are  test =  0.
                        testParalle=((_playerLine2y - _playerLine1y)* (_otherLine2x - _otherLine1x)) - ((_playerLine2x - _playerLine1x)*(_otherLine2y- _otherLine1y));

                        var testCrossLineToLineA = (((_playerLine2x-_playerLine1x)*(_otherLine1y- _playerLine1y))-((_playerLine2y-_playerLine1y)*(_otherLine1x- _playerLine1x)))/testParalle;
                        var testCrossLineToLineB = (((_otherLine2x-_otherLine1x) * (_otherLine1y - _playerLine1y))-((_otherLine2y - _otherLine1y) * (_otherLine1x - _playerLine1x))) / testParalle;
                    if ((testCrossLineToLineA < 0) || (testCrossLineToLineA > 1) || (testCrossLineToLineB < 0) || (testCrossLineToLineB > 1)){
                        // console.log("yolo ca ce croise pas !");
                    }
                    else {
                        console.log("collision");
                        eventsController.emit('rebound');
                    }                            
                 }

        }   
},{components : ['position','collider','size','others','polygone']});

module.exports = this; 

},{"../libs/puppets":8,"../modules/EventController":11,"../modules/configCanvas":13}],4:[function(require,module,exports){
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

},{"../libs/puppets":8,"../modules/configCanvas":13}],5:[function(require,module,exports){
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

},{"../libs/puppets":8,"../modules/configCanvas":13}],6:[function(require,module,exports){
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
},{"./libs/requestAnimationFrame":9,"./loader/game":10}],7:[function(require,module,exports){
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
var EasyInput = function()
{
    var key = {};
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
};

module.exports = EasyInput;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){

var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

module.exports = requestAnimFrame;
},{}],10:[function(require,module,exports){
// require Of all files Needed
var Puppets               = require("../libs/puppets");
var EasyInputs            = require("../libs/EasyInput");
var EventController       = require("../modules/EventController");
var canvasConf            = require("../modules/configCanvas");
require("../puppetsModules/blocPattern");
require("../puppetsModules/wall");
require("../Systems/render");
require("../Systems/collider");
require("../Systems/polygoneUpdate");
require("../Systems/cameraFocus");
var modulePlayer          = require("../puppetsModules/Player");
require("../puppetsModules/camera");


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
Game.Inputs.addEvent("touchend", window);

Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("go-forward");}});
// Game.Inputs.setKeyBind(0,{"touchend":function (){Game.eventController.emit("rebound");}});

// console.log(Game.Inputs.getKeysBind());

// create entities 

// export browserify 
module.exports = Game;

},{"../Systems/cameraFocus":2,"../Systems/collider":3,"../Systems/polygoneUpdate":4,"../Systems/render":5,"../libs/EasyInput":7,"../libs/puppets":8,"../modules/EventController":11,"../modules/configCanvas":13,"../puppetsModules/Player":14,"../puppetsModules/blocPattern":15,"../puppetsModules/camera":16,"../puppetsModules/wall":17}],11:[function(require,module,exports){

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

},{}],12:[function(require,module,exports){
var basic = {};
basic.computePolygone= function(shape,x,y,width,height,angle){
    console.log(shape)
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

},{}],13:[function(require,module,exports){
var config = {};
config.domCanvas = document.getElementById("canvas"); 
config.ctx = document.getElementById("canvas").getContext("2d");

module.exports = config; 
},{}],14:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

// component move smooth for player;
Puppets.component("move",function(data,entity,undefined){
    return {value:data.value||0, diviseur : data.diviseur || 2,direction : data.direction || 2 ,invertSwitch : false};
});

Puppets.entity('player',{components : ['position','render','size','speed','move','collider',"polygone"]});

// system use to move player.
Puppets.system("move-forward",function(position,speed,move){
        var _speed = speed.value,
        _move      = move.value;
        _diviseur  = move.diviseur;
       
        if(_move>0){
            if(_speed<0)
                position.x-=_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur;
            else if(_speed>0)
                position.x+=_speed*Math.sin(position.angle*Math.PI / 180)*_diviseur;

            position.y-=3*_diviseur;
            move.value-=0.15/_diviseur;  
        }
        else{
            if(position.angle==90 || position.angle==-90){   
                speed.value*=-1;
                move.direction*=-1;
                move.invertSwitch=false;
            }

            if(position.x>=600){
                if(_speed>0){
                    speed.value*=-1;
                    move.direction*=-1
                }
                position.x-=0.25;
            }
            else if(position.x<=0){
                if(_speed<0){
                    speed.value*=-1;
                    move.direction*=-1
                }
                position.x+=0.25;
            }

            if(Math.sin(position.angle*Math.PI / 180)<1&&Math.sin(position.angle*Math.PI / 180)>-1)
                position.y += _speed*Math.sin(position.angle*Math.PI / 180);
            if((Math.cos(position.angle*Math.PI / 180)<1&&Math.cos(position.angle*Math.PI / 180)>-1))
                position.x += _speed*Math.cos(position.angle*Math.PI / 180);
            
            position.angle+= move.direction;
        }
        
},{components : ['position','speed','move']});

var PlayerController = function (){

    var params = { x:canvasConf.domCanvas.width/2, y:256, angle:0, width : 25, height : 25  , shape : "square", ctx : canvasConf.ctx, smoothX:0,smoothY:0,type:"player",lines :{}};

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);

    this.init(params);
};

PlayerController.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('player',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
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
    }.bind(this));

    moduleEventController.add("rebound",function(){ 

        var _self = Puppets.getComponents(this.entityNumber)[0];
        if(!_self.move.invertSwitch){
            _self.speed.value *=-1; 
            _self.move.direction *=-1; 
            _self.move.invertSwitch = true;     
        }

    }.bind(this));
};


// browserify export
module.exports = new PlayerController();
},{"../Components/basicsComponents":1,"../modules/EventController":11,"../modules/basicMethodes":12,"../modules/configCanvas":13}],15:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var basic                 = require("../modules/basicMethodes");

Puppets.entity('bloc1',{components : ['position','render','size','collider',"polygone"]});


var blocFactory = function (){

    var params = { x:150, y:200 , angle :   90, width : 50, height : 100  , shape : "square", ctx : canvasConf.ctx, type:"bloc",lines :{},fill :"#ffffff" };

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
    this.init(params);
};

blocFactory.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('bloc1',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        render   :{ctx: params.ctx,fill:params.fill},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines}});
};


module.exports = new blocFactory();
},{"../Components/basicsComponents":1,"../modules/basicMethodes":12,"../modules/configCanvas":13}],16:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

Puppets.entity('camera',{components : ['position','render']});

var Camera = function (x,y,w,h){

    var params = { x:x, y:y,ctx : canvasConf.ctx, };
    
    this.init(params);
};

Camera.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('camera',{position:{x:params.x, y:params.y},render:{ctx : params.ctx}});

    var _playerEntity = Puppets.find('move');
    var _playerRef = Puppets.getComponents(_playerEntity)[0];
    console.log(_playerRef);
    // component move smooth for player;
    Puppets.component("targetCamera",function(data,entity,undefined){
        return {ref:data.target};
    });

    Puppets.addComponent(this.entityNumber,"targetCamera",{target : _playerRef});
};

module.exports = new Camera();

},{"../Components/basicsComponents":1,"../modules/EventController":11,"../modules/basicMethodes":12,"../modules/configCanvas":13}],17:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

Puppets.entity('wall',{components : ['position','size','collider',"polygone"]});

var wallFactory = function (x,y,w,h){

    var params = { x:x, y:y , angle :   0, width : w, height : h  , shape : "VerticalLine", ctx : canvasConf.ctx, type:"border",lines :{},fill :"#95ffff" };

    params.lines = basic.computePolygone(params.shape,params.x,params.y,params.width,params.height,params.angle);
    
    this.init(params);
};

wallFactory.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('wall',{position:{x:params.x, y:params.y , angle : params.angle},
                                                        size     :{w: params.width , h: params.height},
                                                        // render   :{ctx: params.ctx,fill:params.fill},
                                                        collider :{type:params.type,shape : params.shape},
                                                        polygone :{lines:params.lines}});
};

module.exports = new wallFactory(300,400,600,-1000); 

},{"../Components/basicsComponents":1,"../modules/EventController":11,"../modules/basicMethodes":12,"../modules/configCanvas":13}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvQ29tcG9uZW50cy9iYXNpY3NDb21wb25lbnRzLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL1N5c3RlbXMvY2FtZXJhRm9jdXMuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvU3lzdGVtcy9jb2xsaWRlci5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9TeXN0ZW1zL3BvbHlnb25lVXBkYXRlLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL1N5c3RlbXMvcmVuZGVyLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL2Zha2VfMmQyNDY2NjAuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbGlicy9FYXN5SW5wdXQuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbGlicy9wdXBwZXRzLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL2xpYnMvcmVxdWVzdEFuaW1hdGlvbkZyYW1lLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL2xvYWRlci9nYW1lLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL21vZHVsZXMvRXZlbnRDb250cm9sbGVyLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL21vZHVsZXMvYmFzaWNNZXRob2Rlcy5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9tb2R1bGVzL2NvbmZpZ0NhbnZhcy5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9wdXBwZXRzTW9kdWxlcy9QbGF5ZXIuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvcHVwcGV0c01vZHVsZXMvYmxvY1BhdHRlcm4uanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvcHVwcGV0c01vZHVsZXMvY2FtZXJhLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL3B1cHBldHNNb2R1bGVzL3dhbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDam1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEJhc2ljIGNvbXBvbmVudHMgZm9yIGVudGl0aWVzICFcblxuUHVwcGV0cy5jb21wb25lbnQoXCJwb3NpdGlvblwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHsgYW5nbGUgOiBkYXRhLmFuZ2xlIHx8IDAgLCB4IDogZGF0YS54IHx8IDAgICwgeSA6IGRhdGEueSB8fCAwIH07XG59KTtcblxuUHVwcGV0cy5jb21wb25lbnQoXCJyZW5kZXJcIixmdW5jdGlvbihkYXRhLGVudGl0eSx1bmRlZmluZWQpe1xuICAgIHJldHVybiB7IGN0eCA6IGRhdGEuY3R4ICxGaWxsY29sb3IgOiBkYXRhLmZpbGwgfHwgXCIjMjJmZjMzXCIgLCBTdHJva2Vjb2xvciA6IGRhdGEuc3Ryb2tlIHx8IFwiIzIyZmZmZlwiIH07XG59KTtcblxuUHVwcGV0cy5jb21wb25lbnQoXCJzaXplXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICByZXR1cm4geyB3aWR0aCA6IGRhdGEudyB8fCA1MCAgLCBoZWlnaHQgOiBkYXRhLmggfHwgNTAgfTtcbn0pO1xuXG5QdXBwZXRzLmNvbXBvbmVudChcInNwZWVkXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICByZXR1cm4geyB2YWx1ZSA6IGRhdGEudmFsdWUgfHwgNSB9O1xufSk7XG5cblB1cHBldHMuY29tcG9uZW50KFwiY29sbGlkZXJcIixmdW5jdGlvbihkYXRhLGVudGl0eSx1bmRlZmluZWQpe1xuICAgIHJldHVybiB7IHR5cGUgOiBkYXRhLnR5cGUgfHwgXCJibG9ja1wiLHNoYXBlIDogZGF0YS5zaGFwZSB8fCAnJ307XG59KTtcblxuUHVwcGV0cy5jb21wb25lbnQoXCJwb2x5Z29uZVwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHsgbGluZXMgOiBkYXRhLmxpbmVzfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXM7ICIsInZhciBQdXBwZXRzICAgID0gcmVxdWlyZShcIi4uL2xpYnMvcHVwcGV0c1wiKTtcbnZhciBjYW52YXNDb25mID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIGV2ZW50c0NvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9FdmVudENvbnRyb2xsZXJcIik7XG5cblB1cHBldHMuc3lzdGVtKFwiY2FtZXJhRm9jdXNcIixmdW5jdGlvbihwb3NpdGlvbix0YXJnZXRDYW1lcmEpe1xuXG4gICAgLy8gY29uc29sZS5sb2codGFyZ2V0Q2FtZXJhKTtcbiAgICB2YXIgdGFyZ2V0eCAgICAgPSB0YXJnZXRDYW1lcmEucmVmLnBvc2l0aW9uLngsXG4gICAgICAgIHRhcmdldHkgICAgID0gdGFyZ2V0Q2FtZXJhLnJlZi5wb3NpdGlvbi55O1xuXG4gICAgICAgIHBvc2l0aW9uLnkgPSB0YXJnZXR5OyAgICAgICAgXG4gICAgICAgIFxufSx7Y29tcG9uZW50cyA6IFtcInBvc2l0aW9uXCIsXCJ0YXJnZXRDYW1lcmFcIl19KTtcblxuUHVwcGV0cy5zeXN0ZW0oXCJjYW1lcmFNb3ZlXCIsZnVuY3Rpb24ocG9zaXRpb24sdGFyZ2V0Q2FtZXJhLHJlbmRlcil7XG5cbiAgICB2YXIgeCAgICAgPSBwb3NpdGlvbi54LFxuICAgICAgICB5ICAgICA9IHBvc2l0aW9uLnksXG4gICAgICAgIGN0eCAgICAgICAgID0gcmVuZGVyLmN0eCxcbiAgICAgICAgbGluZVRvcCAgICAgPSB0YXJnZXRDYW1lcmEucmVmLnBvbHlnb25lLmxpbmVzLmxpbmVUb3AsXG4gICAgICAgIGxpbmVMZWZ0ICAgID0gdGFyZ2V0Q2FtZXJhLnJlZi5wb2x5Z29uZS5saW5lcy5saW5lTGVmdCxcbiAgICAgICAgbGluZVJpZ2h0ICAgPSB0YXJnZXRDYW1lcmEucmVmLnBvbHlnb25lLmxpbmVzLmxpbmVSaWdodCxcbiAgICAgICAgbGluZUJvdHRvbSAgPSB0YXJnZXRDYW1lcmEucmVmLnBvbHlnb25lLmxpbmVzLmxpbmVCb3R0b207XG5cblxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgIGN0eC50cmFuc2xhdGUodGFyZ2V0Q2FtZXJhLnJlZi5wb3NpdGlvbi54LHRhcmdldENhbWVyYS5yZWYucG9zaXRpb24ueSk7XG4gICAgICAgIFxuICAgICAgICBjdHgubW92ZVRvKGxpbmVUb3AuYS54LGxpbmVUb3AuYS55KTtcbiAgICAgICAgY3R4LmxpbmVUbyhsaW5lUmlnaHQuYS54LGxpbmVSaWdodC5hLnkpO1xuICAgICAgICBjdHgubGluZVRvKGxpbmVCb3R0b20uYi54LGxpbmVCb3R0b20uYi55KTtcbiAgICAgICAgY3R4LmxpbmVUbyhsaW5lTGVmdC5iLngsbGluZUxlZnQuYi55KTtcbiAgICAgICAgY3R4LmxpbmVUbyhsaW5lTGVmdC5hLngsbGluZUxlZnQuYS55KTtcbiAgICAgICAgXG4gICAgICAgIC8vIHRhcmdldENhbWVyYS5wb3NpdGlvbi5yZWZcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xufSx7Y29tcG9uZW50cyA6IFtcInBvc2l0aW9uXCIsXCJ0YXJnZXRDYW1lcmFcIixcInJlbmRlclwiXX0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXM7IFxuIiwidmFyIFB1cHBldHMgICAgPSByZXF1aXJlKFwiLi4vbGlicy9wdXBwZXRzXCIpO1xudmFyIGNhbnZhc0NvbmYgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9jb25maWdDYW52YXNcIik7XG52YXIgZXZlbnRzQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcblxuUHVwcGV0cy5zeXN0ZW0oXCJjb2xsaWRlclwiLGZ1bmN0aW9uKHBvc2l0aW9uLGNvbGxpZGVyLHNpemUsb3RoZXJzLHBvbHlnb25lKXtcblxuXG4gICAgdmFyIHggICAgICAgICAgID0gcG9zaXRpb24ueCxcbiAgICAgICAgeSAgICAgICAgICAgPSBwb3NpdGlvbi55LFxuICAgICAgICBhbmdsZSAgICAgICA9IHBvc2l0aW9uLmFuZ2xlLFxuICAgICAgICB3aWR0aCAgICAgICA9IHNpemUud2lkdGgsXG4gICAgICAgIGhlaWdodCAgICAgID0gc2l6ZS5oZWlnaHQ7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpIGluIHBvbHlnb25lLmxpbmVzKXtcbiAgICAgICAgICAgIHZhciBfcGxheWVyTGluZTF4ID0gcG9seWdvbmUubGluZXNbaV0uYS54LFxuICAgICAgICAgICAgICAgIF9wbGF5ZXJMaW5lMXkgPSBwb2x5Z29uZS5saW5lc1tpXS5hLnksXG4gICAgICAgICAgICAgICAgX3BsYXllckxpbmUyeCA9IHBvbHlnb25lLmxpbmVzW2ldLmIueCxcbiAgICAgICAgICAgICAgICBfcGxheWVyTGluZTJ5ID0gcG9seWdvbmUubGluZXNbaV0uYi55O1xuXG4gICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwO3A8b3RoZXJzLmxpbmVzLmxlbmd0aDtwKyspe1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9vdGhlckxpbmUxeCA9IG90aGVycy5saW5lc1twXS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICBfb3RoZXJMaW5lMXkgPSBvdGhlcnMubGluZXNbcF0uYS55LFxuICAgICAgICAgICAgICAgICAgICAgICAgX290aGVyTGluZTJ4ID0gb3RoZXJzLmxpbmVzW3BdLmIueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9vdGhlckxpbmUyeSA9IG90aGVycy5saW5lc1twXS5iLnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZXN0IGlmIGxpbmVzIGFyZSBwYXJhbGxlcyBpZiB0aGV5IGFyZSAgdGVzdCA9ICAwLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdFBhcmFsbGU9KChfcGxheWVyTGluZTJ5IC0gX3BsYXllckxpbmUxeSkqIChfb3RoZXJMaW5lMnggLSBfb3RoZXJMaW5lMXgpKSAtICgoX3BsYXllckxpbmUyeCAtIF9wbGF5ZXJMaW5lMXgpKihfb3RoZXJMaW5lMnktIF9vdGhlckxpbmUxeSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdENyb3NzTGluZVRvTGluZUEgPSAoKChfcGxheWVyTGluZTJ4LV9wbGF5ZXJMaW5lMXgpKihfb3RoZXJMaW5lMXktIF9wbGF5ZXJMaW5lMXkpKS0oKF9wbGF5ZXJMaW5lMnktX3BsYXllckxpbmUxeSkqKF9vdGhlckxpbmUxeC0gX3BsYXllckxpbmUxeCkpKS90ZXN0UGFyYWxsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0Q3Jvc3NMaW5lVG9MaW5lQiA9ICgoKF9vdGhlckxpbmUyeC1fb3RoZXJMaW5lMXgpICogKF9vdGhlckxpbmUxeSAtIF9wbGF5ZXJMaW5lMXkpKS0oKF9vdGhlckxpbmUyeSAtIF9vdGhlckxpbmUxeSkgKiAoX290aGVyTGluZTF4IC0gX3BsYXllckxpbmUxeCkpKSAvIHRlc3RQYXJhbGxlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHRlc3RDcm9zc0xpbmVUb0xpbmVBIDwgMCkgfHwgKHRlc3RDcm9zc0xpbmVUb0xpbmVBID4gMSkgfHwgKHRlc3RDcm9zc0xpbmVUb0xpbmVCIDwgMCkgfHwgKHRlc3RDcm9zc0xpbmVUb0xpbmVCID4gMSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ5b2xvIGNhIGNlIGNyb2lzZSBwYXMgIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29sbGlzaW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzQ29udHJvbGxlci5lbWl0KCdyZWJvdW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgIH1cblxuICAgICAgICB9ICAgXG59LHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ2NvbGxpZGVyJywnc2l6ZScsJ290aGVycycsJ3BvbHlnb25lJ119KTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aGlzOyBcbiIsInZhciBQdXBwZXRzICAgID0gcmVxdWlyZShcIi4uL2xpYnMvcHVwcGV0c1wiKTtcbnZhciBjYW52YXNDb25mID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xuXG4vLyBwdXBwZXQgU3lzdGVtIERyYXcgXG5QdXBwZXRzLnN5c3RlbShcInBvbHlnb25lVXBkYXRlXCIsZnVuY3Rpb24ocG9zaXRpb24sc2l6ZSxwb2x5Z29uZSl7XG4gICAgICAgIHZhciB4ICAgICAgICAgICA9IHBvc2l0aW9uLngsXG4gICAgICAgICAgICB5ICAgICAgICAgICA9IHBvc2l0aW9uLnksXG4gICAgICAgICAgICBhbmdsZSAgICAgICA9IHBvc2l0aW9uLmFuZ2xlLFxuICAgICAgICAgICAgd2lkdGggICAgICAgPSBzaXplLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgPSBzaXplLmhlaWdodDtcblxuICAgICAgICBcbiAgICBpZihwb2x5Z29uZS5saW5lcy5saW5lVG9wIT09dW5kZWZpbmVkKXtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lVG9wLmEueCA9IE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCsod2lkdGgqLTEpLzIpLXgpIC0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkgKiAoKHkrKGhlaWdodCotMSkvMikteSkreDtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lVG9wLmEueSA9IE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCsod2lkdGgqLTEpLzIpLXgpICsgTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeSsoaGVpZ2h0Ki0xKS8yKS15KSt5O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVUb3AuYi54ID0gTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4K3dpZHRoLzIpLXgpIC0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkgKiAoKHkrKGhlaWdodCotMSkvMikteSkreDtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lVG9wLmIueSA9IE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCt3aWR0aC8yKS14KSArIE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkrKGhlaWdodCotMSkvMikteSkreTtcbiAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBcbiAgICBpZihwb2x5Z29uZS5saW5lcy5saW5lTGVmdCE9PXVuZGVmaW5lZCl7XG4gICAgcG9seWdvbmUubGluZXMubGluZUxlZnQuYS54ID0gTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4Kyh3aWR0aCotMSkvMikteCkgLSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSAqICgoeSsoaGVpZ2h0Ki0xKS8yKS15KSt4O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0LmEueSA9IE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCsod2lkdGgqLTEpLzIpLXgpICsgTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeSsoaGVpZ2h0Ki0xKS8yKS15KSt5O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0LmIueCA9IE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCsod2lkdGgqLTEpLzIpLXgpIC0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkgKiAoKHkraGVpZ2h0LzIpLXkpK3g7XG4gICAgcG9seWdvbmUubGluZXMubGluZUxlZnQuYi55ID0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4Kyh3aWR0aCotMSkvMikteCkgKyBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5K2hlaWdodC8yKS15KSt5O1xuICAgIH1cbiAgICAgICAgXG5cbiAgICBpZihwb2x5Z29uZS5saW5lcy5saW5lUmlnaHQhPT11bmRlZmluZWQpe1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVSaWdodC5hLnggPSBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrd2lkdGgvMikteCkgLSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSAqICgoeSsoaGVpZ2h0Ki0xKS8yKS15KSt4O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVSaWdodC5hLnkgPSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrd2lkdGgvMikteCkgKyBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5KyhoZWlnaHQqLTEpLzIpLXkpK3k7XG4gICAgcG9seWdvbmUubGluZXMubGluZVJpZ2h0LmIueCA9IE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCt3aWR0aC8yKS14KSAtIE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApICogKCh5K2hlaWdodC8yKS15KSt4O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVSaWdodC5iLnkgPSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrd2lkdGgvMikteCkgKyBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5K2hlaWdodC8yKS15KSt5O1xuXG4gICAgfVxuICAgIFxuICAgICAgICBcbiAgICBpZihwb2x5Z29uZS5saW5lcy5saW5lQm90dG9tIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgIC8vIGNvcyh0aGV0YSkgKiAocHgtb3gpIC0gc2luKHRoZXRhKSAqIChweS1veSkgKyBveFxuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVCb3R0b20uYS54ID0gTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4Kyh3aWR0aCotMSkvMikteCkgLSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSAqICgoeStoZWlnaHQvMikteSkreDtcbiAgICAgICAgICAgICAgICAgLy8gc2luKHRoZXRhKSAqIChweC1veCkgKyBjb3ModGhldGEpICogKHB5LW95KSArIG95XG4gICAgcG9seWdvbmUubGluZXMubGluZUJvdHRvbS5hLnkgPSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrKHdpZHRoKi0xKS8yKS14KSArIE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkraGVpZ2h0LzIpLXkpK3k7XG4gICAgcG9seWdvbmUubGluZXMubGluZUJvdHRvbS5iLnggPSBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrd2lkdGgvMikteCkgLSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5K2hlaWdodC8yKS15KSt4O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVCb3R0b20uYi55ID0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4K3dpZHRoLzIpLXgpICsgTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeStoZWlnaHQvMikteSkreTtcbiAgICB9XG5cbiAgIC8vIGRlYnVnZ2VyOyAgICAgICAgICAgIFxufSx7Y29tcG9uZW50cyA6IFtcInBvc2l0aW9uXCIsXCJzaXplXCIsXCJwb2x5Z29uZVwiXX0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXM7IFxuIiwidmFyIFB1cHBldHMgICAgPSByZXF1aXJlKFwiLi4vbGlicy9wdXBwZXRzXCIpO1xudmFyIGNhbnZhc0NvbmYgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9jb25maWdDYW52YXNcIik7XG5cbi8vIHB1cHBldCBTeXN0ZW0gRHJhdyBcblB1cHBldHMuc3lzdGVtKFwiZHJhd1wiLGZ1bmN0aW9uKHBvbHlnb25lLHJlbmRlcixzaXplKXtcbiAgICBpZihyZW5kZXIuY3R4ICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICB2YXIgY3R4ICAgICAgICAgPSByZW5kZXIuY3R4LFxuICAgICAgICAgICAgc3Ryb2tlY29sb3IgPSByZW5kZXIuU3Ryb2tlY29sb3IsXG4gICAgICAgICAgICBmaWxsY29sb3IgICA9IHJlbmRlci5GaWxsY29sb3IsXG4gICAgICAgICAgICBsaW5lVG9wICAgICA9IHBvbHlnb25lLmxpbmVzLmxpbmVUb3AsXG4gICAgICAgICAgICBsaW5lTGVmdCAgICA9IHBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0LFxuICAgICAgICAgICAgbGluZVJpZ2h0ICAgPSBwb2x5Z29uZS5saW5lcy5saW5lUmlnaHQsXG4gICAgICAgICAgICBsaW5lQm90dG9tICA9IHBvbHlnb25lLmxpbmVzLmxpbmVCb3R0b207XG5cblxuICAgICAgICAgICAgLy8geCAgICAgICAgICAgPSBwb3NpdGlvbi54LFxuICAgICAgICAgICAgLy8geSAgICAgICAgICAgPSBwb3NpdGlvbi55LFxuICAgICAgICAgICAgLy8gYW5nbGUgICAgICAgPSBwb3NpdGlvbi5hbmdsZSxcbiAgICAgICAgICAgIC8vIHdpZHRoICAgICAgID0gc2l6ZS53aWR0aCxcbiAgICAgICAgICAgIC8vIGhlaWdodCAgICAgID0gc2l6ZS5oZWlnaHQ7XG4gICAgICAgIGlmKGZpbGxjb2xvciE9PXVuZGVmaW5lZClcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGU9ZmlsbGNvbG9yO1xuICAgICAgICBpZihzdHJva2Vjb2xvciE9PXVuZGVmaW5lZClcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZT1zdHJva2Vjb2xvcjtcblxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIC8vIG1pc2UgZW4gcGxhY2UgZGUgbCdhbmdsZVxuICAgICAgICAvLyBjdHguc2F2ZSgpO1xuICAgICAgICAvLyAvL2RlcGxhY2VtZW50IHZlcnMgbCdvYmpldCBwYXIgcmFwcG9ydCDDoCBsYSBjYW1lcmFcbiAgICAgICAgLy8gY3R4LnRyYW5zbGF0ZSh4LHkpO1xuICAgICAgICAvLyAvL3JvdGF0ZSBkdSBjYW52YXMgcGFyIEwnYW5nbGUgZGUgbCdvYmpldCB1bml0eVxuICAgICAgICAvLyBjdHgucm90YXRlKGFuZ2xlKk1hdGguUEkvMTgwKTtcbiAgICAgICAgLy9kZXNzaW5zIGR1IHJlY3RhbmdsZSBieSBsaW5lcyBmcm9tIHBvc2l0aW9uIHggYW5kIHlcbiAgICAgICAgLy8gY3R4Lm1vdmVUbyh4Kyh3aWR0aCotMSkvMix5KyhoZWlnaHQqLTEpLzIpO1xuICAgICAgICAvLyBjdHgubGluZVRvKHgrd2lkdGgseSsoaGVpZ2h0Ki0xKS8yKTtcbiAgICAgICAgLy8gY3R4LmxpbmVUbyh4K3dpZHRoLHkraGVpZ2h0KTtcbiAgICAgICAgLy8gY3R4LmxpbmVUbyh4Kyh3aWR0aCotMSkvMix5K2hlaWdodCk7XG4gICAgICAgIC8vIGN0eC5saW5lVG8oeCsod2lkdGgqLTEpLzIseSsoaGVpZ2h0Ki0xKS8yKTtcbiAgICAgICAgXG4gICAgICAgIGN0eC5tb3ZlVG8obGluZVRvcC5hLngsbGluZVRvcC5hLnkpO1xuICAgICAgICBjdHgubGluZVRvKGxpbmVSaWdodC5hLngsbGluZVJpZ2h0LmEueSk7XG4gICAgICAgIGN0eC5saW5lVG8obGluZUJvdHRvbS5iLngsbGluZUJvdHRvbS5iLnkpO1xuICAgICAgICBjdHgubGluZVRvKGxpbmVMZWZ0LmIueCxsaW5lTGVmdC5iLnkpO1xuICAgICAgICBjdHgubGluZVRvKGxpbmVMZWZ0LmEueCxsaW5lTGVmdC5hLnkpO1xuXG4gICAgICAgIC8vIG9uIHJlc3RhdXJlIGxlIGNhbnZhcyBhIHNvbiBldGF0IG9yaWdpbmFsLlxuICAgICAgICAvLyBjdHgucmVzdG9yZSgpO1xuICAgICAgICBcbiAgICAgICAgLy8gb24gYXJyZXRlIGRlIGRlc3NpbmVyXG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIH0gICBcbn0se2NvbXBvbmVudHMgOiBbJ3BvbHlnb25lJywncmVuZGVyJywnc2l6ZSddfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpczsgXG4iLCJ3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBHYW1lID0gcmVxdWlyZSgnLi9sb2FkZXIvZ2FtZScpO1xuICAgIHZhciByZXF1ZXN0QW5pbUZyYW1lID0gcmVxdWlyZSgnLi9saWJzL3JlcXVlc3RBbmltYXRpb25GcmFtZScpO1xuXG4gICAgKGZ1bmN0aW9uIGdhbWVsb29wKCl7ICAgIFxuICAgICAgICAvLyBjbGVhciBvZiBjYW52YXMgIFxuICAgICAgICBHYW1lLmN0eC5jbGVhclJlY3QoMCwgMCwgR2FtZS5jYW52YXMud2lkdGgsR2FtZS5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgR2FtZS5QdXBwZXRzLnJ1bigpO1xuICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKGdhbWVsb29wKTtcblxuICAgIH0pKCk7XG59OyIsIi8vIGNyZWF0ZSBieSA6IHdpbmNrZWxsIGJlbmphbWluXHJcbi8qXHJcbipjbGFzcyBvZiBpbnB1dCBldmVudCBnZXN0aW9uLlxyXG4qdGhpcyBsaWIgY2FuIGJlIHVzZSBmb3IgbWFuYWdlIHNpbXBsZXMgaW5wdXRzIHdpdGggbXVsdGkgZXZlbnRzXHJcbipOZWVkIHRvIGJlIGluc3RhbmNpYXRlIGluIGluaXQgb2YgeW91ciBnYW1lLlxyXG5cclxuKkhPVyBUTyBCSU5EIEEgRVZFTlQgVE8gQSBJTlBVVDpcclxuKiAgIEFkZCBpbiB5b3VyIGFycmF5IGtleUJpbmQgbGlrZSBUaGF0IDogIHZhciBrZXlCaW5kID0geyBLZXlOdW1iZXJPZklucHV0IDogIHsgZXZlbnRUb0NhbGwgOiBmdW5jdGlvblRvQWN0aXZlKCkgfSB9XHJcbiAgICBcclxuXHJcbipIT1cgVE8gSU5TVEFOVElBVEUgRWFzeUlucHV0IDogXHJcbiAgICBcclxuICAgICogdmFyIHdoYXRZb3VXYW50ID0gbmV3IEVhc3lJbnB1dChmaXJzdCkgQXJndW1lbnQgOiAtLT4gZmlyc3QgOiBvYmplY3Qgb2Yga2V5QmluZGluZyx3aXRoIGV2ZW50IGFuZCBmdW5jdGlvbnMgY2FsbC5cclxuXHJcbiAgICBcclxuXHJcbipNZXRob2RlcyBvZiBFYXN5SW5wdXQgOiBcclxuKiAgIGFkZEV2ZW50KGZpcnN0LHNlY29uZCkgMiBwYXJhbXMgbmVjZXNzYXJ5ICAgIC0tPiBmaXJzdCA6IHN0cmluZyBvZiB0aGUgZXZlbnQgd2hvIHdpbGwgYmUgYWRkIChrZXlkb3duLGtleXVwLG1vdXNlbW92ZSBldGMuLi4pOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tPiBzZWNvbmQgOiBkb20gb2JqZWN0IGxpa2Ugd2luZG93IG9yIGEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5IG9mIHdoYXQgeW91IHdhbnQ7XHJcbiAgICB1c2UgOiBmb3IgYWRkIGV2ZW50IGxpc3Rlbm5lciBvbiBvYmplY3Q7XHJcbiogICByZW1vdmVFdmVudChmaXJzdCxzZWNvbmQpIDIgcGFyYW1zIG5lY2Vzc2FyeSAtLT4gZmlyc3QgOiBzdHJpbmcgb2YgdGhlIGV2ZW50IHdobyB3aWxsIGJlIHJlbW92ZSAoa2V5ZG93bixrZXl1cCxtb3VzZW1vdmUgZXRjLi4uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tPiBzZWNvbmQgOiBkb20gb2JqZWN0IHdobyBoYWQgZXZlbnQgbGlzdGVubmVyO1xyXG4gICAgdXNlIDogZm9yIHJlbW92ZSBldmVudCBsaXN0ZW5uZXIgb2YgYW4gb2JqZWN0O1xyXG4qICAgc2V0S2V5QmluZChmaXJzdCxzZWNvbmQpIDIgcGFyYW1zIG5lY2Vzc2FyeSAgLS0+IGZpcnN0IDogaW50ZWdlciBvZiB0aGUga2V5IHlvdSB3YW50IHRvIGJpbmQgd2l0aCBldmVudChzKS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0+IHNlY29uZCA6IG9iamVjdCBvZiBldmVudChzKSB5b3Ugd2FudCB0byB1c2UgYW5kIGZ1bmN0aW9uIGNhbGwgYnkgdGhpcyBldmVudDoge2tleXByZXNzIDogZnVuY3Rpb24oKXt9LCBrZXlkb3duIDogZnVuY3Rpb25XaG9Eb1NvbWV0aGluZyB9O1xyXG4gICAgdXNlIDogZm9yIGFkZCBvciBlZGl0IG9uZSBrZXkgd2l0aCBldmVudChzKTsgICAgXHJcblxyXG4qICAgZ2V0S2V5c0JpbmQoKSBcclxuICAgIHVzZSA6IHJldHVybiB5b3Ugb2JqZWN0IHdobyBjb250YWluIGFsbCBrZXlzIGJpbmRpbmcgYW5kIGFsbCBldmVudHMgY2FsbCBmb3IgdGhvc2Uga2V5cy5cclxuKi9cclxudmFyIEVhc3lJbnB1dCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdmFyIGtleSA9IHt9O1xyXG4gICAgdmFyIERpY3Rvbm5hcnlLZXkgPSAge1xyXG4gICAgICAgIDA6IFwiXFxcXFwiLFxyXG4gICAgICAgIDg6IFwiYmFja3NwYWNlXCIsXHJcbiAgICAgICAgOTogXCJ0YWJcIixcclxuICAgICAgICAxMjogXCJudW1cIixcclxuICAgICAgICAxMzogXCJlbnRlclwiLFxyXG4gICAgICAgIDE2OiBcInNoaWZ0XCIsXHJcbiAgICAgICAgMTc6IFwiY3RybFwiLFxyXG4gICAgICAgIDE4OiBcImFsdFwiLFxyXG4gICAgICAgIDE5OiBcInBhdXNlXCIsXHJcbiAgICAgICAgMjA6IFwiY2Fwc1wiLFxyXG4gICAgICAgIDI3OiBcImVzY1wiLFxyXG4gICAgICAgIDMyOiBcInNwYWNlXCIsXHJcbiAgICAgICAgMzM6IFwicGFnZXVwXCIsXHJcbiAgICAgICAgMzQ6IFwicGFnZWRvd25cIixcclxuICAgICAgICAzNTogXCJlbmRcIixcclxuICAgICAgICAzNjogXCJob21lXCIsXHJcbiAgICAgICAgMzc6IFwibGVmdFwiLFxyXG4gICAgICAgIDM4OiBcInVwXCIsXHJcbiAgICAgICAgMzk6IFwicmlnaHRcIixcclxuICAgICAgICA0MDogXCJkb3duXCIsXHJcbiAgICAgICAgNDQ6IFwicHJpbnRcIixcclxuICAgICAgICA0NTogXCJpbnNlcnRcIixcclxuICAgICAgICA0NjogXCJkZWxldGVcIixcclxuICAgICAgICA0ODogXCIwXCIsXHJcbiAgICAgICAgNDk6IFwiMVwiLFxyXG4gICAgICAgIDUwOiBcIjJcIixcclxuICAgICAgICA1MTogXCIzXCIsXHJcbiAgICAgICAgNTI6IFwiNFwiLFxyXG4gICAgICAgIDUzOiBcIjVcIixcclxuICAgICAgICA1NDogXCI2XCIsXHJcbiAgICAgICAgNTU6IFwiN1wiLFxyXG4gICAgICAgIDU2OiBcIjhcIixcclxuICAgICAgICA1NzogXCI5XCIsXHJcbiAgICAgICAgNjU6IFwiYVwiLFxyXG4gICAgICAgIDY2OiBcImJcIixcclxuICAgICAgICA2NzogXCJjXCIsXHJcbiAgICAgICAgNjg6IFwiZFwiLFxyXG4gICAgICAgIDY5OiBcImVcIixcclxuICAgICAgICA3MDogXCJmXCIsXHJcbiAgICAgICAgNzE6IFwiZ1wiLFxyXG4gICAgICAgIDcyOiBcImhcIixcclxuICAgICAgICA3MzogXCJpXCIsXHJcbiAgICAgICAgNzQ6IFwialwiLFxyXG4gICAgICAgIDc1OiBcImtcIixcclxuICAgICAgICA3NjogXCJsXCIsXHJcbiAgICAgICAgNzc6IFwibVwiLFxyXG4gICAgICAgIDc4OiBcIm5cIixcclxuICAgICAgICA3OTogXCJvXCIsXHJcbiAgICAgICAgODA6IFwicFwiLFxyXG4gICAgICAgIDgxOiBcInFcIixcclxuICAgICAgICA4MjogXCJyXCIsXHJcbiAgICAgICAgODM6IFwic1wiLFxyXG4gICAgICAgIDg0OiBcInRcIixcclxuICAgICAgICA4NTogXCJ1XCIsXHJcbiAgICAgICAgODY6IFwidlwiLFxyXG4gICAgICAgIDg3OiBcIndcIixcclxuICAgICAgICA4ODogXCJ4XCIsXHJcbiAgICAgICAgODk6IFwieVwiLFxyXG4gICAgICAgIDkwOiBcInpcIixcclxuICAgICAgICA5MTogXCJjbWRcIixcclxuICAgICAgICA5MjogXCJjbWRcIixcclxuICAgICAgICA5MzogXCJjbWRcIixcclxuICAgICAgICA5NjogXCJudW1fMFwiLFxyXG4gICAgICAgIDk3OiBcIm51bV8xXCIsXHJcbiAgICAgICAgOTg6IFwibnVtXzJcIixcclxuICAgICAgICA5OTogXCJudW1fM1wiLFxyXG4gICAgICAgIDEwMDogXCJudW1fNFwiLFxyXG4gICAgICAgIDEwMTogXCJudW1fNVwiLFxyXG4gICAgICAgIDEwMjogXCJudW1fNlwiLFxyXG4gICAgICAgIDEwMzogXCJudW1fN1wiLFxyXG4gICAgICAgIDEwNDogXCJudW1fOFwiLFxyXG4gICAgICAgIDEwNTogXCJudW1fOVwiLFxyXG4gICAgICAgIDEwNjogXCJudW1fbXVsdGlwbHlcIixcclxuICAgICAgICAxMDc6IFwibnVtX2FkZFwiLFxyXG4gICAgICAgIDEwODogXCJudW1fZW50ZXJcIixcclxuICAgICAgICAxMDk6IFwibnVtX3N1YnRyYWN0XCIsXHJcbiAgICAgICAgMTEwOiBcIm51bV9kZWNpbWFsXCIsXHJcbiAgICAgICAgMTExOiBcIm51bV9kaXZpZGVcIixcclxuICAgICAgICAxMjQ6IFwicHJpbnRcIixcclxuICAgICAgICAxNDQ6IFwibnVtXCIsXHJcbiAgICAgICAgMTQ1OiBcInNjcm9sbFwiLFxyXG4gICAgICAgIDE4NjogXCI7XCIsXHJcbiAgICAgICAgMTg3OiBcIj1cIixcclxuICAgICAgICAxODg6IFwiLFwiLFxyXG4gICAgICAgIDE4OTogXCItXCIsXHJcbiAgICAgICAgMTkwOiBcIi5cIixcclxuICAgICAgICAxOTE6IFwiL1wiLFxyXG4gICAgICAgIDE5MjogXCJgXCIsXHJcbiAgICAgICAgMjE5OiBcIltcIixcclxuICAgICAgICAyMjA6IFwiXFxcXFwiLFxyXG4gICAgICAgIDIyMTogXCJdXCIsXHJcbiAgICAgICAgMjIyOiBcIlxcJ1wiLFxyXG4gICAgICAgIDIyMzogXCJgXCIsXHJcbiAgICAgICAgMjI0OiBcImNtZFwiLFxyXG4gICAgICAgIDIyNTogXCJhbHRcIixcclxuICAgICAgICA1NzM5MjogXCJjdHJsXCIsXHJcbiAgICAgICAgNjMyODk6IFwibnVtXCJcclxuICAgIH07XHJcbiAgICBFYXN5SW5wdXQucHJvdG90eXBlLmFkZEV2ZW50ID0gZnVuY3Rpb24oaW5wdXQgLCB0YXJnZXQpXHJcbiAgICB7ICAgXHJcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoaW5wdXQsIHRoaXMuZnVuY3Rpb25DYWxsLGZhbHNlKTtcclxuICAgIH07XHJcbiAgICBFYXN5SW5wdXQucHJvdG90eXBlLmZ1bmN0aW9uQ2FsbCA9IGZ1bmN0aW9uKGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYoa2V5Lmhhc093blByb3BlcnR5KGUua2V5Q29kZSkgJiYgdHlwZW9mIGtleVtlLmtleUNvZGVdW2UudHlwZV0gPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAga2V5W2Uua2V5Q29kZV1bZS50eXBlXShlKTtcclxuICAgIH07XHJcbiAgICBFYXN5SW5wdXQucHJvdG90eXBlLnJlbW92ZUV2ZW50ID0gZnVuY3Rpb24oaW5wdXQgLCB0YXJnZXQpXHJcbiAgICB7XHJcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoaW5wdXQsdGhpcy5mdW5jdGlvbkNhbGwsZmFsc2UpO1xyXG4gICAgfTtcclxuICAgIEVhc3lJbnB1dC5wcm90b3R5cGUuc2V0S2V5QmluZCA9IGZ1bmN0aW9uKHN1Ym1pdHRlZEtleSAsIG9iamVjdClcclxuICAgIHtcclxuICAgICAgICBpZihrZXkuaGFzT3duUHJvcGVydHkoc3VibWl0dGVkS2V5KSA9PT0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0eXBlb2Ygc3VibWl0dGVkS2V5ID09PSdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgdmFyIHN1Ym1pdHRlZEtleSA9IHRoaXMuZmluZEluS2V5KHN1Ym1pdHRlZEtleSk7XHJcblxyXG4gICAgICAgICAgICBrZXlbc3VibWl0dGVkS2V5XSA9IG9iamVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihrZXkuaGFzT3duUHJvcGVydHkoc3VibWl0dGVkS2V5KSlcclxuICAgICAgICB7ICBcclxuICAgICAgICAgICAgaWYodHlwZW9mIHN1Ym1pdHRlZEtleSA9PT0nc3RyaW5nJylcclxuICAgICAgICAgICAgICAgIHZhciBzdWJtaXR0ZWRLZXkgPSB0aGlzLmZpbmRJbktleShzdWJtaXR0ZWRLZXkpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gb2JqZWN0KVxyXG4gICAgICAgICAgICAgICAga2V5W3N1Ym1pdHRlZEtleV1baW5kZXhdID0gb2JqZWN0W2luZGV4XTsgXHJcbiAgICAgICAgfSBcclxuICAgIH07XHJcbiAgICBFYXN5SW5wdXQucHJvdG90eXBlLmdldEtleXNCaW5kID0gZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBrZXk7XHJcbiAgICB9O1xyXG4gICAgRWFzeUlucHV0LnByb3RvdHlwZS5maW5kSW5LZXkgPSBmdW5jdGlvbihzdWJtaXR0ZWRLZXkpe1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIGZvciggaSBpbiBEaWN0b25uYXJ5S2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChEaWN0b25uYXJ5S2V5W2ldID09PSBzdWJtaXR0ZWRLZXkpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gaTsgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFYXN5SW5wdXQ7XHJcbiIsIlB1cHBldHMgPSBmdW5jdGlvbiAoY29uZmlnKVxyXG57XHJcbiAgICB0aGlzLkFSUkFZID0gW107XHJcbiAgICB0aGlzLlN5c3RlbXMgPVxyXG4gICAge1xyXG4gICAgICAgIENPTVBPTkVOVFMgOiBbXSxcclxuICAgICAgICBvcmRlciA6IFtdLFxyXG4gICAgICAgIGxpc3QgOiB7fSxcclxuICAgICAgICBydW5zIDogMCxcclxuXHJcbiAgICAgICAgbGF1bmNoU3lzdGVtcyA6IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBuYkNvbGxlY3Rpb25zID0gUHVwcGV0cy5FbnRpdGllcy5vcmRlckNvbGxlY3Rpb25zLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIHB1cHB5LCBwdXBwbywgaTtcclxuICAgICAgICAgICAgdmFyIHN5c3RlbSwgaWQ7XHJcbiAgICAgICAgICAgIHZhciBvcmRlckxlbmd0aCA9IHRoaXMub3JkZXIubGVuZ3RoO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHB1cHB5ID0gMDsgcHVwcHkgPCBuYkNvbGxlY3Rpb25zOyBwdXBweSs9MSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBQdXBwZXRzLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnNbcHVwcHldO1xyXG4gICAgICAgICAgICAgICAgZm9yKHB1cHBvIGluIFB1cHBldHMuRW50aXRpZXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBQdXBwZXRzLkVudGl0aWVzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dW3B1cHBvXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBvcmRlckxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBzeXN0ZW0gPSB0aGlzLmxpc3RbdGhpcy5vcmRlcltpXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaWYoc3lzdGVtICE9PSB1bmRlZmluZWQgJiYgKHN5c3RlbS5kZWxheSA9PT0gdW5kZWZpbmVkIHx8IHN5c3RlbS5kZWxheSA9PT0gbnVsbCB8fCB0aGlzLnJ1bnMgJSBzeXN0ZW0uZGVsYXkgPT09IDApKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsbFN5c3RlbShpZCwgc3lzdGVtLmNvbXBvbmVudHMsIHN5c3RlbS5tZXRob2QsIHN5c3RlbS5kYXRhKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucnVucysrO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FsbFN5c3RlbSA6IGZ1bmN0aW9uKGlkLCBsaXN0T2ZDb21wb25lbnRzLCBtZXRob2QsIGRhdGEpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGVudGl0eSA9IFB1cHBldHMuRW50aXRpZXMubGlzdFtpZF07XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRzID0gdGhpcy5DT01QT05FTlRTO1xyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudDtcclxuICAgICAgICAgICAgaWYoZW50aXR5ICE9PSBudWxsICYmIGVudGl0eSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBsaXN0T2ZDb21wb25lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IGxpc3RPZkNvbXBvbmVudHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZW50aXR5W2NvbXBvbmVudF0gPT09IG51bGwgfHwgZW50aXR5W2NvbXBvbmVudF0gPT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICBQdXBwZXRzLkNvbXBvbmVudHMubGlzdD09PSBudWxsIHx8IFB1cHBldHMuQ29tcG9uZW50cy5saXN0ID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIVB1cHBldHMuQ29tcG9uZW50cy5saXN0W2NvbXBvbmVudF1bZW50aXR5W2NvbXBvbmVudF1dLmVuYWJsZWQpIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01QT05FTlRTLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChQdXBwZXRzLkNvbXBvbmVudHMubGlzdFtjb21wb25lbnRdW2VudGl0eVtjb21wb25lbnRdXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLnB1c2goaWQpO1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kLmFwcGx5KGRhdGEsIGNvbXBvbmVudHMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5DT01QT05FTlRTLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvYWQgOiBmdW5jdGlvbihuYW1lLCBtZXRob2QsIGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmxpc3RbbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmxpc3RbbmFtZV0gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJOYW1lIFwiK25hbWUrXCIgb3ZlcnJpZGVkIGJ5IHN5c3RlbSBcIittZXRob2QpO1xyXG4gICAgICAgICAgICBpZihkYXRhID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGNvbnNvbGUuZXJyb3IoXCJkYXRhIGFyZ3VtZW50IGNhbiBub3QgYmUgdW5kZWZpbmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxpc3RbbmFtZV0gPSB7IGNvbXBvbmVudHMgOiBkYXRhLmNvbXBvbmVudHMsIG1ldGhvZCA6IG1ldGhvZCAsIGRlbGF5IDogZGF0YS5kZWxheSwgZGF0YSA6IGRhdGF9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGluZGV4U3lzdGVtID0gdGhpcy5vcmRlci5pbmRleE9mKG5hbWUpO1xyXG4gICAgICAgICAgICBpZihpbmRleFN5c3RlbSA+PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmRlci5zcGxpY2UoaW5kZXhTeXN0ZW0sIDEpO1xyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mKGRhdGEucG9zaXRpb24pID09PSAnbnVtYmVyJylcclxuICAgICAgICAgICAgICAgIHRoaXMub3JkZXIuc3BsaWNlKGRhdGEucG9zaXRpb24sIDAsIG5hbWUpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yZGVyLnB1c2gobmFtZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuRW50aXRpZXMgPVxyXG4gICAge1xyXG4gICAgICAgIG1vZGVscyA6IHt9LFxyXG4gICAgICAgIGxpc3QgOiB7fSxcclxuICAgICAgICBjb2xsZWN0aW9ucyA6IHt9LFxyXG4gICAgICAgIG9yZGVyQ29sbGVjdGlvbnMgOiBbXSxcclxuICAgICAgICBsZW5ndGggOiAwLFxyXG5cclxuICAgICAgICBjb3VudCA6IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGVudGl0eSBpbiB0aGlzLmxpc3QpIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saXN0Lmhhc093blByb3BlcnR5KGVudGl0eSkpIFxyXG4gICAgICAgICAgICAgICAgICAgKytjb3VudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICByZXR1cm4gY291bnQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjcmVhdGVFbnRpdHkgOiBmdW5jdGlvbihtb2RlbCwgY29uc3RydWN0b3IsIGNvbGxlY3Rpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLm1vZGVsc1ttb2RlbF0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRW50aXR5IFwiK21vZGVsK1wiIGRvZXNuJ3QgZXhpc3QgaW4gUHVwcGV0LCB5b3UgaGF2ZSB0byBsb2FkIGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1vZGVsID0gdGhpcy5tb2RlbHNbbW9kZWxdO1xyXG4gICAgICAgICAgICB2YXIgZW50aXR5ID0ge307XHJcbiAgICAgICAgICAgIHZhciBhcmd1bWVudCA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgbGVuZ3RoQ29tcG9uZW50cyA9IG1vZGVsLmNvbXBvbmVudHMubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgaSwgbywgaWQ7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGhDb21wb25lbnRzOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBtb2RlbC5jb21wb25lbnRzW2ldID09PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSBPYmplY3Qua2V5cyhtb2RlbC5jb21wb25lbnRzW2ldKVswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YoY29uc3RydWN0b3JbY29tcG9uZW50XSkgIT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvcltjb21wb25lbnRdID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobyBpbiBtb2RlbC5jb21wb25lbnRzW2ldW2NvbXBvbmVudF0pXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb25zdHJ1Y3Rvcltjb21wb25lbnRdW29dICE9PSB1bmRlZmluZWQgJiYgY29uc3RydWN0b3JbY29tcG9uZW50XVtvXSAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmNvbXBvbmVudHNbaV1bY29tcG9uZW50XVtvXSA9IGNvbnN0cnVjdG9yW2NvbXBvbmVudF1bb107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yW2NvbXBvbmVudF1bb10gPSBtb2RlbC5jb21wb25lbnRzW2ldW2NvbXBvbmVudF1bb107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudCA9IG1vZGVsLmNvbXBvbmVudHNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoY29uc3RydWN0b3JbY29tcG9uZW50XSAhPT0gdW5kZWZpbmVkICYmIGNvbnN0cnVjdG9yW2NvbXBvbmVudF0gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBQdXBwZXRzLkNvbXBvbmVudHMuYWRkQ29tcG9uZW50KHRoaXMubGVuZ3RoLCBjb21wb25lbnQsIGNvbnN0cnVjdG9yW2NvbXBvbmVudF0sIGNvbnN0cnVjdG9yW2NvbXBvbmVudF0uZW5hYmxlZCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBQdXBwZXRzLkNvbXBvbmVudHMuYWRkQ29tcG9uZW50KHRoaXMubGVuZ3RoLCBjb21wb25lbnQsIGNvbnN0cnVjdG9yW2NvbXBvbmVudF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudGl0eVtjb21wb25lbnRdID0gaWQ7XHJcbiAgICAgICAgICAgICAgICBhcmd1bWVudFtjb21wb25lbnRdID0gUHVwcGV0cy5Db21wb25lbnRzLmxpc3RbY29tcG9uZW50XVtpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWQgPSB0aGlzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5saXN0W2lkXSA9IGVudGl0eTtcclxuICAgICAgICAgICAgaWYodGhpcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dW2lkXSA9IFwiXCIraWQrXCJcIjtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9ucy53b3JsZFtpZF0gPSBcIlwiK2lkK1wiXCI7XHJcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGgtMTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZENvbXBvbmVudCA6IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50LCBzZXR0aW5ncywgZW5hYmxlZCwgdW5kZWZpbmVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkoZW50aXR5KSlcclxuICAgICAgICAgICAgICAgIGVudGl0eSA9IFtlbnRpdHldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGlkO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciBwdXBweSA9IDA7IHB1cHB5IDwgZW50aXR5Lmxlbmd0aDsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMubGlzdFtlbnRpdHlbcHVwcHldXS5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gUHVwcGV0cy5Db21wb25lbnRzLmFkZENvbXBvbmVudChlbnRpdHlbcHVwcHldLCBjb21wb25lbnQsIHNldHRpbmdzLCBlbmFibGVkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RbZW50aXR5W3B1cHB5XV1bY29tcG9uZW50XSA9IGlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZUNvbXBvbmVudCA6IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50LCB1bmRlZmluZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShlbnRpdHkpKVxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gW2VudGl0eV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgaWQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIHB1cHB5ID0gMDsgcHVwcHkgPCBlbnRpdHkubGVuZ3RoOyBwdXBweSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxpc3RbZW50aXR5W3B1cHB5XV0uaGFzT3duUHJvcGVydHkoY29tcG9uZW50KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IHRoaXMubGlzdFtlbnRpdHlbcHVwcHldXVtjb21wb25lbnRdO1xyXG4gICAgICAgICAgICAgICAgICAgIFB1cHBldHMuQ29tcG9uZW50cy5yZW1vdmVDb21wb25lbnQoaWQsIGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMubGlzdFtlbnRpdHlbcHVwcHldXVtjb21wb25lbnRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVFbnRpdHkgOiBmdW5jdGlvbihlbnRpdHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZW50aXR5ID09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkgPSBlbnRpdHkuc3BsaXQoJy4nKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGVudGl0eSkpXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkgPSBbZW50aXR5XTtcclxuXHJcbiAgICAgICAgICAgIHZhciBuYiA9IGVudGl0eS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBwdXBweTtcclxuICAgICAgICAgICAgdmFyIGUsIHB1cHBvO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHB1cHB5ID0gMDsgcHVwcHkgPCBuYjsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZSA9IGVudGl0eVtwdXBweV07XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxpc3RbZV0gIT09IG51bGwgJiYgdGhpcy5saXN0W2VdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHB1cHBvIGluIHRoaXMuY29sbGVjdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbGxlY3Rpb25zW3B1cHBvXVtlXSAhPT0gbnVsbCAmJiB0aGlzLmNvbGxlY3Rpb25zW3B1cHBvXVtlXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5jb2xsZWN0aW9uc1twdXBwb11bZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5saXN0W2VdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzd2l0Y2hDb2xsZWN0aW9uIDogZnVuY3Rpb24oZW50aXR5LCBjb2xsZWN0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uc10gIT09IG51bGwgJiYgdGhpcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uc10gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkoZW50aXR5KSlcclxuICAgICAgICAgICAgICAgIGVudGl0eSA9IFtlbnRpdHldO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgcHVwcHk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW92ZUVudGl0eSwgcHVwcG87XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvcihwdXBweSA9IDA7IHB1cHB5IDwgZW50aXR5Lmxlbmd0aDsgcHVwcHkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgZW50aXR5W3B1cHB5XSA9PSBcIm51bWJlclwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlRW50aXR5ID0gXCJcIitlbnRpdHlbcHVwcHldK1wiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlRW50aXR5ID0gZW50aXR5W3B1cHB5XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHB1cHBvIGluIHRoaXMuY29sbGVjdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbGxlY3Rpb25zW3B1cHBvXS5pbmRleE9mKG1vdmVFbnRpdHkpID4gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbGxlY3Rpb25zW3B1cHBvXVttb3ZlRW50aXR5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbl1bbW92ZUVudGl0eV0gPSBtb3ZlRW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29weSA6IGZ1bmN0aW9uKGVudGl0eSwgbnVtYmVyLCBjb2xsZWN0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZW50aXR5ID0gYXJyYXl6YXRpb24oZW50aXR5KTtcclxuICAgICAgICAgICAgdmFyIG5iID0gZW50aXR5Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBudW1iZXIgIT09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBudW1iZXIgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoY29sbGVjdGlvbiA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBjb2xsZWN0aW9uICE9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IFwid29ybGRcIjtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgcHVwcHkgPSAwOyBwdXBweSA8IG5iOyBwdXBweSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29weSA9IGVudGl0eVtwdXBweV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcHVwcG8sIHB1cHBhO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0NvcHksIGNvbnN0cnVjdG9yO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxpc3RbY29weV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmxpc3RbY29weV0gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHB1cHBvID0gMDsgcHVwcG8gPCBudW1iZXI7IHB1cHBvKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmxpc3RbY29weV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHB1cHBhIGluIG5ld0NvcHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gUHVwcGV0cy5Db21wb25lbnRzLmxpc3RbcHVwcGFdW25ld0NvcHlbcHVwcGFdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvcHlbcHVwcGFdID0gUHVwcGV0cy5Db21wb25lbnRzLmFkZENvbXBvbmVudChjb3B5LCBwdXBwYSwgY29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdFt0aGlzLmxlbmd0aF0gPSBuZXdDb3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmluZCA6IGZ1bmN0aW9uKGNsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjbHVlID0gdGhpcy5fYW5hbHlzZVN0cmluZyhjbHVlKTtcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzLmxpc3Q7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBjbHVlID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgcHVwcHkgaW4gbGlzdClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihsaXN0W3B1cHB5XS5oYXNPd25Qcm9wZXJ0eShjbHVlLmNsdWUpICYmIEZ1bmN0aW9uKFwib2JqZWN0XCIsIGNsdWUuY29tcGFyZSkoUHVwcGV0cy5Db21wb25lbnRzLmxpc3RbY2x1ZS5jbHVlXVtsaXN0W3B1cHB5XVtjbHVlLmNsdWVdXSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChwdXBweSk7ICAgIFxyXG4gICAgICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgcHVwcHkgaW4gbGlzdClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihsaXN0W3B1cHB5XS5oYXNPd25Qcm9wZXJ0eShjbHVlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHB1cHB5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9hbmFseXNlU3RyaW5nIDogZnVuY3Rpb24oY2x1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNsdWUgPSBjbHVlLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICAgICAgaWYoY2x1ZS5sZW5ndGggPD0gMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbHVlWzBdO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtjbHVlIDogY2x1ZVswXSwgY29tcGFyZSA6IFwiaWYob2JqZWN0LlwiK2NsdWVbMV0rXCIpe3JldHVybiB0cnVlO31lbHNle3JldHVybiBmYWxzZX1cIn07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0Q29tcG9uZW50cyA6IGZ1bmN0aW9uKGVudGl0eSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGVudGl0eSkpXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkgPSBbZW50aXR5XTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHB1cHB5LCBwdXBwbztcclxuICAgICAgICAgICAgdmFyIHJlZkNvbXAsIHJlc3VsdDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihwdXBweSA9IDA7IHB1cHB5IDwgZW50aXR5Lmxlbmd0aDsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgICAgICByZWZDb21wID0gdGhpcy5saXN0W2VudGl0eVtwdXBweV1dO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHJlZkNvbXAgIT09IHVuZGVmaW5lZCAmJiByZWZDb21wICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihwdXBwbyBpbiByZWZDb21wKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHVwcG9dID0gUHVwcGV0cy5Db21wb25lbnRzLmxpc3RbcHVwcG9dW3JlZkNvbXBbcHVwcG9dXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W3B1cHB5XSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lcmdlIDogZnVuY3Rpb24oY3JlYXRlTmV3LCBwYXJhbXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoIDwgNClcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmKHBhcmFtcyA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGVudGl0aWVzVG9NZXJnZSA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgcHVwcHksIHB1cHBvO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHB1cHB5ID0gMjsgcHVwcHkgPCBhcmd1bWVudHMubGVuZ3RoOyBwdXBweSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KGFyZ3VtZW50c1twdXBweV0pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihwdXBwbyA9IDA7IHB1cHBvIDwgYXJndW1lbnRzW3B1cHB5XS5sZW5ndGg7IHB1cHBvKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgYXJndW1lbnRzW3B1cHB5XVtwdXBwb10gPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgYXJndW1lbnRzW3B1cHB5XVtwdXBwb10gPT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0aWVzVG9NZXJnZS5wdXNoKGFyZ3VtZW50c1twdXBweV1bcHVwcG9dKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHR5cGVvZiBhcmd1bWVudHNbcHVwcHldID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGFyZ3VtZW50c1twdXBweV0gPT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdGllc1RvTWVyZ2UucHVzaChhcmd1bWVudHNbcHVwcHldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbnRpdGllc1RvTWVyZ2UgPSB0aGlzLmdldENvbXBvbmVudHMoZW50aXRpZXNUb01lcmdlKTtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2FkIDogZnVuY3Rpb24obmFtZSwgY29uc3RydWN0b3IpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLm1vZGVsc1tuYW1lXSAhPT0gdW5kZWZpbmVkICYmIHRoaXMubW9kZWxzW25hbWVdICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTmFtZSBcIituYW1lK1wiIG92ZXJyaWRlZCBieSBlbnRpdHkgXCIrY29uc3RydWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RlbHNbbmFtZV0gPSB7Y29tcG9uZW50cyA6IGNvbnN0cnVjdG9yLmNvbXBvbmVudHMsIGRhdGEgOiBjb25zdHJ1Y3Rvci5kYXRhIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuQ29tcG9uZW50cyA9XHJcbiAgICB7XHJcbiAgICAgICAgbW9kZWxzIDoge30sXHJcbiAgICAgICAgbGlzdCA6IHt9LFxyXG4gICAgICAgIGxlbmd0aCA6IHt9LFxyXG5cclxuICAgICAgICBjb3VudCA6IGZ1bmN0aW9uKGNvbXBvbmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGVsZW1lbnQgaW4gdGhpcy5saXN0W2NvbXBvbmVudF0pIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saXN0W2NvbXBvbmVudF0uaGFzT3duUHJvcGVydHkoZWxlbWVudCkpIFxyXG4gICAgICAgICAgICAgICAgICAgKytjb3VudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICByZXR1cm4gY291bnQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRDb21wb25lbnQgOiBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudCwgY29uc3RydWN0b3IsIGVuYWJsZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmxpc3RbY29tcG9uZW50XSA9PT0gbnVsbCB8fCB0aGlzLmxpc3RbY29tcG9uZW50XSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RbY29tcG9uZW50XSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGhbY29tcG9uZW50XSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMubGVuZ3RoW2NvbXBvbmVudF07XHJcbiAgICAgICAgICAgIHRoaXMubGlzdFtjb21wb25lbnRdW2lkXSA9IHRoaXMubW9kZWxzW2NvbXBvbmVudF0uY29uc3RydWN0b3IoY29uc3RydWN0b3IgfHwge30sIGVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICBpZihlbmFibGVkICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RbY29tcG9uZW50XVtpZF0uZW5hYmxlZCA9IGVuYWJsZWQ7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdFtjb21wb25lbnRdW2lkXS5lbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoW2NvbXBvbmVudF0rKztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZUNvbXBvbmVudCA6IGZ1bmN0aW9uKGlkLCBjb21wb25lbnQsIHVuZGVmaW5lZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMubGlzdFtjb21wb25lbnRdW2lkXSAhPT0gbnVsbCAmJiB0aGlzLmxpc3RbY29tcG9uZW50XVtpZF0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMubGlzdFtjb21wb25lbnRdW2lkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9hZCA6IGZ1bmN0aW9uKG5hbWUsIGNvbnN0cnVjdG9yLCBkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5tb2RlbHNbbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLm1vZGVsc1tuYW1lXSAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5hbWUgXCIrbmFtZStcIiBvdmVycmlkZWQgYnkgY29tcG9uZW50IFwiKyBjb25zdHJ1Y3Rvcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsc1tuYW1lXSA9IHtjb25zdHJ1Y3RvciA6IGNvbnN0cnVjdG9yLCBkYXRhIDogZGF0YSB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuICAgIHZhciBhcnJheXphdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIGlmKCFBcnJheS5pc0FycmF5KHZhbHVlKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBbdmFsdWVdO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uKHNlbGYpXHJcbiAgICB7XHJcbiAgICAgICAgd2luZG93LlB1cHBldHMgPSBzZWxmO1xyXG4gICAgICAgIGlmKHR5cGVvZihjb25maWcpID09PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICBzZWxmLmxvYWQoY29uZmlnKTtcclxuXHJcbiAgICAgICAgaWYoc2VsZi5FbnRpdGllcy5vcmRlckNvbGxlY3Rpb25zLmluZGV4T2YoXCJ3b3JsZFwiKSA8IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLkVudGl0aWVzLmNvbGxlY3Rpb25zLndvcmxkID0ge307XHJcbiAgICAgICAgICAgIHNlbGYuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5wdXNoKFwid29ybGRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSh0aGlzKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUHVwcGV0cy5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLlN5c3RlbXMubGF1bmNoU3lzdGVtcygpO1xyXG59O1xyXG5cclxuUHVwcGV0cy5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKGNsdWUsIGFwbGFuZSlcclxue1xyXG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICAgIGlmKGFwbGFuZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIGFwbGFuZSA9IHRydWU7XHJcbiAgICBcclxuICAgIGNsdWUgPSBjbHVlLnNwbGl0KCcsJyk7XHJcblxyXG4gICAgdmFyIG5iID0gY2x1ZS5sZW5ndGg7XHJcbiAgICB2YXIgcHVwcHksIHB1cHBvO1xyXG4gICAgXHJcbiAgICBmb3IocHVwcHkgPSAwOyBwdXBweSA8IG5iOyBwdXBweSsrKVxyXG4gICAge1xyXG4gICAgICAgIGlmKGNsdWVbcHVwcHldLnNsaWNlKDAsIDEpID09IFwiLlwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuRW50aXRpZXMuY29sbGVjdGlvbnNbY2x1ZVtwdXBweV0uc2xpY2UoMSldKTtcclxuICAgICAgICAgICAgdmFyIHRtcCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IocHVwcG8gaW4gcmVzdWx0c1tyZXN1bHRzLmxlbmd0aC0xXSlcclxuICAgICAgICAgICAgICAgIHRtcC5wdXNoKHJlc3VsdHNbcmVzdWx0cy5sZW5ndGgtMV1bcHVwcG9dKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGgtMV0gPSB0bXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuRW50aXRpZXMuZmluZChjbHVlW3B1cHB5XSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGFwbGFuZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgdG1wID0gW107XHJcbiAgICAgICAgdmFyIGFycmF5O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihwdXBweSA9IDA7IHB1cHB5IDwgcmVzdWx0cy5sZW5ndGg7IHB1cHB5KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhcnJheSA9IHJlc3VsdHNbcHVwcHldO1xyXG4gICAgICAgICAgICBmb3IocHVwcG8gPSAwOyBwdXBwbyA8IGFycmF5Lmxlbmd0aDsgcHVwcG8rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodG1wLmluZGV4T2YoYXJyYXlbcHVwcG9dKSA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgdG1wLnB1c2goYXJyYXlbcHVwcG9dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHRzID0gdG1wO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG59O1xyXG5cclxuUHVwcGV0cy5wcm90b3R5cGUucmVtb3ZlRW50aXR5ID0gZnVuY3Rpb24oZW50aXR5KVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5FbnRpdGllcy5yZW1vdmVFbnRpdHkoZW50aXR5KTtcclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUucmVtb3ZlQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5LCBjb21wb25lbnQpXHJcbntcclxuICAgIHJldHVybiB0aGlzLkVudGl0aWVzLnJlbW92ZUNvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudCk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmFkZENvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50LCBzZXR0aW5ncywgZW5hYmxlZCwgdW5kZWZpbmVkKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5FbnRpdGllcy5hZGRDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnQsIHNldHRpbmdzLCBlbmFibGVkKTtcclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUuY3JlYXRlRW50aXR5ID0gZnVuY3Rpb24obW9kZWwsIGNvbnN0cnVjdG9yLCBjb2xsZWN0aW9uKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5FbnRpdGllcy5jcmVhdGVFbnRpdHkobW9kZWwsIGNvbnN0cnVjdG9yLCBjb2xsZWN0aW9uKTtcclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUuZ2V0Q29tcG9uZW50cyA9IGZ1bmN0aW9uKGVudGl0eSlcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMuZ2V0Q29tcG9uZW50cyhlbnRpdHkpO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5zd2l0Y2hDb2xsZWN0aW9uID0gZnVuY3Rpb24oZW50aXR5LCBjb2xsZWN0aW9uKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5FbnRpdGllcy5zd2l0Y2hDb2xsZWN0aW9uKGVudGl0eSwgY29sbGVjdGlvbik7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbihlbnRpdHksIG51bWJlciwgY29sbGVjdGlvbilcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMuY29weShlbnRpdHksIG51bWJlciwgY29sbGVjdGlvbik7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbihmaWxlLCBzdWNjZXNzLCBlcnJvcilcclxue1xyXG4gICAgdmFyIHJlcXVlc3QgPW5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIGZpbGUsIGZhbHNlKTtcclxuICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgaWYocmVxdWVzdC5yZXNwb25zZSA9PT0gXCJcIilcclxuICAgIHtcclxuICAgICAgICBpZih0eXBlb2YoZXJyb3IpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICBlcnJvcihyZXF1ZXN0LnJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgdGhyb3cgY29uc29sZS53YXJuKFwiQW4gZXJyb3Igb2NjdXJlZCBsb2FkaW5nIFwiK2ZpbGUpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmKHR5cGVvZihzdWNjZXNzKSA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIHN1Y2Nlc3MocmVxdWVzdC5yZXNwb25zZSk7XHJcblxyXG4gICAgdmFyIG1vZHVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgbW9kdWxlLmlubmVySFRNTCA9IHJlcXVlc3QucmVzcG9uc2U7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZHVsZSk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG1vZHVsZSk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmVudGl0eSA9IGZ1bmN0aW9uKG5hbWUsIGRhdGEpe1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMubG9hZChuYW1lLCBkYXRhKTtcclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUuY29tcG9uZW50ID0gZnVuY3Rpb24obmFtZSwgbWV0aG9kLCBkYXRhKXtcclxuICAgIHJldHVybiB0aGlzLkNvbXBvbmVudHMubG9hZChuYW1lLCBtZXRob2QsIGRhdGEpO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5zeXN0ZW0gPSBmdW5jdGlvbihuYW1lLCBtZXRob2QsIGRhdGEpe1xyXG4gICAgcmV0dXJuIHRoaXMuU3lzdGVtcy5sb2FkKG5hbWUsIG1ldGhvZCwgZGF0YSk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmNvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBwb3NpdGlvbil7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KGNvbGxlY3Rpb24pKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucyA9IGNvbGxlY3Rpb247XHJcbiAgICAgICAgZm9yKHZhciBwdXBweSA9IDA7IHB1cHB5IDwgY29sbGVjdGlvbi5sZW5ndGg7IHB1cHB5Kz0xKVxyXG4gICAgICAgICAgICB0aGlzLkVudGl0aWVzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25bcHVwcHldXSA9IHt9O1xyXG5cclxuICAgICAgICBjb25zb2xlLndhcm4oXCJTZXQgbmV3IGNvbGxlY3Rpb24gbGlzdCA6IFwiK2NvbGxlY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZih0eXBlb2YoY29sbGVjdGlvbikgPT09IFwic3RyaW5nXCIpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGluZGV4Q29sbGVjdGlvbiA9IHRoaXMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5pbmRleE9mKGNvbGxlY3Rpb24pO1xyXG5cclxuICAgICAgICBpZihpbmRleENvbGxlY3Rpb24gPj0gMClcclxuICAgICAgICAgICAgdGhpcy5FbnRpdGllcy5vcmRlckNvbGxlY3Rpb25zLnNwbGljZShpbmRleENvbGxlY3Rpb24sIDEpO1xyXG5cclxuICAgICAgICBpZih0eXBlb2YocG9zaXRpb24pICE9PSBcIm51bWJlclwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5FbnRpdGllcy5vcmRlckNvbGxlY3Rpb25zLnB1c2goY29sbGVjdGlvbik7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLkVudGl0aWVzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDb2xsZWN0aW9uIFwiK2NvbGxlY3Rpb24rXCIgb3ZlcnJpZGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5zcGxpY2UocG9zaXRpb24sIDAsIGNvbGxlY3Rpb24pO1xyXG5cclxuICAgICAgICB0aGlzLkVudGl0aWVzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dID0ge307XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuIG5vdCBzZXQgY29sbGVjdGlvbiA6IFwiK2NvbGxlY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUuc3lzdGVtTGlzdCA9IGZ1bmN0aW9uKGxpc3QpXHJcbntcclxuICAgIGlmKEFycmF5LmlzQXJyYXkobGlzdCkpXHJcbiAgICAgICAgdGhpcy5TeXN0ZW1zLm9yZGVyID0gbGlzdDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5TeXN0ZW1zLm9yZGVyO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUHVwcGV0cygpO1xyXG4iLCJcbnZhciByZXF1ZXN0QW5pbUZyYW1lID0gKGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuICAgICAgICBmdW5jdGlvbiggY2FsbGJhY2sgKXtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuICAgICAgICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0QW5pbUZyYW1lOyIsIi8vIHJlcXVpcmUgT2YgYWxsIGZpbGVzIE5lZWRlZFxudmFyIFB1cHBldHMgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9saWJzL3B1cHBldHNcIik7XG52YXIgRWFzeUlucHV0cyAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL2xpYnMvRWFzeUlucHV0XCIpO1xudmFyIEV2ZW50Q29udHJvbGxlciAgICAgICA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcbnZhciBjYW52YXNDb25mICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9jb25maWdDYW52YXNcIik7XG5yZXF1aXJlKFwiLi4vcHVwcGV0c01vZHVsZXMvYmxvY1BhdHRlcm5cIik7XG5yZXF1aXJlKFwiLi4vcHVwcGV0c01vZHVsZXMvd2FsbFwiKTtcbnJlcXVpcmUoXCIuLi9TeXN0ZW1zL3JlbmRlclwiKTtcbnJlcXVpcmUoXCIuLi9TeXN0ZW1zL2NvbGxpZGVyXCIpO1xucmVxdWlyZShcIi4uL1N5c3RlbXMvcG9seWdvbmVVcGRhdGVcIik7XG5yZXF1aXJlKFwiLi4vU3lzdGVtcy9jYW1lcmFGb2N1c1wiKTtcbnZhciBtb2R1bGVQbGF5ZXIgICAgICAgICAgPSByZXF1aXJlKFwiLi4vcHVwcGV0c01vZHVsZXMvUGxheWVyXCIpO1xucmVxdWlyZShcIi4uL3B1cHBldHNNb2R1bGVzL2NhbWVyYVwiKTtcblxuXG52YXIgR2FtZSA9IHtcbiAgICAgICAgICAgICAgICBQdXBwZXRzICAgICAgICAgIDogUHVwcGV0cyxcbiAgICAgICAgICAgICAgICBJbnB1dHMgICAgICAgICAgIDogbmV3IEVhc3lJbnB1dHMoKSxcbiAgICAgICAgICAgICAgICBjdHggICAgICAgICAgICAgIDogY2FudmFzQ29uZi5jdHgsXG4gICAgICAgICAgICAgICAgY2FudmFzICAgICAgICAgICA6IGNhbnZhc0NvbmYuZG9tQ2FudmFzLFxuICAgICAgICAgICAgICAgIHBsYXllckNvbnRyb2xsZXIgOiBtb2R1bGVQbGF5ZXIsXG4gICAgICAgICAgICAgICAgZXZlbnRDb250cm9sbGVyICA6IEV2ZW50Q29udHJvbGxlclxuICAgICAgICAgICAgfTtcblxuXG4vLyBhZGQgb2YgaW5wdXQgY29udHJvbHNcbkdhbWUuSW5wdXRzLmFkZEV2ZW50KFwia2V5ZG93blwiLCB3aW5kb3cpO1xuR2FtZS5JbnB1dHMuYWRkRXZlbnQoXCJ0b3VjaGVuZFwiLCB3aW5kb3cpO1xuXG5HYW1lLklucHV0cy5zZXRLZXlCaW5kKDAse1widG91Y2hlbmRcIjpmdW5jdGlvbiAoKXtHYW1lLmV2ZW50Q29udHJvbGxlci5lbWl0KFwiZ28tZm9yd2FyZFwiKTt9fSk7XG4vLyBHYW1lLklucHV0cy5zZXRLZXlCaW5kKDAse1widG91Y2hlbmRcIjpmdW5jdGlvbiAoKXtHYW1lLmV2ZW50Q29udHJvbGxlci5lbWl0KFwicmVib3VuZFwiKTt9fSk7XG5cbi8vIGNvbnNvbGUubG9nKEdhbWUuSW5wdXRzLmdldEtleXNCaW5kKCkpO1xuXG4vLyBjcmVhdGUgZW50aXRpZXMgXG5cbi8vIGV4cG9ydCBicm93c2VyaWZ5IFxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuIiwiXG52YXIgRXZlbnRzQ29udHJvbGxlciA9IGZ1bmN0aW9uICgpeyB9O1xuICAgIFxuICAgIEV2ZW50c0NvbnRyb2xsZXIucHJvdG90eXBlLmV2ZW50cyA9IHt9O1xuXG4gICAgRXZlbnRzQ29udHJvbGxlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obXlFdmVudCxteUZ1bmN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmV2ZW50c1tteUV2ZW50XSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tteUV2ZW50XT1bXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW215RXZlbnRdLnB1c2gobXlGdW5jdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmVudHNbbXlFdmVudF0ubGVuZ3QtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICBFdmVudHNDb250cm9sbGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICBFdmVudHNDb250cm9sbGVyLnByb3RvdHlwZS5nZXRFdmVudCA9IGZ1bmN0aW9uKHN0cmluZyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3RyaW5nLmluZGV4T2YoJyonKSE9PS0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHN0cmluZy5pbmRleE9mKCcqJyk9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyYXkgID0gc3RyaW5nLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmpldEV2ZW50ID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4IGluIGFycmF5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZXRFdmVudFthcnJheVtpbmRleF1dID0gdGhpcy5ldmVudHNbYXJyYXlbaW5kZXhdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmpldEV2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xudmFyIGNvbnRyb2xsZXIgPSBuZXcgRXZlbnRzQ29udHJvbGxlcigpO1xuLy8gZXhwb3J0IGJyb3dzZXJpZnkgXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRyb2xsZXI7XG4iLCJ2YXIgYmFzaWMgPSB7fTtcbmJhc2ljLmNvbXB1dGVQb2x5Z29uZT0gZnVuY3Rpb24oc2hhcGUseCx5LHdpZHRoLGhlaWdodCxhbmdsZSl7XG4gICAgY29uc29sZS5sb2coc2hhcGUpXG4gICAgaWYoc2hhcGUgPT09IFwic3F1YXJlXCIpe1xuXG4gICAgICAgIHZhciBfbGluZVRvcCA9IHthOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4Kyh3aWR0aCotMSkvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeSsoaGVpZ2h0Ki0xKS8yKX0sYjp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCt3aWR0aC8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5KyhoZWlnaHQqLTEpLzIpfX07XG4gICAgICAgIHZhciBfbGluZUJvdHRvbSA9IHthOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4Kyh3aWR0aCotMSkvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeStoZWlnaHQvMil9LGI6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrd2lkdGgvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeStoZWlnaHQvMil9fTtcbiAgICAgICAgdmFyIF9saW5lTGVmdCA9IHthOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4Kyh3aWR0aCotMSkvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeSsoaGVpZ2h0Ki0xKS8yKX0sYjp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCsod2lkdGgqLTEpLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkraGVpZ2h0LzIpfX07XG4gICAgICAgIHZhciBfbGluZVJpZ2h0ID0ge2E6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrd2lkdGgvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeSsoaGVpZ2h0Ki0xKS8yKX0sYjp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCt3aWR0aC8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5K2hlaWdodC8yKX19O1xuXG4gICAgICAgIHJldHVybiB7J2xpbmVUb3AnOl9saW5lVG9wLCdsaW5lQm90dG9tJzpfbGluZUJvdHRvbSwnbGluZVJpZ2h0JzpfbGluZVJpZ2h0LCdsaW5lTGVmdCc6X2xpbmVMZWZ0fTtcbiAgICB9XG4gICAgZWxzZSBpZihzaGFwZT09PVwiVmVydGljYWxMaW5lXCIpe1xuICAgICAgICB2YXIgX2xpbmVMZWZ0ID0ge2E6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrKHdpZHRoKi0xKS8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5KyhoZWlnaHQqLTEpLzIpfSxiOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4Kyh3aWR0aCotMSkvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeStoZWlnaHQvMil9fTtcbiAgICAgICAgdmFyIF9saW5lUmlnaHQgPSB7YTp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCt3aWR0aC8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5KyhoZWlnaHQqLTEpLzIpfSxiOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4K3dpZHRoLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkraGVpZ2h0LzIpfX07XG4gICAgICAgIHJldHVybiB7J2xpbmVSaWdodCc6X2xpbmVSaWdodCwnbGluZUxlZnQnOl9saW5lTGVmdH07ICAgICAgIFxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzaWM7IFxuIiwidmFyIGNvbmZpZyA9IHt9O1xuY29uZmlnLmRvbUNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpOyBcbmNvbmZpZy5jdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnOyAiLCJ2YXIgYmFzaWNzQ29tcG9uZW50cyAgICAgID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudHMvYmFzaWNzQ29tcG9uZW50c1wiKTtcbnZhciBjYW52YXNDb25mICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9jb25maWdDYW52YXNcIik7XG52YXIgbW9kdWxlRXZlbnRDb250cm9sbGVyID0gcmVxdWlyZShcIi4uL21vZHVsZXMvRXZlbnRDb250cm9sbGVyXCIpO1xudmFyIGJhc2ljICAgICAgICAgICAgICAgICA9ICByZXF1aXJlKFwiLi4vbW9kdWxlcy9iYXNpY01ldGhvZGVzXCIpO1xuXG4vLyBjb21wb25lbnQgbW92ZSBzbW9vdGggZm9yIHBsYXllcjtcblB1cHBldHMuY29tcG9uZW50KFwibW92ZVwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHt2YWx1ZTpkYXRhLnZhbHVlfHwwLCBkaXZpc2V1ciA6IGRhdGEuZGl2aXNldXIgfHwgMixkaXJlY3Rpb24gOiBkYXRhLmRpcmVjdGlvbiB8fCAyICxpbnZlcnRTd2l0Y2ggOiBmYWxzZX07XG59KTtcblxuUHVwcGV0cy5lbnRpdHkoJ3BsYXllcicse2NvbXBvbmVudHMgOiBbJ3Bvc2l0aW9uJywncmVuZGVyJywnc2l6ZScsJ3NwZWVkJywnbW92ZScsJ2NvbGxpZGVyJyxcInBvbHlnb25lXCJdfSk7XG5cbi8vIHN5c3RlbSB1c2UgdG8gbW92ZSBwbGF5ZXIuXG5QdXBwZXRzLnN5c3RlbShcIm1vdmUtZm9yd2FyZFwiLGZ1bmN0aW9uKHBvc2l0aW9uLHNwZWVkLG1vdmUpe1xuICAgICAgICB2YXIgX3NwZWVkID0gc3BlZWQudmFsdWUsXG4gICAgICAgIF9tb3ZlICAgICAgPSBtb3ZlLnZhbHVlO1xuICAgICAgICBfZGl2aXNldXIgID0gbW92ZS5kaXZpc2V1cjtcbiAgICAgICBcbiAgICAgICAgaWYoX21vdmU+MCl7XG4gICAgICAgICAgICBpZihfc3BlZWQ8MClcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi54LT1fc3BlZWQqTWF0aC5zaW4ocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCkqX2RpdmlzZXVyO1xuICAgICAgICAgICAgZWxzZSBpZihfc3BlZWQ+MClcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi54Kz1fc3BlZWQqTWF0aC5zaW4ocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCkqX2RpdmlzZXVyO1xuXG4gICAgICAgICAgICBwb3NpdGlvbi55LT0zKl9kaXZpc2V1cjtcbiAgICAgICAgICAgIG1vdmUudmFsdWUtPTAuMTUvX2RpdmlzZXVyOyAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlmKHBvc2l0aW9uLmFuZ2xlPT05MCB8fCBwb3NpdGlvbi5hbmdsZT09LTkwKXsgICBcbiAgICAgICAgICAgICAgICBzcGVlZC52YWx1ZSo9LTE7XG4gICAgICAgICAgICAgICAgbW92ZS5kaXJlY3Rpb24qPS0xO1xuICAgICAgICAgICAgICAgIG1vdmUuaW52ZXJ0U3dpdGNoPWZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihwb3NpdGlvbi54Pj02MDApe1xuICAgICAgICAgICAgICAgIGlmKF9zcGVlZD4wKXtcbiAgICAgICAgICAgICAgICAgICAgc3BlZWQudmFsdWUqPS0xO1xuICAgICAgICAgICAgICAgICAgICBtb3ZlLmRpcmVjdGlvbio9LTFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueC09MC4yNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYocG9zaXRpb24ueDw9MCl7XG4gICAgICAgICAgICAgICAgaWYoX3NwZWVkPDApe1xuICAgICAgICAgICAgICAgICAgICBzcGVlZC52YWx1ZSo9LTE7XG4gICAgICAgICAgICAgICAgICAgIG1vdmUuZGlyZWN0aW9uKj0tMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwb3NpdGlvbi54Kz0wLjI1O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihNYXRoLnNpbihwb3NpdGlvbi5hbmdsZSpNYXRoLlBJIC8gMTgwKTwxJiZNYXRoLnNpbihwb3NpdGlvbi5hbmdsZSpNYXRoLlBJIC8gMTgwKT4tMSlcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi55ICs9IF9zcGVlZCpNYXRoLnNpbihwb3NpdGlvbi5hbmdsZSpNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgICAgIGlmKChNYXRoLmNvcyhwb3NpdGlvbi5hbmdsZSpNYXRoLlBJIC8gMTgwKTwxJiZNYXRoLmNvcyhwb3NpdGlvbi5hbmdsZSpNYXRoLlBJIC8gMTgwKT4tMSkpXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueCArPSBfc3BlZWQqTWF0aC5jb3MocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBvc2l0aW9uLmFuZ2xlKz0gbW92ZS5kaXJlY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgXG59LHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ3NwZWVkJywnbW92ZSddfSk7XG5cbnZhciBQbGF5ZXJDb250cm9sbGVyID0gZnVuY3Rpb24gKCl7XG5cbiAgICB2YXIgcGFyYW1zID0geyB4OmNhbnZhc0NvbmYuZG9tQ2FudmFzLndpZHRoLzIsIHk6MjU2LCBhbmdsZTowLCB3aWR0aCA6IDI1LCBoZWlnaHQgOiAyNSAgLCBzaGFwZSA6IFwic3F1YXJlXCIsIGN0eCA6IGNhbnZhc0NvbmYuY3R4LCBzbW9vdGhYOjAsc21vb3RoWTowLHR5cGU6XCJwbGF5ZXJcIixsaW5lcyA6e319O1xuXG4gICAgcGFyYW1zLmxpbmVzID0gYmFzaWMuY29tcHV0ZVBvbHlnb25lKHBhcmFtcy5zaGFwZSxwYXJhbXMueCxwYXJhbXMueSxwYXJhbXMud2lkdGgscGFyYW1zLmhlaWdodCxwYXJhbXMuYW5nbGUpO1xuXG4gICAgdGhpcy5pbml0KHBhcmFtcyk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ocGFyYW1zKXtcblxuICAgIHRoaXMuZW50aXR5TnVtYmVyID0gUHVwcGV0cy5jcmVhdGVFbnRpdHkoJ3BsYXllcicse3Bvc2l0aW9uOnt4OnBhcmFtcy54LCB5OnBhcmFtcy55ICwgYW5nbGUgOiBwYXJhbXMuYW5nbGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplICAgICA6e3c6IHBhcmFtcy53aWR0aCAsIGg6IHBhcmFtcy5oZWlnaHR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXIgICA6e2N0eDogcGFyYW1zLmN0eH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpZGVyIDp7dHlwZTpwYXJhbXMudHlwZSxzaGFwZSA6IHBhcmFtcy5zaGFwZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlnb25lIDp7bGluZXM6cGFyYW1zLmxpbmVzfX0pO1xuICAgIHZhciBlbnRpdHlzID0gUHVwcGV0cy5maW5kKCdjb2xsaWRlcicpO1xuICAgIHZhciBvdGhlcnNDb21wb25lbnRzID0gW107XG4gICAgZW50aXR5cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsaW5kZXgsYXJyYXkpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF9teUVudGl0eSA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyhlbGVtZW50KVswXTtcbiAgICAgICAgaWYoX215RW50aXR5LmNvbGxpZGVyLnR5cGUgIT09ICdwbGF5ZXInKXtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gX215RW50aXR5LnBvbHlnb25lLmxpbmVzKXtcbiAgICAgICAgICAgICAgICBvdGhlcnNDb21wb25lbnRzLnB1c2goX215RW50aXR5LnBvbHlnb25lLmxpbmVzW2ldKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICBcbiAgICB9KTtcblxuICAgIFxuICAgIFB1cHBldHMuY29tcG9uZW50KFwib3RoZXJzXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICAgICAgcmV0dXJuIHsgbGluZXMgOiBkYXRhLm90aGVyc307XG4gICAgfSk7XG5cbiAgICBQdXBwZXRzLmFkZENvbXBvbmVudCh0aGlzLmVudGl0eU51bWJlciwnb3RoZXJzJyx7b3RoZXJzIDogb3RoZXJzQ29tcG9uZW50c30pO1xuXG4gICAgdGhpcy5zZXRFdmVudHMoKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnNldEV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICBtb2R1bGVFdmVudENvbnRyb2xsZXIuYWRkKFwiZ28tZm9yd2FyZFwiLGZ1bmN0aW9uKCl7ICBcbiAgICAgICAgdmFyIF9zZWxmID0gUHVwcGV0cy5nZXRDb21wb25lbnRzKHRoaXMuZW50aXR5TnVtYmVyKVswXTtcbiAgICAgICAgX3NlbGYubW92ZS52YWx1ZSArPTE7IFxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICBtb2R1bGVFdmVudENvbnRyb2xsZXIuYWRkKFwicmVib3VuZFwiLGZ1bmN0aW9uKCl7IFxuXG4gICAgICAgIHZhciBfc2VsZiA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyh0aGlzLmVudGl0eU51bWJlcilbMF07XG4gICAgICAgIGlmKCFfc2VsZi5tb3ZlLmludmVydFN3aXRjaCl7XG4gICAgICAgICAgICBfc2VsZi5zcGVlZC52YWx1ZSAqPS0xOyBcbiAgICAgICAgICAgIF9zZWxmLm1vdmUuZGlyZWN0aW9uICo9LTE7IFxuICAgICAgICAgICAgX3NlbGYubW92ZS5pbnZlcnRTd2l0Y2ggPSB0cnVlOyAgICAgXG4gICAgICAgIH1cblxuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5cbi8vIGJyb3dzZXJpZnkgZXhwb3J0XG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQbGF5ZXJDb250cm9sbGVyKCk7IiwidmFyIGJhc2ljc0NvbXBvbmVudHMgICAgICA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL2Jhc2ljc0NvbXBvbmVudHNcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIGJhc2ljICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2Jhc2ljTWV0aG9kZXNcIik7XG5cblB1cHBldHMuZW50aXR5KCdibG9jMScse2NvbXBvbmVudHMgOiBbJ3Bvc2l0aW9uJywncmVuZGVyJywnc2l6ZScsJ2NvbGxpZGVyJyxcInBvbHlnb25lXCJdfSk7XG5cblxudmFyIGJsb2NGYWN0b3J5ID0gZnVuY3Rpb24gKCl7XG5cbiAgICB2YXIgcGFyYW1zID0geyB4OjE1MCwgeToyMDAgLCBhbmdsZSA6ICAgOTAsIHdpZHRoIDogNTAsIGhlaWdodCA6IDEwMCAgLCBzaGFwZSA6IFwic3F1YXJlXCIsIGN0eCA6IGNhbnZhc0NvbmYuY3R4LCB0eXBlOlwiYmxvY1wiLGxpbmVzIDp7fSxmaWxsIDpcIiNmZmZmZmZcIiB9O1xuXG4gICAgcGFyYW1zLmxpbmVzID0gYmFzaWMuY29tcHV0ZVBvbHlnb25lKHBhcmFtcy5zaGFwZSxwYXJhbXMueCxwYXJhbXMueSxwYXJhbXMud2lkdGgscGFyYW1zLmhlaWdodCxwYXJhbXMuYW5nbGUpO1xuICAgIFxuICAgIHRoaXMuaW5pdChwYXJhbXMpO1xufTtcblxuYmxvY0ZhY3RvcnkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihwYXJhbXMpe1xuXG4gICAgdGhpcy5lbnRpdHlOdW1iZXIgPSBQdXBwZXRzLmNyZWF0ZUVudGl0eSgnYmxvYzEnLHtwb3NpdGlvbjp7eDpwYXJhbXMueCwgeTpwYXJhbXMueSAsIGFuZ2xlIDogcGFyYW1zLmFuZ2xlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZSAgICAgOnt3OiBwYXJhbXMud2lkdGggLCBoOiBwYXJhbXMuaGVpZ2h0fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyICAgOntjdHg6IHBhcmFtcy5jdHgsZmlsbDpwYXJhbXMuZmlsbH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpZGVyIDp7dHlwZTpwYXJhbXMudHlwZSxzaGFwZSA6IHBhcmFtcy5zaGFwZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlnb25lIDp7bGluZXM6cGFyYW1zLmxpbmVzfX0pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBibG9jRmFjdG9yeSgpOyIsInZhciBiYXNpY3NDb21wb25lbnRzICAgICAgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50cy9iYXNpY3NDb21wb25lbnRzXCIpO1xudmFyIGNhbnZhc0NvbmYgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2NvbmZpZ0NhbnZhc1wiKTtcbnZhciBtb2R1bGVFdmVudENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9FdmVudENvbnRyb2xsZXJcIik7XG52YXIgYmFzaWMgICAgICAgICAgICAgICAgID0gIHJlcXVpcmUoXCIuLi9tb2R1bGVzL2Jhc2ljTWV0aG9kZXNcIik7XG5cblB1cHBldHMuZW50aXR5KCdjYW1lcmEnLHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ3JlbmRlciddfSk7XG5cbnZhciBDYW1lcmEgPSBmdW5jdGlvbiAoeCx5LHcsaCl7XG5cbiAgICB2YXIgcGFyYW1zID0geyB4OngsIHk6eSxjdHggOiBjYW52YXNDb25mLmN0eCwgfTtcbiAgICBcbiAgICB0aGlzLmluaXQocGFyYW1zKTtcbn07XG5cbkNhbWVyYS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHBhcmFtcyl7XG5cbiAgICB0aGlzLmVudGl0eU51bWJlciA9IFB1cHBldHMuY3JlYXRlRW50aXR5KCdjYW1lcmEnLHtwb3NpdGlvbjp7eDpwYXJhbXMueCwgeTpwYXJhbXMueX0scmVuZGVyOntjdHggOiBwYXJhbXMuY3R4fX0pO1xuXG4gICAgdmFyIF9wbGF5ZXJFbnRpdHkgPSBQdXBwZXRzLmZpbmQoJ21vdmUnKTtcbiAgICB2YXIgX3BsYXllclJlZiA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyhfcGxheWVyRW50aXR5KVswXTtcbiAgICBjb25zb2xlLmxvZyhfcGxheWVyUmVmKTtcbiAgICAvLyBjb21wb25lbnQgbW92ZSBzbW9vdGggZm9yIHBsYXllcjtcbiAgICBQdXBwZXRzLmNvbXBvbmVudChcInRhcmdldENhbWVyYVwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgICAgIHJldHVybiB7cmVmOmRhdGEudGFyZ2V0fTtcbiAgICB9KTtcblxuICAgIFB1cHBldHMuYWRkQ29tcG9uZW50KHRoaXMuZW50aXR5TnVtYmVyLFwidGFyZ2V0Q2FtZXJhXCIse3RhcmdldCA6IF9wbGF5ZXJSZWZ9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENhbWVyYSgpO1xuIiwidmFyIGJhc2ljc0NvbXBvbmVudHMgICAgICA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL2Jhc2ljc0NvbXBvbmVudHNcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIG1vZHVsZUV2ZW50Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcbnZhciBiYXNpYyAgICAgICAgICAgICAgICAgPSAgcmVxdWlyZShcIi4uL21vZHVsZXMvYmFzaWNNZXRob2Rlc1wiKTtcblxuUHVwcGV0cy5lbnRpdHkoJ3dhbGwnLHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ3NpemUnLCdjb2xsaWRlcicsXCJwb2x5Z29uZVwiXX0pO1xuXG52YXIgd2FsbEZhY3RvcnkgPSBmdW5jdGlvbiAoeCx5LHcsaCl7XG5cbiAgICB2YXIgcGFyYW1zID0geyB4OngsIHk6eSAsIGFuZ2xlIDogICAwLCB3aWR0aCA6IHcsIGhlaWdodCA6IGggICwgc2hhcGUgOiBcIlZlcnRpY2FsTGluZVwiLCBjdHggOiBjYW52YXNDb25mLmN0eCwgdHlwZTpcImJvcmRlclwiLGxpbmVzIDp7fSxmaWxsIDpcIiM5NWZmZmZcIiB9O1xuXG4gICAgcGFyYW1zLmxpbmVzID0gYmFzaWMuY29tcHV0ZVBvbHlnb25lKHBhcmFtcy5zaGFwZSxwYXJhbXMueCxwYXJhbXMueSxwYXJhbXMud2lkdGgscGFyYW1zLmhlaWdodCxwYXJhbXMuYW5nbGUpO1xuICAgIFxuICAgIHRoaXMuaW5pdChwYXJhbXMpO1xufTtcblxud2FsbEZhY3RvcnkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihwYXJhbXMpe1xuXG4gICAgdGhpcy5lbnRpdHlOdW1iZXIgPSBQdXBwZXRzLmNyZWF0ZUVudGl0eSgnd2FsbCcse3Bvc2l0aW9uOnt4OnBhcmFtcy54LCB5OnBhcmFtcy55ICwgYW5nbGUgOiBwYXJhbXMuYW5nbGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplICAgICA6e3c6IHBhcmFtcy53aWR0aCAsIGg6IHBhcmFtcy5oZWlnaHR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW5kZXIgICA6e2N0eDogcGFyYW1zLmN0eCxmaWxsOnBhcmFtcy5maWxsfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlkZXIgOnt0eXBlOnBhcmFtcy50eXBlLHNoYXBlIDogcGFyYW1zLnNoYXBlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWdvbmUgOntsaW5lczpwYXJhbXMubGluZXN9fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyB3YWxsRmFjdG9yeSgzMDAsNDAwLDYwMCwtMTAwMCk7IFxuIl19
