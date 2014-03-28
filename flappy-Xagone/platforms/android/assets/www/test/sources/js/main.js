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

var getIdCamera = Puppets.find('targetCamera');
    camera = Puppets.getComponents(getIdCamera[0])[0];

// Puppets.system("cameraFocus",function(position,targetCamera){

//     // console.log(targetCamera);
//     var targetx     = targetCamera.ref.position.x,
//         targety     = targetCamera.ref.position.y;

//         // debugger;
//         // if(targety >position.y)
//         //     position.y -=0.1;        
        

// },{components : ["position","targetCamera"]});

// Puppets.system("cameraMove",function(position,collider,render){
//     // debugger;

//         position.y = camera.position.y-position.y;


// },{components : ["position","collider","render"]});

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

                 for (var p = 0;p<others.lines.length;++p){
                    
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
var modulePlayer          = require("../puppetsModules/Player");
require("../puppetsModules/camera");
require("../Systems/cameraFocus");


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


var blocFactory = function (x,y,angle,w,h){

    var params = { x:x, y:y , angle :   angle, width : w, height : h  , shape : "square", ctx : canvasConf.ctx, type:"bloc",lines :{},fill :"#ffffff" };

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


new blocFactory(550,300,90,50,200);
new blocFactory(500,200,90,50,400);
new blocFactory(200,100,70,50,400);
module.exports = new blocFactory(60,300,90,50,200);
},{"../Components/basicsComponents":1,"../modules/basicMethodes":12,"../modules/configCanvas":13}],16:[function(require,module,exports){
var basicsComponents      = require("../Components/basicsComponents");
var canvasConf            = require("../modules/configCanvas");
var moduleEventController = require("../modules/EventController");
var basic                 =  require("../modules/basicMethodes");

Puppets.entity('camera',{components : ['position']});

var Camera = function (x,y,w,h){

    var params = { x:x, y:y};
    
    this.init(params);
};

Camera.prototype.init = function(params){

    this.entityNumber = Puppets.createEntity('camera',{position:{x:params.x, y:params.y}});

    var _playerEntity = Puppets.find('move');
    var _playerRef = Puppets.getComponents(_playerEntity)[0];
    // component move smooth for player;
    Puppets.component("targetCamera",function(data,entity,undefined){
        return {ref:data.target};
    });

    Puppets.addComponent(this.entityNumber,"targetCamera",{target : _playerRef});
};
module.exports = new Camera(300,250);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvQ29tcG9uZW50cy9iYXNpY3NDb21wb25lbnRzLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL1N5c3RlbXMvY2FtZXJhRm9jdXMuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvU3lzdGVtcy9jb2xsaWRlci5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9TeXN0ZW1zL3BvbHlnb25lVXBkYXRlLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL1N5c3RlbXMvcmVuZGVyLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL2Zha2VfNmU4MDA2ZC5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9saWJzL0Vhc3lJbnB1dC5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9saWJzL3B1cHBldHMuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbGlicy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbG9hZGVyL2dhbWUuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbW9kdWxlcy9FdmVudENvbnRyb2xsZXIuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvbW9kdWxlcy9iYXNpY01ldGhvZGVzLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL21vZHVsZXMvY29uZmlnQ2FudmFzLmpzIiwiL2hvbWUvYmVuL3dvcmtXZWIvRmxhcHB5QmlyZExpa2UvcHVibGljL2pzL3B1cHBldHNNb2R1bGVzL1BsYXllci5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9wdXBwZXRzTW9kdWxlcy9ibG9jUGF0dGVybi5qcyIsIi9ob21lL2Jlbi93b3JrV2ViL0ZsYXBweUJpcmRMaWtlL3B1YmxpYy9qcy9wdXBwZXRzTW9kdWxlcy9jYW1lcmEuanMiLCIvaG9tZS9iZW4vd29ya1dlYi9GbGFwcHlCaXJkTGlrZS9wdWJsaWMvanMvcHVwcGV0c01vZHVsZXMvd2FsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDam1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQmFzaWMgY29tcG9uZW50cyBmb3IgZW50aXRpZXMgIVxuXG5QdXBwZXRzLmNvbXBvbmVudChcInBvc2l0aW9uXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICByZXR1cm4geyBhbmdsZSA6IGRhdGEuYW5nbGUgfHwgMCAsIHggOiBkYXRhLnggfHwgMCAgLCB5IDogZGF0YS55IHx8IDAgfTtcbn0pO1xuXG5QdXBwZXRzLmNvbXBvbmVudChcInJlbmRlclwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHsgY3R4IDogZGF0YS5jdHggLEZpbGxjb2xvciA6IGRhdGEuZmlsbCB8fCBcIiMyMmZmMzNcIiAsIFN0cm9rZWNvbG9yIDogZGF0YS5zdHJva2UgfHwgXCIjMjJmZmZmXCIgfTtcbn0pO1xuXG5QdXBwZXRzLmNvbXBvbmVudChcInNpemVcIixmdW5jdGlvbihkYXRhLGVudGl0eSx1bmRlZmluZWQpe1xuICAgIHJldHVybiB7IHdpZHRoIDogZGF0YS53IHx8IDUwICAsIGhlaWdodCA6IGRhdGEuaCB8fCA1MCB9O1xufSk7XG5cblB1cHBldHMuY29tcG9uZW50KFwic3BlZWRcIixmdW5jdGlvbihkYXRhLGVudGl0eSx1bmRlZmluZWQpe1xuICAgIHJldHVybiB7IHZhbHVlIDogZGF0YS52YWx1ZSB8fCA1IH07XG59KTtcblxuUHVwcGV0cy5jb21wb25lbnQoXCJjb2xsaWRlclwiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIHsgdHlwZSA6IGRhdGEudHlwZSB8fCBcImJsb2NrXCIsc2hhcGUgOiBkYXRhLnNoYXBlIHx8ICcnfTtcbn0pO1xuXG5QdXBwZXRzLmNvbXBvbmVudChcInBvbHlnb25lXCIsZnVuY3Rpb24oZGF0YSxlbnRpdHksdW5kZWZpbmVkKXtcbiAgICByZXR1cm4geyBsaW5lcyA6IGRhdGEubGluZXN9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpczsgIiwiICAgIHZhciBQdXBwZXRzICAgID0gcmVxdWlyZShcIi4uL2xpYnMvcHVwcGV0c1wiKTtcbiAgICB2YXIgY2FudmFzQ29uZiA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2NvbmZpZ0NhbnZhc1wiKTtcbnZhciBldmVudHNDb250cm9sbGVyID0gcmVxdWlyZShcIi4uL21vZHVsZXMvRXZlbnRDb250cm9sbGVyXCIpO1xuXG52YXIgZ2V0SWRDYW1lcmEgPSBQdXBwZXRzLmZpbmQoJ3RhcmdldENhbWVyYScpO1xuICAgIGNhbWVyYSA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyhnZXRJZENhbWVyYVswXSlbMF07XG5cbi8vIFB1cHBldHMuc3lzdGVtKFwiY2FtZXJhRm9jdXNcIixmdW5jdGlvbihwb3NpdGlvbix0YXJnZXRDYW1lcmEpe1xuXG4vLyAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0Q2FtZXJhKTtcbi8vICAgICB2YXIgdGFyZ2V0eCAgICAgPSB0YXJnZXRDYW1lcmEucmVmLnBvc2l0aW9uLngsXG4vLyAgICAgICAgIHRhcmdldHkgICAgID0gdGFyZ2V0Q2FtZXJhLnJlZi5wb3NpdGlvbi55O1xuXG4vLyAgICAgICAgIC8vIGRlYnVnZ2VyO1xuLy8gICAgICAgICAvLyBpZih0YXJnZXR5ID5wb3NpdGlvbi55KVxuLy8gICAgICAgICAvLyAgICAgcG9zaXRpb24ueSAtPTAuMTsgICAgICAgIFxuICAgICAgICBcblxuLy8gfSx7Y29tcG9uZW50cyA6IFtcInBvc2l0aW9uXCIsXCJ0YXJnZXRDYW1lcmFcIl19KTtcblxuLy8gUHVwcGV0cy5zeXN0ZW0oXCJjYW1lcmFNb3ZlXCIsZnVuY3Rpb24ocG9zaXRpb24sY29sbGlkZXIscmVuZGVyKXtcbi8vICAgICAvLyBkZWJ1Z2dlcjtcblxuLy8gICAgICAgICBwb3NpdGlvbi55ID0gY2FtZXJhLnBvc2l0aW9uLnktcG9zaXRpb24ueTtcblxuXG4vLyB9LHtjb21wb25lbnRzIDogW1wicG9zaXRpb25cIixcImNvbGxpZGVyXCIsXCJyZW5kZXJcIl19KTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aGlzOyBcbiIsInZhciBQdXBwZXRzICAgID0gcmVxdWlyZShcIi4uL2xpYnMvcHVwcGV0c1wiKTtcbnZhciBjYW52YXNDb25mID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIGV2ZW50c0NvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9FdmVudENvbnRyb2xsZXJcIik7XG5cblB1cHBldHMuc3lzdGVtKFwiY29sbGlkZXJcIixmdW5jdGlvbihwb3NpdGlvbixjb2xsaWRlcixzaXplLG90aGVycyxwb2x5Z29uZSl7XG5cblxuICAgIHZhciB4ICAgICAgICAgICA9IHBvc2l0aW9uLngsXG4gICAgICAgIHkgICAgICAgICAgID0gcG9zaXRpb24ueSxcbiAgICAgICAgYW5nbGUgICAgICAgPSBwb3NpdGlvbi5hbmdsZSxcbiAgICAgICAgd2lkdGggICAgICAgPSBzaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQgICAgICA9IHNpemUuaGVpZ2h0O1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaSBpbiBwb2x5Z29uZS5saW5lcyl7XG4gICAgICAgICAgICB2YXIgX3BsYXllckxpbmUxeCA9IHBvbHlnb25lLmxpbmVzW2ldLmEueCxcbiAgICAgICAgICAgICAgICBfcGxheWVyTGluZTF5ID0gcG9seWdvbmUubGluZXNbaV0uYS55LFxuICAgICAgICAgICAgICAgIF9wbGF5ZXJMaW5lMnggPSBwb2x5Z29uZS5saW5lc1tpXS5iLngsXG4gICAgICAgICAgICAgICAgX3BsYXllckxpbmUyeSA9IHBvbHlnb25lLmxpbmVzW2ldLmIueTtcblxuICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMDtwPG90aGVycy5saW5lcy5sZW5ndGg7KytwKXtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBfb3RoZXJMaW5lMXggPSBvdGhlcnMubGluZXNbcF0uYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgX290aGVyTGluZTF5ID0gb3RoZXJzLmxpbmVzW3BdLmEueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9vdGhlckxpbmUyeCA9IG90aGVycy5saW5lc1twXS5iLngsXG4gICAgICAgICAgICAgICAgICAgICAgICBfb3RoZXJMaW5lMnkgPSBvdGhlcnMubGluZXNbcF0uYi55O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGVzdCBpZiBsaW5lcyBhcmUgcGFyYWxsZXMgaWYgdGhleSBhcmUgIHRlc3QgPSAgMC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RQYXJhbGxlPSgoX3BsYXllckxpbmUyeSAtIF9wbGF5ZXJMaW5lMXkpKiAoX290aGVyTGluZTJ4IC0gX290aGVyTGluZTF4KSkgLSAoKF9wbGF5ZXJMaW5lMnggLSBfcGxheWVyTGluZTF4KSooX290aGVyTGluZTJ5LSBfb3RoZXJMaW5lMXkpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3RDcm9zc0xpbmVUb0xpbmVBID0gKCgoX3BsYXllckxpbmUyeC1fcGxheWVyTGluZTF4KSooX290aGVyTGluZTF5LSBfcGxheWVyTGluZTF5KSktKChfcGxheWVyTGluZTJ5LV9wbGF5ZXJMaW5lMXkpKihfb3RoZXJMaW5lMXgtIF9wbGF5ZXJMaW5lMXgpKSkvdGVzdFBhcmFsbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdENyb3NzTGluZVRvTGluZUIgPSAoKChfb3RoZXJMaW5lMngtX290aGVyTGluZTF4KSAqIChfb3RoZXJMaW5lMXkgLSBfcGxheWVyTGluZTF5KSktKChfb3RoZXJMaW5lMnkgLSBfb3RoZXJMaW5lMXkpICogKF9vdGhlckxpbmUxeCAtIF9wbGF5ZXJMaW5lMXgpKSkgLyB0ZXN0UGFyYWxsZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICgodGVzdENyb3NzTGluZVRvTGluZUEgPCAwKSB8fCAodGVzdENyb3NzTGluZVRvTGluZUEgPiAxKSB8fCAodGVzdENyb3NzTGluZVRvTGluZUIgPCAwKSB8fCAodGVzdENyb3NzTGluZVRvTGluZUIgPiAxKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInlvbG8gY2EgY2UgY3JvaXNlIHBhcyAhXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xsaXNpb25cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHNDb250cm9sbGVyLmVtaXQoJ3JlYm91bmQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gICBcbn0se2NvbXBvbmVudHMgOiBbJ3Bvc2l0aW9uJywnY29sbGlkZXInLCdzaXplJywnb3RoZXJzJywncG9seWdvbmUnXX0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXM7IFxuIiwidmFyIFB1cHBldHMgICAgPSByZXF1aXJlKFwiLi4vbGlicy9wdXBwZXRzXCIpO1xudmFyIGNhbnZhc0NvbmYgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9jb25maWdDYW52YXNcIik7XG5cbi8vIHB1cHBldCBTeXN0ZW0gRHJhdyBcblB1cHBldHMuc3lzdGVtKFwicG9seWdvbmVVcGRhdGVcIixmdW5jdGlvbihwb3NpdGlvbixzaXplLHBvbHlnb25lKXtcbiAgICAgICAgdmFyIHggICAgICAgICAgID0gcG9zaXRpb24ueCxcbiAgICAgICAgICAgIHkgICAgICAgICAgID0gcG9zaXRpb24ueSxcbiAgICAgICAgICAgIGFuZ2xlICAgICAgID0gcG9zaXRpb24uYW5nbGUsXG4gICAgICAgICAgICB3aWR0aCAgICAgICA9IHNpemUud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQgICAgICA9IHNpemUuaGVpZ2h0O1xuXG4gICAgICAgIFxuICAgIGlmKHBvbHlnb25lLmxpbmVzLmxpbmVUb3AhPT11bmRlZmluZWQpe1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVUb3AuYS54ID0gTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4Kyh3aWR0aCotMSkvMikteCkgLSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSAqICgoeSsoaGVpZ2h0Ki0xKS8yKS15KSt4O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVUb3AuYS55ID0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4Kyh3aWR0aCotMSkvMikteCkgKyBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5KyhoZWlnaHQqLTEpLzIpLXkpK3k7XG4gICAgcG9seWdvbmUubGluZXMubGluZVRvcC5iLnggPSBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrd2lkdGgvMikteCkgLSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSAqICgoeSsoaGVpZ2h0Ki0xKS8yKS15KSt4O1xuICAgIHBvbHlnb25lLmxpbmVzLmxpbmVUb3AuYi55ID0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4K3dpZHRoLzIpLXgpICsgTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeSsoaGVpZ2h0Ki0xKS8yKS15KSt5O1xuICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIFxuICAgIGlmKHBvbHlnb25lLmxpbmVzLmxpbmVMZWZ0IT09dW5kZWZpbmVkKXtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lTGVmdC5hLnggPSBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrKHdpZHRoKi0xKS8yKS14KSAtIE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApICogKCh5KyhoZWlnaHQqLTEpLzIpLXkpK3g7XG4gICAgcG9seWdvbmUubGluZXMubGluZUxlZnQuYS55ID0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4Kyh3aWR0aCotMSkvMikteCkgKyBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5KyhoZWlnaHQqLTEpLzIpLXkpK3k7XG4gICAgcG9seWdvbmUubGluZXMubGluZUxlZnQuYi54ID0gTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4Kyh3aWR0aCotMSkvMikteCkgLSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSAqICgoeStoZWlnaHQvMikteSkreDtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lTGVmdC5iLnkgPSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrKHdpZHRoKi0xKS8yKS14KSArIE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkraGVpZ2h0LzIpLXkpK3k7XG4gICAgfVxuICAgICAgICBcblxuICAgIGlmKHBvbHlnb25lLmxpbmVzLmxpbmVSaWdodCE9PXVuZGVmaW5lZCl7XG4gICAgcG9seWdvbmUubGluZXMubGluZVJpZ2h0LmEueCA9IE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCt3aWR0aC8yKS14KSAtIE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApICogKCh5KyhoZWlnaHQqLTEpLzIpLXkpK3g7XG4gICAgcG9seWdvbmUubGluZXMubGluZVJpZ2h0LmEueSA9IE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCt3aWR0aC8yKS14KSArIE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkrKGhlaWdodCotMSkvMikteSkreTtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lUmlnaHQuYi54ID0gTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKCh4K3dpZHRoLzIpLXgpIC0gTWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkgKiAoKHkraGVpZ2h0LzIpLXkpK3g7XG4gICAgcG9seWdvbmUubGluZXMubGluZVJpZ2h0LmIueSA9IE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCt3aWR0aC8yKS14KSArIE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkraGVpZ2h0LzIpLXkpK3k7XG5cbiAgICB9XG4gICAgXG4gICAgICAgIFxuICAgIGlmKHBvbHlnb25lLmxpbmVzLmxpbmVCb3R0b20hPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgLy8gY29zKHRoZXRhKSAqIChweC1veCkgLSBzaW4odGhldGEpICogKHB5LW95KSArIG94XG4gICAgcG9seWdvbmUubGluZXMubGluZUJvdHRvbS5hLnggPSBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrKHdpZHRoKi0xKS8yKS14KSAtIE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApICogKCh5K2hlaWdodC8yKS15KSt4O1xuICAgICAgICAgICAgICAgICAvLyBzaW4odGhldGEpICogKHB4LW94KSArIGNvcyh0aGV0YSkgKiAocHktb3kpICsgb3lcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lQm90dG9tLmEueSA9IE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCsod2lkdGgqLTEpLzIpLXgpICsgTWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqICgoeStoZWlnaHQvMikteSkreTtcbiAgICBwb2x5Z29uZS5saW5lcy5saW5lQm90dG9tLmIueCA9IE1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKigoeCt3aWR0aC8yKS14KSAtIE1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKiAoKHkraGVpZ2h0LzIpLXkpK3g7XG4gICAgcG9seWdvbmUubGluZXMubGluZUJvdHRvbS5iLnkgPSBNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooKHgrd2lkdGgvMikteCkgKyBNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSogKCh5K2hlaWdodC8yKS15KSt5O1xuICAgIH1cblxuICAgLy8gZGVidWdnZXI7ICAgICAgICAgICAgXG59LHtjb21wb25lbnRzIDogW1wicG9zaXRpb25cIixcInNpemVcIixcInBvbHlnb25lXCJdfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpczsgXG4iLCJ2YXIgUHVwcGV0cyAgICA9IHJlcXVpcmUoXCIuLi9saWJzL3B1cHBldHNcIik7XG52YXIgY2FudmFzQ29uZiA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2NvbmZpZ0NhbnZhc1wiKTtcblxuLy8gcHVwcGV0IFN5c3RlbSBEcmF3XG4gICAgXG5QdXBwZXRzLnN5c3RlbShcImRyYXdcIixmdW5jdGlvbihwb2x5Z29uZSxyZW5kZXIsc2l6ZSl7XG4gICAgaWYocmVuZGVyLmN0eCAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgdmFyIGN0eCAgICAgICAgID0gcmVuZGVyLmN0eCxcbiAgICAgICAgICAgIHN0cm9rZWNvbG9yID0gcmVuZGVyLlN0cm9rZWNvbG9yLFxuICAgICAgICAgICAgZmlsbGNvbG9yICAgPSByZW5kZXIuRmlsbGNvbG9yLFxuICAgICAgICAgICAgbGluZVRvcCAgICAgPSBwb2x5Z29uZS5saW5lcy5saW5lVG9wLFxuICAgICAgICAgICAgbGluZUxlZnQgICAgPSBwb2x5Z29uZS5saW5lcy5saW5lTGVmdCxcbiAgICAgICAgICAgIGxpbmVSaWdodCAgID0gcG9seWdvbmUubGluZXMubGluZVJpZ2h0LFxuICAgICAgICAgICAgbGluZUJvdHRvbSAgPSBwb2x5Z29uZS5saW5lcy5saW5lQm90dG9tO1xuXG5cbiAgICAgICAgICAgIC8vIHggICAgICAgICAgID0gcG9zaXRpb24ueCxcbiAgICAgICAgICAgIC8vIHkgICAgICAgICAgID0gcG9zaXRpb24ueSxcbiAgICAgICAgICAgIC8vIGFuZ2xlICAgICAgID0gcG9zaXRpb24uYW5nbGUsXG4gICAgICAgICAgICAvLyB3aWR0aCAgICAgICA9IHNpemUud2lkdGgsXG4gICAgICAgICAgICAvLyBoZWlnaHQgICAgICA9IHNpemUuaGVpZ2h0O1xuICAgICAgICBpZihmaWxsY29sb3IhPT11bmRlZmluZWQpXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlPWZpbGxjb2xvcjtcbiAgICAgICAgaWYoc3Ryb2tlY29sb3IhPT11bmRlZmluZWQpXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGU9c3Ryb2tlY29sb3I7XG5cbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAvLyBtaXNlIGVuIHBsYWNlIGRlIGwnYW5nbGVcbiAgICAgICAgLy8gY3R4LnNhdmUoKTtcbiAgICAgICAgLy8gLy9kZXBsYWNlbWVudCB2ZXJzIGwnb2JqZXQgcGFyIHJhcHBvcnQgw6AgbGEgY2FtZXJhXG4gICAgICAgIC8vIGN0eC50cmFuc2xhdGUoeCx5KTtcbiAgICAgICAgLy8gLy9yb3RhdGUgZHUgY2FudmFzIHBhciBMJ2FuZ2xlIGRlIGwnb2JqZXQgdW5pdHlcbiAgICAgICAgLy8gY3R4LnJvdGF0ZShhbmdsZSpNYXRoLlBJLzE4MCk7XG4gICAgICAgIC8vZGVzc2lucyBkdSByZWN0YW5nbGUgYnkgbGluZXMgZnJvbSBwb3NpdGlvbiB4IGFuZCB5XG4gICAgICAgIC8vIGN0eC5tb3ZlVG8oeCsod2lkdGgqLTEpLzIseSsoaGVpZ2h0Ki0xKS8yKTtcbiAgICAgICAgLy8gY3R4LmxpbmVUbyh4K3dpZHRoLHkrKGhlaWdodCotMSkvMik7XG4gICAgICAgIC8vIGN0eC5saW5lVG8oeCt3aWR0aCx5K2hlaWdodCk7XG4gICAgICAgIC8vIGN0eC5saW5lVG8oeCsod2lkdGgqLTEpLzIseStoZWlnaHQpO1xuICAgICAgICAvLyBjdHgubGluZVRvKHgrKHdpZHRoKi0xKS8yLHkrKGhlaWdodCotMSkvMik7XG4gICAgICAgIFxuICAgICAgICBjdHgubW92ZVRvKGxpbmVUb3AuYS54LGxpbmVUb3AuYS55KTtcbiAgICAgICAgY3R4LmxpbmVUbyhsaW5lUmlnaHQuYS54LGxpbmVSaWdodC5hLnkpO1xuICAgICAgICBjdHgubGluZVRvKGxpbmVCb3R0b20uYi54LGxpbmVCb3R0b20uYi55KTtcbiAgICAgICAgY3R4LmxpbmVUbyhsaW5lTGVmdC5iLngsbGluZUxlZnQuYi55KTtcbiAgICAgICAgY3R4LmxpbmVUbyhsaW5lTGVmdC5hLngsbGluZUxlZnQuYS55KTtcblxuICAgICAgICAvLyBvbiByZXN0YXVyZSBsZSBjYW52YXMgYSBzb24gZXRhdCBvcmlnaW5hbC5cbiAgICAgICAgLy8gY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIG9uIGFycmV0ZSBkZSBkZXNzaW5lclxuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9ICAgXG59LHtjb21wb25lbnRzIDogWydwb2x5Z29uZScsJ3JlbmRlcicsJ3NpemUnXX0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXM7IFxuIiwid2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgR2FtZSA9IHJlcXVpcmUoJy4vbG9hZGVyL2dhbWUnKTtcbiAgICB2YXIgcmVxdWVzdEFuaW1GcmFtZSA9IHJlcXVpcmUoJy4vbGlicy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUnKTtcblxuICAgIChmdW5jdGlvbiBnYW1lbG9vcCgpeyAgICBcbiAgICAgICAgLy8gY2xlYXIgb2YgY2FudmFzICBcbiAgICAgICAgR2FtZS5jdHguY2xlYXJSZWN0KDAsIDAsIEdhbWUuY2FudmFzLndpZHRoLEdhbWUuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIEdhbWUuUHVwcGV0cy5ydW4oKTtcbiAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShnYW1lbG9vcCk7XG5cbiAgICB9KSgpO1xufTsiLCIvLyBjcmVhdGUgYnkgOiB3aW5ja2VsbCBiZW5qYW1pblxyXG4vKlxyXG4qY2xhc3Mgb2YgaW5wdXQgZXZlbnQgZ2VzdGlvbi5cclxuKnRoaXMgbGliIGNhbiBiZSB1c2UgZm9yIG1hbmFnZSBzaW1wbGVzIGlucHV0cyB3aXRoIG11bHRpIGV2ZW50c1xyXG4qTmVlZCB0byBiZSBpbnN0YW5jaWF0ZSBpbiBpbml0IG9mIHlvdXIgZ2FtZS5cclxuXHJcbipIT1cgVE8gQklORCBBIEVWRU5UIFRPIEEgSU5QVVQ6XHJcbiogICBBZGQgaW4geW91ciBhcnJheSBrZXlCaW5kIGxpa2UgVGhhdCA6ICB2YXIga2V5QmluZCA9IHsgS2V5TnVtYmVyT2ZJbnB1dCA6ICB7IGV2ZW50VG9DYWxsIDogZnVuY3Rpb25Ub0FjdGl2ZSgpIH0gfVxyXG4gICAgXHJcblxyXG4qSE9XIFRPIElOU1RBTlRJQVRFIEVhc3lJbnB1dCA6IFxyXG4gICAgXHJcbiAgICAqIHZhciB3aGF0WW91V2FudCA9IG5ldyBFYXN5SW5wdXQoZmlyc3QpIEFyZ3VtZW50IDogLS0+IGZpcnN0IDogb2JqZWN0IG9mIGtleUJpbmRpbmcsd2l0aCBldmVudCBhbmQgZnVuY3Rpb25zIGNhbGwuXHJcblxyXG4gICAgXHJcblxyXG4qTWV0aG9kZXMgb2YgRWFzeUlucHV0IDogXHJcbiogICBhZGRFdmVudChmaXJzdCxzZWNvbmQpIDIgcGFyYW1zIG5lY2Vzc2FyeSAgICAtLT4gZmlyc3QgOiBzdHJpbmcgb2YgdGhlIGV2ZW50IHdobyB3aWxsIGJlIGFkZCAoa2V5ZG93bixrZXl1cCxtb3VzZW1vdmUgZXRjLi4uKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLT4gc2Vjb25kIDogZG9tIG9iamVjdCBsaWtlIHdpbmRvdyBvciBhIGRvY3VtZW50LmdldEVsZW1lbnRCeSBvZiB3aGF0IHlvdSB3YW50O1xyXG4gICAgdXNlIDogZm9yIGFkZCBldmVudCBsaXN0ZW5uZXIgb24gb2JqZWN0O1xyXG4qICAgcmVtb3ZlRXZlbnQoZmlyc3Qsc2Vjb25kKSAyIHBhcmFtcyBuZWNlc3NhcnkgLS0+IGZpcnN0IDogc3RyaW5nIG9mIHRoZSBldmVudCB3aG8gd2lsbCBiZSByZW1vdmUgKGtleWRvd24sa2V5dXAsbW91c2Vtb3ZlIGV0Yy4uLik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLT4gc2Vjb25kIDogZG9tIG9iamVjdCB3aG8gaGFkIGV2ZW50IGxpc3Rlbm5lcjtcclxuICAgIHVzZSA6IGZvciByZW1vdmUgZXZlbnQgbGlzdGVubmVyIG9mIGFuIG9iamVjdDtcclxuKiAgIHNldEtleUJpbmQoZmlyc3Qsc2Vjb25kKSAyIHBhcmFtcyBuZWNlc3NhcnkgIC0tPiBmaXJzdCA6IGludGVnZXIgb2YgdGhlIGtleSB5b3Ugd2FudCB0byBiaW5kIHdpdGggZXZlbnQocykuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tPiBzZWNvbmQgOiBvYmplY3Qgb2YgZXZlbnQocykgeW91IHdhbnQgdG8gdXNlIGFuZCBmdW5jdGlvbiBjYWxsIGJ5IHRoaXMgZXZlbnQ6IHtrZXlwcmVzcyA6IGZ1bmN0aW9uKCl7fSwga2V5ZG93biA6IGZ1bmN0aW9uV2hvRG9Tb21ldGhpbmcgfTtcclxuICAgIHVzZSA6IGZvciBhZGQgb3IgZWRpdCBvbmUga2V5IHdpdGggZXZlbnQocyk7ICAgIFxyXG5cclxuKiAgIGdldEtleXNCaW5kKCkgXHJcbiAgICB1c2UgOiByZXR1cm4geW91IG9iamVjdCB3aG8gY29udGFpbiBhbGwga2V5cyBiaW5kaW5nIGFuZCBhbGwgZXZlbnRzIGNhbGwgZm9yIHRob3NlIGtleXMuXHJcbiovXHJcbnZhciBFYXN5SW5wdXQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHZhciBrZXkgPSB7fTtcclxuICAgIHZhciBEaWN0b25uYXJ5S2V5ID0gIHtcclxuICAgICAgICAwOiBcIlxcXFxcIixcclxuICAgICAgICA4OiBcImJhY2tzcGFjZVwiLFxyXG4gICAgICAgIDk6IFwidGFiXCIsXHJcbiAgICAgICAgMTI6IFwibnVtXCIsXHJcbiAgICAgICAgMTM6IFwiZW50ZXJcIixcclxuICAgICAgICAxNjogXCJzaGlmdFwiLFxyXG4gICAgICAgIDE3OiBcImN0cmxcIixcclxuICAgICAgICAxODogXCJhbHRcIixcclxuICAgICAgICAxOTogXCJwYXVzZVwiLFxyXG4gICAgICAgIDIwOiBcImNhcHNcIixcclxuICAgICAgICAyNzogXCJlc2NcIixcclxuICAgICAgICAzMjogXCJzcGFjZVwiLFxyXG4gICAgICAgIDMzOiBcInBhZ2V1cFwiLFxyXG4gICAgICAgIDM0OiBcInBhZ2Vkb3duXCIsXHJcbiAgICAgICAgMzU6IFwiZW5kXCIsXHJcbiAgICAgICAgMzY6IFwiaG9tZVwiLFxyXG4gICAgICAgIDM3OiBcImxlZnRcIixcclxuICAgICAgICAzODogXCJ1cFwiLFxyXG4gICAgICAgIDM5OiBcInJpZ2h0XCIsXHJcbiAgICAgICAgNDA6IFwiZG93blwiLFxyXG4gICAgICAgIDQ0OiBcInByaW50XCIsXHJcbiAgICAgICAgNDU6IFwiaW5zZXJ0XCIsXHJcbiAgICAgICAgNDY6IFwiZGVsZXRlXCIsXHJcbiAgICAgICAgNDg6IFwiMFwiLFxyXG4gICAgICAgIDQ5OiBcIjFcIixcclxuICAgICAgICA1MDogXCIyXCIsXHJcbiAgICAgICAgNTE6IFwiM1wiLFxyXG4gICAgICAgIDUyOiBcIjRcIixcclxuICAgICAgICA1MzogXCI1XCIsXHJcbiAgICAgICAgNTQ6IFwiNlwiLFxyXG4gICAgICAgIDU1OiBcIjdcIixcclxuICAgICAgICA1NjogXCI4XCIsXHJcbiAgICAgICAgNTc6IFwiOVwiLFxyXG4gICAgICAgIDY1OiBcImFcIixcclxuICAgICAgICA2NjogXCJiXCIsXHJcbiAgICAgICAgNjc6IFwiY1wiLFxyXG4gICAgICAgIDY4OiBcImRcIixcclxuICAgICAgICA2OTogXCJlXCIsXHJcbiAgICAgICAgNzA6IFwiZlwiLFxyXG4gICAgICAgIDcxOiBcImdcIixcclxuICAgICAgICA3MjogXCJoXCIsXHJcbiAgICAgICAgNzM6IFwiaVwiLFxyXG4gICAgICAgIDc0OiBcImpcIixcclxuICAgICAgICA3NTogXCJrXCIsXHJcbiAgICAgICAgNzY6IFwibFwiLFxyXG4gICAgICAgIDc3OiBcIm1cIixcclxuICAgICAgICA3ODogXCJuXCIsXHJcbiAgICAgICAgNzk6IFwib1wiLFxyXG4gICAgICAgIDgwOiBcInBcIixcclxuICAgICAgICA4MTogXCJxXCIsXHJcbiAgICAgICAgODI6IFwiclwiLFxyXG4gICAgICAgIDgzOiBcInNcIixcclxuICAgICAgICA4NDogXCJ0XCIsXHJcbiAgICAgICAgODU6IFwidVwiLFxyXG4gICAgICAgIDg2OiBcInZcIixcclxuICAgICAgICA4NzogXCJ3XCIsXHJcbiAgICAgICAgODg6IFwieFwiLFxyXG4gICAgICAgIDg5OiBcInlcIixcclxuICAgICAgICA5MDogXCJ6XCIsXHJcbiAgICAgICAgOTE6IFwiY21kXCIsXHJcbiAgICAgICAgOTI6IFwiY21kXCIsXHJcbiAgICAgICAgOTM6IFwiY21kXCIsXHJcbiAgICAgICAgOTY6IFwibnVtXzBcIixcclxuICAgICAgICA5NzogXCJudW1fMVwiLFxyXG4gICAgICAgIDk4OiBcIm51bV8yXCIsXHJcbiAgICAgICAgOTk6IFwibnVtXzNcIixcclxuICAgICAgICAxMDA6IFwibnVtXzRcIixcclxuICAgICAgICAxMDE6IFwibnVtXzVcIixcclxuICAgICAgICAxMDI6IFwibnVtXzZcIixcclxuICAgICAgICAxMDM6IFwibnVtXzdcIixcclxuICAgICAgICAxMDQ6IFwibnVtXzhcIixcclxuICAgICAgICAxMDU6IFwibnVtXzlcIixcclxuICAgICAgICAxMDY6IFwibnVtX211bHRpcGx5XCIsXHJcbiAgICAgICAgMTA3OiBcIm51bV9hZGRcIixcclxuICAgICAgICAxMDg6IFwibnVtX2VudGVyXCIsXHJcbiAgICAgICAgMTA5OiBcIm51bV9zdWJ0cmFjdFwiLFxyXG4gICAgICAgIDExMDogXCJudW1fZGVjaW1hbFwiLFxyXG4gICAgICAgIDExMTogXCJudW1fZGl2aWRlXCIsXHJcbiAgICAgICAgMTI0OiBcInByaW50XCIsXHJcbiAgICAgICAgMTQ0OiBcIm51bVwiLFxyXG4gICAgICAgIDE0NTogXCJzY3JvbGxcIixcclxuICAgICAgICAxODY6IFwiO1wiLFxyXG4gICAgICAgIDE4NzogXCI9XCIsXHJcbiAgICAgICAgMTg4OiBcIixcIixcclxuICAgICAgICAxODk6IFwiLVwiLFxyXG4gICAgICAgIDE5MDogXCIuXCIsXHJcbiAgICAgICAgMTkxOiBcIi9cIixcclxuICAgICAgICAxOTI6IFwiYFwiLFxyXG4gICAgICAgIDIxOTogXCJbXCIsXHJcbiAgICAgICAgMjIwOiBcIlxcXFxcIixcclxuICAgICAgICAyMjE6IFwiXVwiLFxyXG4gICAgICAgIDIyMjogXCJcXCdcIixcclxuICAgICAgICAyMjM6IFwiYFwiLFxyXG4gICAgICAgIDIyNDogXCJjbWRcIixcclxuICAgICAgICAyMjU6IFwiYWx0XCIsXHJcbiAgICAgICAgNTczOTI6IFwiY3RybFwiLFxyXG4gICAgICAgIDYzMjg5OiBcIm51bVwiXHJcbiAgICB9O1xyXG4gICAgRWFzeUlucHV0LnByb3RvdHlwZS5hZGRFdmVudCA9IGZ1bmN0aW9uKGlucHV0ICwgdGFyZ2V0KVxyXG4gICAgeyAgIFxyXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGlucHV0LCB0aGlzLmZ1bmN0aW9uQ2FsbCxmYWxzZSk7XHJcbiAgICB9O1xyXG4gICAgRWFzeUlucHV0LnByb3RvdHlwZS5mdW5jdGlvbkNhbGwgPSBmdW5jdGlvbihlKVxyXG4gICAge1xyXG4gICAgICAgIGlmKGtleS5oYXNPd25Qcm9wZXJ0eShlLmtleUNvZGUpICYmIHR5cGVvZiBrZXlbZS5rZXlDb2RlXVtlLnR5cGVdID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgIGtleVtlLmtleUNvZGVdW2UudHlwZV0oZSk7XHJcbiAgICB9O1xyXG4gICAgRWFzeUlucHV0LnByb3RvdHlwZS5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uKGlucHV0ICwgdGFyZ2V0KVxyXG4gICAge1xyXG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGlucHV0LHRoaXMuZnVuY3Rpb25DYWxsLGZhbHNlKTtcclxuICAgIH07XHJcbiAgICBFYXN5SW5wdXQucHJvdG90eXBlLnNldEtleUJpbmQgPSBmdW5jdGlvbihzdWJtaXR0ZWRLZXkgLCBvYmplY3QpXHJcbiAgICB7XHJcbiAgICAgICAgaWYoa2V5Lmhhc093blByb3BlcnR5KHN1Ym1pdHRlZEtleSkgPT09IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHN1Ym1pdHRlZEtleSA9PT0nc3RyaW5nJylcclxuICAgICAgICAgICAgICAgIHZhciBzdWJtaXR0ZWRLZXkgPSB0aGlzLmZpbmRJbktleShzdWJtaXR0ZWRLZXkpO1xyXG5cclxuICAgICAgICAgICAga2V5W3N1Ym1pdHRlZEtleV0gPSBvYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoa2V5Lmhhc093blByb3BlcnR5KHN1Ym1pdHRlZEtleSkpXHJcbiAgICAgICAgeyAgXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzdWJtaXR0ZWRLZXkgPT09J3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICB2YXIgc3VibWl0dGVkS2V5ID0gdGhpcy5maW5kSW5LZXkoc3VibWl0dGVkS2V5KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4IGluIG9iamVjdClcclxuICAgICAgICAgICAgICAgIGtleVtzdWJtaXR0ZWRLZXldW2luZGV4XSA9IG9iamVjdFtpbmRleF07IFxyXG4gICAgICAgIH0gXHJcbiAgICB9O1xyXG4gICAgRWFzeUlucHV0LnByb3RvdHlwZS5nZXRLZXlzQmluZCA9IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgfTtcclxuICAgIEVhc3lJbnB1dC5wcm90b3R5cGUuZmluZEluS2V5ID0gZnVuY3Rpb24oc3VibWl0dGVkS2V5KXtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBmb3IoIGkgaW4gRGljdG9ubmFyeUtleSkge1xyXG4gICAgICAgICAgICBpZiAoRGljdG9ubmFyeUtleVtpXSA9PT0gc3VibWl0dGVkS2V5KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7ICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWFzeUlucHV0O1xyXG4iLCJQdXBwZXRzID0gZnVuY3Rpb24gKGNvbmZpZylcclxue1xyXG4gICAgdGhpcy5BUlJBWSA9IFtdO1xyXG4gICAgdGhpcy5TeXN0ZW1zID1cclxuICAgIHtcclxuICAgICAgICBDT01QT05FTlRTIDogW10sXHJcbiAgICAgICAgb3JkZXIgOiBbXSxcclxuICAgICAgICBsaXN0IDoge30sXHJcbiAgICAgICAgcnVucyA6IDAsXHJcblxyXG4gICAgICAgIGxhdW5jaFN5c3RlbXMgOiBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbmJDb2xsZWN0aW9ucyA9IFB1cHBldHMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBwdXBweSwgcHVwcG8sIGk7XHJcbiAgICAgICAgICAgIHZhciBzeXN0ZW0sIGlkO1xyXG4gICAgICAgICAgICB2YXIgb3JkZXJMZW5ndGggPSB0aGlzLm9yZGVyLmxlbmd0aDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihwdXBweSA9IDA7IHB1cHB5IDwgbmJDb2xsZWN0aW9uczsgcHVwcHkrPTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0gUHVwcGV0cy5FbnRpdGllcy5vcmRlckNvbGxlY3Rpb25zW3B1cHB5XTtcclxuICAgICAgICAgICAgICAgIGZvcihwdXBwbyBpbiBQdXBwZXRzLkVudGl0aWVzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gUHVwcGV0cy5FbnRpdGllcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXVtwdXBwb107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgb3JkZXJMZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgc3lzdGVtID0gdGhpcy5saXN0W3RoaXMub3JkZXJbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHN5c3RlbSAhPT0gdW5kZWZpbmVkICYmIChzeXN0ZW0uZGVsYXkgPT09IHVuZGVmaW5lZCB8fCBzeXN0ZW0uZGVsYXkgPT09IG51bGwgfHwgdGhpcy5ydW5zICUgc3lzdGVtLmRlbGF5ID09PSAwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGxTeXN0ZW0oaWQsIHN5c3RlbS5jb21wb25lbnRzLCBzeXN0ZW0ubWV0aG9kLCBzeXN0ZW0uZGF0YSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJ1bnMrKztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbGxTeXN0ZW0gOiBmdW5jdGlvbihpZCwgbGlzdE9mQ29tcG9uZW50cywgbWV0aG9kLCBkYXRhKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBlbnRpdHkgPSBQdXBwZXRzLkVudGl0aWVzLmxpc3RbaWRdO1xyXG4gICAgICAgICAgICB2YXIgY29tcG9uZW50cyA9IHRoaXMuQ09NUE9ORU5UUztcclxuICAgICAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnQ7XHJcbiAgICAgICAgICAgIGlmKGVudGl0eSAhPT0gbnVsbCAmJiBlbnRpdHkgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbGlzdE9mQ29tcG9uZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSBsaXN0T2ZDb21wb25lbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVudGl0eVtjb21wb25lbnRdID09PSBudWxsIHx8IGVudGl0eVtjb21wb25lbnRdID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgICAgICAgICAgUHVwcGV0cy5Db21wb25lbnRzLmxpc3Q9PT0gbnVsbCB8fCBQdXBwZXRzLkNvbXBvbmVudHMubGlzdCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICFQdXBwZXRzLkNvbXBvbmVudHMubGlzdFtjb21wb25lbnRdW2VudGl0eVtjb21wb25lbnRdXS5lbmFibGVkKSBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NUE9ORU5UUy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLnB1c2goUHVwcGV0cy5Db21wb25lbnRzLmxpc3RbY29tcG9uZW50XVtlbnRpdHlbY29tcG9uZW50XV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGlkKTtcclxuICAgICAgICAgICAgICAgIG1ldGhvZC5hcHBseShkYXRhLCBjb21wb25lbnRzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ09NUE9ORU5UUy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2FkIDogZnVuY3Rpb24obmFtZSwgbWV0aG9kLCBkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5saXN0W25hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5saXN0W25hbWVdICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTmFtZSBcIituYW1lK1wiIG92ZXJyaWRlZCBieSBzeXN0ZW0gXCIrbWV0aG9kKTtcclxuICAgICAgICAgICAgaWYoZGF0YSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBjb25zb2xlLmVycm9yKFwiZGF0YSBhcmd1bWVudCBjYW4gbm90IGJlIHVuZGVmaW5lZFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5saXN0W25hbWVdID0geyBjb21wb25lbnRzIDogZGF0YS5jb21wb25lbnRzLCBtZXRob2QgOiBtZXRob2QgLCBkZWxheSA6IGRhdGEuZGVsYXksIGRhdGEgOiBkYXRhfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbmRleFN5c3RlbSA9IHRoaXMub3JkZXIuaW5kZXhPZihuYW1lKTtcclxuICAgICAgICAgICAgaWYoaW5kZXhTeXN0ZW0gPj0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMub3JkZXIuc3BsaWNlKGluZGV4U3lzdGVtLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZihkYXRhLnBvc2l0aW9uKSA9PT0gJ251bWJlcicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yZGVyLnNwbGljZShkYXRhLnBvc2l0aW9uLCAwLCBuYW1lKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmRlci5wdXNoKG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLkVudGl0aWVzID1cclxuICAgIHtcclxuICAgICAgICBtb2RlbHMgOiB7fSxcclxuICAgICAgICBsaXN0IDoge30sXHJcbiAgICAgICAgY29sbGVjdGlvbnMgOiB7fSxcclxuICAgICAgICBvcmRlckNvbGxlY3Rpb25zIDogW10sXHJcbiAgICAgICAgbGVuZ3RoIDogMCxcclxuXHJcbiAgICAgICAgY291bnQgOiBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBlbnRpdHkgaW4gdGhpcy5saXN0KSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGlzdC5oYXNPd25Qcm9wZXJ0eShlbnRpdHkpKSBcclxuICAgICAgICAgICAgICAgICAgICsrY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3JlYXRlRW50aXR5IDogZnVuY3Rpb24obW9kZWwsIGNvbnN0cnVjdG9yLCBjb2xsZWN0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5tb2RlbHNbbW9kZWxdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkVudGl0eSBcIittb2RlbCtcIiBkb2Vzbid0IGV4aXN0IGluIFB1cHBldCwgeW91IGhhdmUgdG8gbG9hZCBpdFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtb2RlbCA9IHRoaXMubW9kZWxzW21vZGVsXTtcclxuICAgICAgICAgICAgdmFyIGVudGl0eSA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgYXJndW1lbnQgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGxlbmd0aENvbXBvbmVudHMgPSBtb2RlbC5jb21wb25lbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGksIG8sIGlkO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoQ29tcG9uZW50czsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgbW9kZWwuY29tcG9uZW50c1tpXSA9PT0gXCJvYmplY3RcIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50ID0gT2JqZWN0LmtleXMobW9kZWwuY29tcG9uZW50c1tpXSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKGNvbnN0cnVjdG9yW2NvbXBvbmVudF0pICE9PSAnb2JqZWN0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3JbY29tcG9uZW50XSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKG8gaW4gbW9kZWwuY29tcG9uZW50c1tpXVtjb21wb25lbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29uc3RydWN0b3JbY29tcG9uZW50XVtvXSAhPT0gdW5kZWZpbmVkICYmIGNvbnN0cnVjdG9yW2NvbXBvbmVudF1bb10gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5jb21wb25lbnRzW2ldW2NvbXBvbmVudF1bb10gPSBjb25zdHJ1Y3Rvcltjb21wb25lbnRdW29dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvcltjb21wb25lbnRdW29dID0gbW9kZWwuY29tcG9uZW50c1tpXVtjb21wb25lbnRdW29dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSBtb2RlbC5jb21wb25lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGNvbnN0cnVjdG9yW2NvbXBvbmVudF0gIT09IHVuZGVmaW5lZCAmJiBjb25zdHJ1Y3Rvcltjb21wb25lbnRdICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gUHVwcGV0cy5Db21wb25lbnRzLmFkZENvbXBvbmVudCh0aGlzLmxlbmd0aCwgY29tcG9uZW50LCBjb25zdHJ1Y3Rvcltjb21wb25lbnRdLCBjb25zdHJ1Y3Rvcltjb21wb25lbnRdLmVuYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gUHVwcGV0cy5Db21wb25lbnRzLmFkZENvbXBvbmVudCh0aGlzLmxlbmd0aCwgY29tcG9uZW50LCBjb25zdHJ1Y3Rvcltjb21wb25lbnRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdHlbY29tcG9uZW50XSA9IGlkO1xyXG4gICAgICAgICAgICAgICAgYXJndW1lbnRbY29tcG9uZW50XSA9IFB1cHBldHMuQ29tcG9uZW50cy5saXN0W2NvbXBvbmVudF1baWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdFtpZF0gPSBlbnRpdHk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbl0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXVtpZF0gPSBcIlwiK2lkK1wiXCI7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbnMud29ybGRbaWRdID0gXCJcIitpZCtcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoLTE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRDb21wb25lbnQgOiBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudCwgc2V0dGluZ3MsIGVuYWJsZWQsIHVuZGVmaW5lZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGVudGl0eSkpXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkgPSBbZW50aXR5XTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBpZDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgcHVwcHkgPSAwOyBwdXBweSA8IGVudGl0eS5sZW5ndGg7IHB1cHB5KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmxpc3RbZW50aXR5W3B1cHB5XV0uaGFzT3duUHJvcGVydHkoY29tcG9uZW50KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IFB1cHBldHMuQ29tcG9uZW50cy5hZGRDb21wb25lbnQoZW50aXR5W3B1cHB5XSwgY29tcG9uZW50LCBzZXR0aW5ncywgZW5hYmxlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0W2VudGl0eVtwdXBweV1dW2NvbXBvbmVudF0gPSBpZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVDb21wb25lbnQgOiBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudCwgdW5kZWZpbmVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkoZW50aXR5KSlcclxuICAgICAgICAgICAgICAgIGVudGl0eSA9IFtlbnRpdHldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGlkO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciBwdXBweSA9IDA7IHB1cHB5IDwgZW50aXR5Lmxlbmd0aDsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5saXN0W2VudGl0eVtwdXBweV1dLmhhc093blByb3BlcnR5KGNvbXBvbmVudCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLmxpc3RbZW50aXR5W3B1cHB5XV1bY29tcG9uZW50XTtcclxuICAgICAgICAgICAgICAgICAgICBQdXBwZXRzLkNvbXBvbmVudHMucmVtb3ZlQ29tcG9uZW50KGlkLCBjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RbZW50aXR5W3B1cHB5XV1bY29tcG9uZW50XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlRW50aXR5IDogZnVuY3Rpb24oZW50aXR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGVudGl0eSA9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gZW50aXR5LnNwbGl0KCcuJyk7XHJcblxyXG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShlbnRpdHkpKVxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gW2VudGl0eV07XHJcblxyXG4gICAgICAgICAgICB2YXIgbmIgPSBlbnRpdHkubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgcHVwcHk7XHJcbiAgICAgICAgICAgIHZhciBlLCBwdXBwbztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihwdXBweSA9IDA7IHB1cHB5IDwgbmI7IHB1cHB5KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGUgPSBlbnRpdHlbcHVwcHldO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5saXN0W2VdICE9PSBudWxsICYmIHRoaXMubGlzdFtlXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihwdXBwbyBpbiB0aGlzLmNvbGxlY3Rpb25zKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jb2xsZWN0aW9uc1twdXBwb11bZV0gIT09IG51bGwgJiYgdGhpcy5jb2xsZWN0aW9uc1twdXBwb11bZV0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29sbGVjdGlvbnNbcHVwcG9dW2VdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMubGlzdFtlXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3dpdGNoQ29sbGVjdGlvbiA6IGZ1bmN0aW9uKGVudGl0eSwgY29sbGVjdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbnNdICE9PSBudWxsICYmIHRoaXMuY29sbGVjdGlvbnNbY29sbGVjdGlvbnNdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGVudGl0eSkpXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkgPSBbZW50aXR5XTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIHB1cHB5O1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdmVFbnRpdHksIHB1cHBvO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IocHVwcHkgPSAwOyBwdXBweSA8IGVudGl0eS5sZW5ndGg7IHB1cHB5KyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGVudGl0eVtwdXBweV0gPT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUVudGl0eSA9IFwiXCIrZW50aXR5W3B1cHB5XStcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUVudGl0eSA9IGVudGl0eVtwdXBweV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihwdXBwbyBpbiB0aGlzLmNvbGxlY3Rpb25zKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jb2xsZWN0aW9uc1twdXBwb10uaW5kZXhPZihtb3ZlRW50aXR5KSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5jb2xsZWN0aW9uc1twdXBwb11bbW92ZUVudGl0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dW21vdmVFbnRpdHldID0gbW92ZUVudGl0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvcHkgOiBmdW5jdGlvbihlbnRpdHksIG51bWJlciwgY29sbGVjdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGVudGl0eSA9IGFycmF5emF0aW9uKGVudGl0eSk7XHJcbiAgICAgICAgICAgIHZhciBuYiA9IGVudGl0eS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBpZih0eXBlb2YgbnVtYmVyICE9PSBcIm51bWJlclwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGNvbGxlY3Rpb24gPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgY29sbGVjdGlvbiAhPT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBcIndvcmxkXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIHB1cHB5ID0gMDsgcHVwcHkgPCBuYjsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvcHkgPSBlbnRpdHlbcHVwcHldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHB1cHBvLCBwdXBwYTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdDb3B5LCBjb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5saXN0W2NvcHldICE9PSB1bmRlZmluZWQgJiYgdGhpcy5saXN0W2NvcHldICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihwdXBwbyA9IDA7IHB1cHBvIDwgbnVtYmVyOyBwdXBwbysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5saXN0W2NvcHldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihwdXBwYSBpbiBuZXdDb3B5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvciA9IFB1cHBldHMuQ29tcG9uZW50cy5saXN0W3B1cHBhXVtuZXdDb3B5W3B1cHBhXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDb3B5W3B1cHBhXSA9IFB1cHBldHMuQ29tcG9uZW50cy5hZGRDb21wb25lbnQoY29weSwgcHVwcGEsIGNvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RbdGhpcy5sZW5ndGhdID0gbmV3Q29weTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpbmQgOiBmdW5jdGlvbihjbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2x1ZSA9IHRoaXMuX2FuYWx5c2VTdHJpbmcoY2x1ZSk7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcy5saXN0O1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgY2x1ZSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIHB1cHB5IGluIGxpc3QpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGlzdFtwdXBweV0uaGFzT3duUHJvcGVydHkoY2x1ZS5jbHVlKSAmJiBGdW5jdGlvbihcIm9iamVjdFwiLCBjbHVlLmNvbXBhcmUpKFB1cHBldHMuQ29tcG9uZW50cy5saXN0W2NsdWUuY2x1ZV1bbGlzdFtwdXBweV1bY2x1ZS5jbHVlXV0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocHVwcHkpOyAgICBcclxuICAgICAgICAgICAgICAgIH0gICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIHB1cHB5IGluIGxpc3QpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGlzdFtwdXBweV0uaGFzT3duUHJvcGVydHkoY2x1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChwdXBweSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfYW5hbHlzZVN0cmluZyA6IGZ1bmN0aW9uKGNsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjbHVlID0gY2x1ZS5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgICAgIGlmKGNsdWUubGVuZ3RoIDw9IDEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2x1ZVswXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7Y2x1ZSA6IGNsdWVbMF0sIGNvbXBhcmUgOiBcImlmKG9iamVjdC5cIitjbHVlWzFdK1wiKXtyZXR1cm4gdHJ1ZTt9ZWxzZXtyZXR1cm4gZmFsc2V9XCJ9O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldENvbXBvbmVudHMgOiBmdW5jdGlvbihlbnRpdHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShlbnRpdHkpKVxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gW2VudGl0eV07XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIHZhciBwdXBweSwgcHVwcG87XHJcbiAgICAgICAgICAgIHZhciByZWZDb21wLCByZXN1bHQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IocHVwcHkgPSAwOyBwdXBweSA8IGVudGl0eS5sZW5ndGg7IHB1cHB5KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcmVmQ29tcCA9IHRoaXMubGlzdFtlbnRpdHlbcHVwcHldXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihyZWZDb21wICE9PSB1bmRlZmluZWQgJiYgcmVmQ29tcCAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IocHVwcG8gaW4gcmVmQ29tcClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3B1cHBvXSA9IFB1cHBldHMuQ29tcG9uZW50cy5saXN0W3B1cHBvXVtyZWZDb21wW3B1cHBvXV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtwdXBweV0gPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXJnZSA6IGZ1bmN0aW9uKGNyZWF0ZU5ldywgcGFyYW1zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA8IDQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZihwYXJhbXMgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMgPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbnRpdGllc1RvTWVyZ2UgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHB1cHB5LCBwdXBwbztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihwdXBweSA9IDI7IHB1cHB5IDwgYXJndW1lbnRzLmxlbmd0aDsgcHVwcHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhcmd1bWVudHNbcHVwcHldKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IocHVwcG8gPSAwOyBwdXBwbyA8IGFyZ3VtZW50c1twdXBweV0ubGVuZ3RoOyBwdXBwbysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGFyZ3VtZW50c1twdXBweV1bcHVwcG9dID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGFyZ3VtZW50c1twdXBweV1bcHVwcG9dID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdGllc1RvTWVyZ2UucHVzaChhcmd1bWVudHNbcHVwcHldW3B1cHBvXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0eXBlb2YgYXJndW1lbnRzW3B1cHB5XSA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBhcmd1bWVudHNbcHVwcHldID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXRpZXNUb01lcmdlLnB1c2goYXJndW1lbnRzW3B1cHB5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50aXRpZXNUb01lcmdlID0gdGhpcy5nZXRDb21wb25lbnRzKGVudGl0aWVzVG9NZXJnZSk7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9hZCA6IGZ1bmN0aW9uKG5hbWUsIGNvbnN0cnVjdG9yKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5tb2RlbHNbbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLm1vZGVsc1tuYW1lXSAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5hbWUgXCIrbmFtZStcIiBvdmVycmlkZWQgYnkgZW50aXR5IFwiK2NvbnN0cnVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWxzW25hbWVdID0ge2NvbXBvbmVudHMgOiBjb25zdHJ1Y3Rvci5jb21wb25lbnRzLCBkYXRhIDogY29uc3RydWN0b3IuZGF0YSB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLkNvbXBvbmVudHMgPVxyXG4gICAge1xyXG4gICAgICAgIG1vZGVscyA6IHt9LFxyXG4gICAgICAgIGxpc3QgOiB7fSxcclxuICAgICAgICBsZW5ndGggOiB7fSxcclxuXHJcbiAgICAgICAgY291bnQgOiBmdW5jdGlvbihjb21wb25lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBlbGVtZW50IGluIHRoaXMubGlzdFtjb21wb25lbnRdKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGlzdFtjb21wb25lbnRdLmhhc093blByb3BlcnR5KGVsZW1lbnQpKSBcclxuICAgICAgICAgICAgICAgICAgICsrY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkQ29tcG9uZW50IDogZnVuY3Rpb24oZW50aXR5LCBjb21wb25lbnQsIGNvbnN0cnVjdG9yLCBlbmFibGVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5saXN0W2NvbXBvbmVudF0gPT09IG51bGwgfHwgdGhpcy5saXN0W2NvbXBvbmVudF0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0W2NvbXBvbmVudF0gPSB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoW2NvbXBvbmVudF0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmxlbmd0aFtjb21wb25lbnRdO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RbY29tcG9uZW50XVtpZF0gPSB0aGlzLm1vZGVsc1tjb21wb25lbnRdLmNvbnN0cnVjdG9yKGNvbnN0cnVjdG9yIHx8IHt9LCBlbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgaWYoZW5hYmxlZCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0W2NvbXBvbmVudF1baWRdLmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RbY29tcG9uZW50XVtpZF0uZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aFtjb21wb25lbnRdKys7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVDb21wb25lbnQgOiBmdW5jdGlvbihpZCwgY29tcG9uZW50LCB1bmRlZmluZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmxpc3RbY29tcG9uZW50XVtpZF0gIT09IG51bGwgJiYgdGhpcy5saXN0W2NvbXBvbmVudF1baWRdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RbY29tcG9uZW50XVtpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvYWQgOiBmdW5jdGlvbihuYW1lLCBjb25zdHJ1Y3RvciwgZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMubW9kZWxzW25hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5tb2RlbHNbbmFtZV0gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJOYW1lIFwiK25hbWUrXCIgb3ZlcnJpZGVkIGJ5IGNvbXBvbmVudCBcIisgY29uc3RydWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RlbHNbbmFtZV0gPSB7Y29uc3RydWN0b3IgOiBjb25zdHJ1Y3RvciwgZGF0YSA6IGRhdGEgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbiAgICB2YXIgYXJyYXl6YXRpb24gPSBmdW5jdGlvbih2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICBpZighQXJyYXkuaXNBcnJheSh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW3ZhbHVlXTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbihzZWxmKVxyXG4gICAge1xyXG4gICAgICAgIHdpbmRvdy5QdXBwZXRzID0gc2VsZjtcclxuICAgICAgICBpZih0eXBlb2YoY29uZmlnKSA9PT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgc2VsZi5sb2FkKGNvbmZpZyk7XHJcblxyXG4gICAgICAgIGlmKHNlbGYuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5pbmRleE9mKFwid29ybGRcIikgPCAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5FbnRpdGllcy5jb2xsZWN0aW9ucy53b3JsZCA9IHt9O1xyXG4gICAgICAgICAgICBzZWxmLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnMucHVzaChcIndvcmxkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0odGhpcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblB1cHBldHMucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5TeXN0ZW1zLmxhdW5jaFN5c3RlbXMoKTtcclxufTtcclxuXHJcblB1cHBldHMucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihjbHVlLCBhcGxhbmUpXHJcbntcclxuICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICBpZihhcGxhbmUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICBhcGxhbmUgPSB0cnVlO1xyXG4gICAgXHJcbiAgICBjbHVlID0gY2x1ZS5zcGxpdCgnLCcpO1xyXG5cclxuICAgIHZhciBuYiA9IGNsdWUubGVuZ3RoO1xyXG4gICAgdmFyIHB1cHB5LCBwdXBwbztcclxuICAgIFxyXG4gICAgZm9yKHB1cHB5ID0gMDsgcHVwcHkgPCBuYjsgcHVwcHkrKylcclxuICAgIHtcclxuICAgICAgICBpZihjbHVlW3B1cHB5XS5zbGljZSgwLCAxKSA9PSBcIi5cIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLkVudGl0aWVzLmNvbGxlY3Rpb25zW2NsdWVbcHVwcHldLnNsaWNlKDEpXSk7XHJcbiAgICAgICAgICAgIHZhciB0bXAgPSBbXTtcclxuICAgICAgICAgICAgZm9yKHB1cHBvIGluIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGgtMV0pXHJcbiAgICAgICAgICAgICAgICB0bXAucHVzaChyZXN1bHRzW3Jlc3VsdHMubGVuZ3RoLTFdW3B1cHBvXSk7XHJcblxyXG4gICAgICAgICAgICByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoLTFdID0gdG1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLkVudGl0aWVzLmZpbmQoY2x1ZVtwdXBweV0pKTtcclxuICAgIH1cclxuXHJcbiAgICBpZihhcGxhbmUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHRtcCA9IFtdO1xyXG4gICAgICAgIHZhciBhcnJheTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IocHVwcHkgPSAwOyBwdXBweSA8IHJlc3VsdHMubGVuZ3RoOyBwdXBweSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYXJyYXkgPSByZXN1bHRzW3B1cHB5XTtcclxuICAgICAgICAgICAgZm9yKHB1cHBvID0gMDsgcHVwcG8gPCBhcnJheS5sZW5ndGg7IHB1cHBvKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHRtcC5pbmRleE9mKGFycmF5W3B1cHBvXSkgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRtcC5wdXNoKGFycmF5W3B1cHBvXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0cyA9IHRtcDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxufTtcclxuXHJcblB1cHBldHMucHJvdG90eXBlLnJlbW92ZUVudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSlcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMucmVtb3ZlRW50aXR5KGVudGl0eSk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLnJlbW92ZUNvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50KVxyXG57XHJcbiAgICByZXR1cm4gdGhpcy5FbnRpdGllcy5yZW1vdmVDb21wb25lbnQoZW50aXR5LCBjb21wb25lbnQpO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5hZGRDb21wb25lbnQgPSBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudCwgc2V0dGluZ3MsIGVuYWJsZWQsIHVuZGVmaW5lZClcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMuYWRkQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50LCBzZXR0aW5ncywgZW5hYmxlZCk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmNyZWF0ZUVudGl0eSA9IGZ1bmN0aW9uKG1vZGVsLCBjb25zdHJ1Y3RvciwgY29sbGVjdGlvbilcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMuY3JlYXRlRW50aXR5KG1vZGVsLCBjb25zdHJ1Y3RvciwgY29sbGVjdGlvbik7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmdldENvbXBvbmVudHMgPSBmdW5jdGlvbihlbnRpdHkpXHJcbntcclxuICAgIHJldHVybiB0aGlzLkVudGl0aWVzLmdldENvbXBvbmVudHMoZW50aXR5KTtcclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUuc3dpdGNoQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGVudGl0eSwgY29sbGVjdGlvbilcclxue1xyXG4gICAgcmV0dXJuIHRoaXMuRW50aXRpZXMuc3dpdGNoQ29sbGVjdGlvbihlbnRpdHksIGNvbGxlY3Rpb24pO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24oZW50aXR5LCBudW1iZXIsIGNvbGxlY3Rpb24pXHJcbntcclxuICAgIHJldHVybiB0aGlzLkVudGl0aWVzLmNvcHkoZW50aXR5LCBudW1iZXIsIGNvbGxlY3Rpb24pO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24oZmlsZSwgc3VjY2VzcywgZXJyb3IpXHJcbntcclxuICAgIHZhciByZXF1ZXN0ID1uZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBmaWxlLCBmYWxzZSk7XHJcbiAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIGlmKHJlcXVlc3QucmVzcG9uc2UgPT09IFwiXCIpXHJcbiAgICB7XHJcbiAgICAgICAgaWYodHlwZW9mKGVycm9yKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgZXJyb3IocmVxdWVzdC5yZXNwb25zZSk7XHJcblxyXG4gICAgICAgIHRocm93IGNvbnNvbGUud2FybihcIkFuIGVycm9yIG9jY3VyZWQgbG9hZGluZyBcIitmaWxlKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZih0eXBlb2Yoc3VjY2VzcykgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBzdWNjZXNzKHJlcXVlc3QucmVzcG9uc2UpO1xyXG5cclxuICAgIHZhciBtb2R1bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIG1vZHVsZS5pbm5lckhUTUwgPSByZXF1ZXN0LnJlc3BvbnNlO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2R1bGUpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChtb2R1bGUpO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5lbnRpdHkgPSBmdW5jdGlvbihuYW1lLCBkYXRhKXtcclxuICAgIHJldHVybiB0aGlzLkVudGl0aWVzLmxvYWQobmFtZSwgZGF0YSk7XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLmNvbXBvbmVudCA9IGZ1bmN0aW9uKG5hbWUsIG1ldGhvZCwgZGF0YSl7XHJcbiAgICByZXR1cm4gdGhpcy5Db21wb25lbnRzLmxvYWQobmFtZSwgbWV0aG9kLCBkYXRhKTtcclxufTtcclxuUHVwcGV0cy5wcm90b3R5cGUuc3lzdGVtID0gZnVuY3Rpb24obmFtZSwgbWV0aG9kLCBkYXRhKXtcclxuICAgIHJldHVybiB0aGlzLlN5c3RlbXMubG9hZChuYW1lLCBtZXRob2QsIGRhdGEpO1xyXG59O1xyXG5QdXBwZXRzLnByb3RvdHlwZS5jb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgcG9zaXRpb24pe1xyXG4gICAgaWYoQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnMgPSBjb2xsZWN0aW9uO1xyXG4gICAgICAgIGZvcih2YXIgcHVwcHkgPSAwOyBwdXBweSA8IGNvbGxlY3Rpb24ubGVuZ3RoOyBwdXBweSs9MSlcclxuICAgICAgICAgICAgdGhpcy5FbnRpdGllcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uW3B1cHB5XV0gPSB7fTtcclxuXHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiU2V0IG5ldyBjb2xsZWN0aW9uIGxpc3QgOiBcIitjb2xsZWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYodHlwZW9mKGNvbGxlY3Rpb24pID09PSBcInN0cmluZ1wiKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBpbmRleENvbGxlY3Rpb24gPSB0aGlzLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnMuaW5kZXhPZihjb2xsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYoaW5kZXhDb2xsZWN0aW9uID49IDApXHJcbiAgICAgICAgICAgIHRoaXMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5zcGxpY2UoaW5kZXhDb2xsZWN0aW9uLCAxKTtcclxuXHJcbiAgICAgICAgaWYodHlwZW9mKHBvc2l0aW9uKSAhPT0gXCJudW1iZXJcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuRW50aXRpZXMub3JkZXJDb2xsZWN0aW9ucy5wdXNoKGNvbGxlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5FbnRpdGllcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ29sbGVjdGlvbiBcIitjb2xsZWN0aW9uK1wiIG92ZXJyaWRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLkVudGl0aWVzLm9yZGVyQ29sbGVjdGlvbnMuc3BsaWNlKHBvc2l0aW9uLCAwLCBjb2xsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5FbnRpdGllcy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXSA9IHt9O1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcIkNhbiBub3Qgc2V0IGNvbGxlY3Rpb24gOiBcIitjb2xsZWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn07XHJcblB1cHBldHMucHJvdG90eXBlLnN5c3RlbUxpc3QgPSBmdW5jdGlvbihsaXN0KVxyXG57XHJcbiAgICBpZihBcnJheS5pc0FycmF5KGxpc3QpKVxyXG4gICAgICAgIHRoaXMuU3lzdGVtcy5vcmRlciA9IGxpc3Q7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuU3lzdGVtcy5vcmRlcjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IFB1cHBldHMoKTtcclxuIiwiXG52YXIgcmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuICAgIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgfHxcbiAgICAgICAgZnVuY3Rpb24oIGNhbGxiYWNrICl7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdEFuaW1GcmFtZTsiLCIvLyByZXF1aXJlIE9mIGFsbCBmaWxlcyBOZWVkZWRcbnZhciBQdXBwZXRzICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vbGlicy9wdXBwZXRzXCIpO1xudmFyIEVhc3lJbnB1dHMgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9saWJzL0Vhc3lJbnB1dFwiKTtcbnZhciBFdmVudENvbnRyb2xsZXIgICAgICAgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9FdmVudENvbnRyb2xsZXJcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xucmVxdWlyZShcIi4uL3B1cHBldHNNb2R1bGVzL2Jsb2NQYXR0ZXJuXCIpO1xucmVxdWlyZShcIi4uL3B1cHBldHNNb2R1bGVzL3dhbGxcIik7XG5yZXF1aXJlKFwiLi4vU3lzdGVtcy9yZW5kZXJcIik7XG5yZXF1aXJlKFwiLi4vU3lzdGVtcy9jb2xsaWRlclwiKTtcbnJlcXVpcmUoXCIuLi9TeXN0ZW1zL3BvbHlnb25lVXBkYXRlXCIpO1xudmFyIG1vZHVsZVBsYXllciAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9wdXBwZXRzTW9kdWxlcy9QbGF5ZXJcIik7XG5yZXF1aXJlKFwiLi4vcHVwcGV0c01vZHVsZXMvY2FtZXJhXCIpO1xucmVxdWlyZShcIi4uL1N5c3RlbXMvY2FtZXJhRm9jdXNcIik7XG5cblxudmFyIEdhbWUgPSB7XG4gICAgICAgICAgICAgICAgUHVwcGV0cyAgICAgICAgICA6IFB1cHBldHMsXG4gICAgICAgICAgICAgICAgSW5wdXRzICAgICAgICAgICA6IG5ldyBFYXN5SW5wdXRzKCksXG4gICAgICAgICAgICAgICAgY3R4ICAgICAgICAgICAgICA6IGNhbnZhc0NvbmYuY3R4LFxuICAgICAgICAgICAgICAgIGNhbnZhcyAgICAgICAgICAgOiBjYW52YXNDb25mLmRvbUNhbnZhcyxcbiAgICAgICAgICAgICAgICBwbGF5ZXJDb250cm9sbGVyIDogbW9kdWxlUGxheWVyLFxuICAgICAgICAgICAgICAgIGV2ZW50Q29udHJvbGxlciAgOiBFdmVudENvbnRyb2xsZXJcbiAgICAgICAgICAgIH07XG5cblxuLy8gYWRkIG9mIGlucHV0IGNvbnRyb2xzXG5HYW1lLklucHV0cy5hZGRFdmVudChcImtleWRvd25cIiwgd2luZG93KTtcbkdhbWUuSW5wdXRzLmFkZEV2ZW50KFwidG91Y2hlbmRcIiwgd2luZG93KTtcblxuR2FtZS5JbnB1dHMuc2V0S2V5QmluZCgwLHtcInRvdWNoZW5kXCI6ZnVuY3Rpb24gKCl7R2FtZS5ldmVudENvbnRyb2xsZXIuZW1pdChcImdvLWZvcndhcmRcIik7fX0pO1xuLy8gR2FtZS5JbnB1dHMuc2V0S2V5QmluZCgwLHtcInRvdWNoZW5kXCI6ZnVuY3Rpb24gKCl7R2FtZS5ldmVudENvbnRyb2xsZXIuZW1pdChcInJlYm91bmRcIik7fX0pO1xuXG4vLyBjb25zb2xlLmxvZyhHYW1lLklucHV0cy5nZXRLZXlzQmluZCgpKTtcblxuLy8gY3JlYXRlIGVudGl0aWVzIFxuXG4vLyBleHBvcnQgYnJvd3NlcmlmeSBcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsIlxudmFyIEV2ZW50c0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKXsgfTtcbiAgICBcbiAgICBFdmVudHNDb250cm9sbGVyLnByb3RvdHlwZS5ldmVudHMgPSB7fTtcblxuICAgIEV2ZW50c0NvbnRyb2xsZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG15RXZlbnQsbXlGdW5jdGlvbil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ldmVudHNbbXlFdmVudF0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbbXlFdmVudF09W107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tteUV2ZW50XS5wdXNoKG15RnVuY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzW215RXZlbnRdLmxlbmd0LTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgRXZlbnRzQ29udHJvbGxlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgRXZlbnRzQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0RXZlbnQgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0cmluZy5pbmRleE9mKCcqJykhPT0tMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2ZW50cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihzdHJpbmcuaW5kZXhPZignKicpPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFycmF5ICA9IHN0cmluZy5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZXRFdmVudCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamV0RXZlbnRbYXJyYXlbaW5kZXhdXSA9IHRoaXMuZXZlbnRzW2FycmF5W2luZGV4XV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZXRFdmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnZhciBjb250cm9sbGVyID0gbmV3IEV2ZW50c0NvbnRyb2xsZXIoKTtcbi8vIGV4cG9ydCBicm93c2VyaWZ5IFxubW9kdWxlLmV4cG9ydHMgPSBjb250cm9sbGVyO1xuIiwidmFyIGJhc2ljID0ge307XG5iYXNpYy5jb21wdXRlUG9seWdvbmU9IGZ1bmN0aW9uKHNoYXBlLHgseSx3aWR0aCxoZWlnaHQsYW5nbGUpe1xuICAgIGNvbnNvbGUubG9nKHNoYXBlKVxuICAgIGlmKHNoYXBlID09PSBcInNxdWFyZVwiKXtcblxuICAgICAgICB2YXIgX2xpbmVUb3AgPSB7YTp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCsod2lkdGgqLTEpLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkrKGhlaWdodCotMSkvMil9LGI6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrd2lkdGgvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeSsoaGVpZ2h0Ki0xKS8yKX19O1xuICAgICAgICB2YXIgX2xpbmVCb3R0b20gPSB7YTp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCsod2lkdGgqLTEpLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkraGVpZ2h0LzIpfSxiOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4K3dpZHRoLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkraGVpZ2h0LzIpfX07XG4gICAgICAgIHZhciBfbGluZUxlZnQgPSB7YTp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCsod2lkdGgqLTEpLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkrKGhlaWdodCotMSkvMil9LGI6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrKHdpZHRoKi0xKS8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5K2hlaWdodC8yKX19O1xuICAgICAgICB2YXIgX2xpbmVSaWdodCA9IHthOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4K3dpZHRoLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkrKGhlaWdodCotMSkvMil9LGI6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrd2lkdGgvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeStoZWlnaHQvMil9fTtcblxuICAgICAgICByZXR1cm4geydsaW5lVG9wJzpfbGluZVRvcCwnbGluZUJvdHRvbSc6X2xpbmVCb3R0b20sJ2xpbmVSaWdodCc6X2xpbmVSaWdodCwnbGluZUxlZnQnOl9saW5lTGVmdH07XG4gICAgfVxuICAgIGVsc2UgaWYoc2hhcGU9PT1cIlZlcnRpY2FsTGluZVwiKXtcbiAgICAgICAgdmFyIF9saW5lTGVmdCA9IHthOnt4Ok1hdGguY29zKGFuZ2xlKk1hdGguUEkgLyAxODApKih4Kyh3aWR0aCotMSkvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeSsoaGVpZ2h0Ki0xKS8yKX0sYjp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCsod2lkdGgqLTEpLzIpLHk6TWF0aC5zaW4oYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHkraGVpZ2h0LzIpfX07XG4gICAgICAgIHZhciBfbGluZVJpZ2h0ID0ge2E6e3g6TWF0aC5jb3MoYW5nbGUqTWF0aC5QSSAvIDE4MCkqKHgrd2lkdGgvMikseTpNYXRoLnNpbihhbmdsZSpNYXRoLlBJIC8gMTgwKSooeSsoaGVpZ2h0Ki0xKS8yKX0sYjp7eDpNYXRoLmNvcyhhbmdsZSpNYXRoLlBJIC8gMTgwKSooeCt3aWR0aC8yKSx5Ok1hdGguc2luKGFuZ2xlKk1hdGguUEkgLyAxODApKih5K2hlaWdodC8yKX19O1xuICAgICAgICByZXR1cm4geydsaW5lUmlnaHQnOl9saW5lUmlnaHQsJ2xpbmVMZWZ0JzpfbGluZUxlZnR9OyAgICAgICBcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2ljOyBcbiIsInZhciBjb25maWcgPSB7fTtcbmNvbmZpZy5kb21DYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTsgXG5jb25maWcuY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsgIiwidmFyIGJhc2ljc0NvbXBvbmVudHMgICAgICA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL2Jhc2ljc0NvbXBvbmVudHNcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIG1vZHVsZUV2ZW50Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcbnZhciBiYXNpYyAgICAgICAgICAgICAgICAgPSAgcmVxdWlyZShcIi4uL21vZHVsZXMvYmFzaWNNZXRob2Rlc1wiKTtcblxuLy8gY29tcG9uZW50IG1vdmUgc21vb3RoIGZvciBwbGF5ZXI7XG5QdXBwZXRzLmNvbXBvbmVudChcIm1vdmVcIixmdW5jdGlvbihkYXRhLGVudGl0eSx1bmRlZmluZWQpe1xuICAgIHJldHVybiB7dmFsdWU6ZGF0YS52YWx1ZXx8MCwgZGl2aXNldXIgOiBkYXRhLmRpdmlzZXVyIHx8IDIsZGlyZWN0aW9uIDogZGF0YS5kaXJlY3Rpb24gfHwgMiAsaW52ZXJ0U3dpdGNoIDogZmFsc2V9O1xufSk7XG5cblB1cHBldHMuZW50aXR5KCdwbGF5ZXInLHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ3JlbmRlcicsJ3NpemUnLCdzcGVlZCcsJ21vdmUnLCdjb2xsaWRlcicsXCJwb2x5Z29uZVwiXX0pO1xuXG4vLyBzeXN0ZW0gdXNlIHRvIG1vdmUgcGxheWVyLlxuUHVwcGV0cy5zeXN0ZW0oXCJtb3ZlLWZvcndhcmRcIixmdW5jdGlvbihwb3NpdGlvbixzcGVlZCxtb3ZlKXtcbiAgICAgICAgdmFyIF9zcGVlZCA9IHNwZWVkLnZhbHVlLFxuICAgICAgICBfbW92ZSAgICAgID0gbW92ZS52YWx1ZTtcbiAgICAgICAgX2RpdmlzZXVyICA9IG1vdmUuZGl2aXNldXI7XG4gICAgICAgXG4gICAgICAgIGlmKF9tb3ZlPjApe1xuICAgICAgICAgICAgaWYoX3NwZWVkPDApXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueC09X3NwZWVkKk1hdGguc2luKHBvc2l0aW9uLmFuZ2xlKk1hdGguUEkgLyAxODApKl9kaXZpc2V1cjtcbiAgICAgICAgICAgIGVsc2UgaWYoX3NwZWVkPjApXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueCs9X3NwZWVkKk1hdGguc2luKHBvc2l0aW9uLmFuZ2xlKk1hdGguUEkgLyAxODApKl9kaXZpc2V1cjtcblxuICAgICAgICAgICAgcG9zaXRpb24ueS09MypfZGl2aXNldXI7XG4gICAgICAgICAgICBtb3ZlLnZhbHVlLT0wLjE1L19kaXZpc2V1cjsgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpZihwb3NpdGlvbi5hbmdsZT09OTAgfHwgcG9zaXRpb24uYW5nbGU9PS05MCl7ICAgXG4gICAgICAgICAgICAgICAgc3BlZWQudmFsdWUqPS0xO1xuICAgICAgICAgICAgICAgIG1vdmUuZGlyZWN0aW9uKj0tMTtcbiAgICAgICAgICAgICAgICBtb3ZlLmludmVydFN3aXRjaD1mYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocG9zaXRpb24ueD49NjAwKXtcbiAgICAgICAgICAgICAgICBpZihfc3BlZWQ+MCl7XG4gICAgICAgICAgICAgICAgICAgIHNwZWVkLnZhbHVlKj0tMTtcbiAgICAgICAgICAgICAgICAgICAgbW92ZS5kaXJlY3Rpb24qPS0xXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLngtPTAuMjU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHBvc2l0aW9uLng8PTApe1xuICAgICAgICAgICAgICAgIGlmKF9zcGVlZDwwKXtcbiAgICAgICAgICAgICAgICAgICAgc3BlZWQudmFsdWUqPS0xO1xuICAgICAgICAgICAgICAgICAgICBtb3ZlLmRpcmVjdGlvbio9LTFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueCs9MC4yNTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoTWF0aC5zaW4ocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCk8MSYmTWF0aC5zaW4ocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCk+LTEpXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueSArPSBfc3BlZWQqTWF0aC5zaW4ocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgICAgICBpZigoTWF0aC5jb3MocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCk8MSYmTWF0aC5jb3MocG9zaXRpb24uYW5nbGUqTWF0aC5QSSAvIDE4MCk+LTEpKVxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gX3NwZWVkKk1hdGguY29zKHBvc2l0aW9uLmFuZ2xlKk1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwb3NpdGlvbi5hbmdsZSs9IG1vdmUuZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIFxufSx7Y29tcG9uZW50cyA6IFsncG9zaXRpb24nLCdzcGVlZCcsJ21vdmUnXX0pO1xuXG52YXIgUGxheWVyQ29udHJvbGxlciA9IGZ1bmN0aW9uICgpe1xuXG4gICAgdmFyIHBhcmFtcyA9IHsgeDpjYW52YXNDb25mLmRvbUNhbnZhcy53aWR0aC8yLCB5OjI1NiwgYW5nbGU6MCwgd2lkdGggOiAyNSwgaGVpZ2h0IDogMjUgICwgc2hhcGUgOiBcInNxdWFyZVwiLCBjdHggOiBjYW52YXNDb25mLmN0eCwgc21vb3RoWDowLHNtb290aFk6MCx0eXBlOlwicGxheWVyXCIsbGluZXMgOnt9fTtcblxuICAgIHBhcmFtcy5saW5lcyA9IGJhc2ljLmNvbXB1dGVQb2x5Z29uZShwYXJhbXMuc2hhcGUscGFyYW1zLngscGFyYW1zLnkscGFyYW1zLndpZHRoLHBhcmFtcy5oZWlnaHQscGFyYW1zLmFuZ2xlKTtcblxuICAgIHRoaXMuaW5pdChwYXJhbXMpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHBhcmFtcyl7XG5cbiAgICB0aGlzLmVudGl0eU51bWJlciA9IFB1cHBldHMuY3JlYXRlRW50aXR5KCdwbGF5ZXInLHtwb3NpdGlvbjp7eDpwYXJhbXMueCwgeTpwYXJhbXMueSAsIGFuZ2xlIDogcGFyYW1zLmFuZ2xlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZSAgICAgOnt3OiBwYXJhbXMud2lkdGggLCBoOiBwYXJhbXMuaGVpZ2h0fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyICAgOntjdHg6IHBhcmFtcy5jdHh9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaWRlciA6e3R5cGU6cGFyYW1zLnR5cGUsc2hhcGUgOiBwYXJhbXMuc2hhcGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2x5Z29uZSA6e2xpbmVzOnBhcmFtcy5saW5lc319KTtcbiAgICB2YXIgZW50aXR5cyA9IFB1cHBldHMuZmluZCgnY29sbGlkZXInKTtcbiAgICB2YXIgb3RoZXJzQ29tcG9uZW50cyA9IFtdO1xuICAgIGVudGl0eXMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LGluZGV4LGFycmF5KXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfbXlFbnRpdHkgPSBQdXBwZXRzLmdldENvbXBvbmVudHMoZWxlbWVudClbMF07XG4gICAgICAgIGlmKF9teUVudGl0eS5jb2xsaWRlci50eXBlICE9PSAncGxheWVyJyl7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIF9teUVudGl0eS5wb2x5Z29uZS5saW5lcyl7XG4gICAgICAgICAgICAgICAgb3RoZXJzQ29tcG9uZW50cy5wdXNoKF9teUVudGl0eS5wb2x5Z29uZS5saW5lc1tpXSk7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9XG4gICAgXG4gICAgfSk7XG5cbiAgICBcbiAgICBQdXBwZXRzLmNvbXBvbmVudChcIm90aGVyc1wiLGZ1bmN0aW9uKGRhdGEsZW50aXR5LHVuZGVmaW5lZCl7XG4gICAgICAgIHJldHVybiB7IGxpbmVzIDogZGF0YS5vdGhlcnN9O1xuICAgIH0pO1xuXG4gICAgUHVwcGV0cy5hZGRDb21wb25lbnQodGhpcy5lbnRpdHlOdW1iZXIsJ290aGVycycse290aGVycyA6IG90aGVyc0NvbXBvbmVudHN9KTtcblxuICAgIHRoaXMuc2V0RXZlbnRzKCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5zZXRFdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgbW9kdWxlRXZlbnRDb250cm9sbGVyLmFkZChcImdvLWZvcndhcmRcIixmdW5jdGlvbigpeyAgXG4gICAgICAgIHZhciBfc2VsZiA9IFB1cHBldHMuZ2V0Q29tcG9uZW50cyh0aGlzLmVudGl0eU51bWJlcilbMF07XG4gICAgICAgIF9zZWxmLm1vdmUudmFsdWUgKz0xOyBcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgbW9kdWxlRXZlbnRDb250cm9sbGVyLmFkZChcInJlYm91bmRcIixmdW5jdGlvbigpeyBcblxuICAgICAgICB2YXIgX3NlbGYgPSBQdXBwZXRzLmdldENvbXBvbmVudHModGhpcy5lbnRpdHlOdW1iZXIpWzBdO1xuICAgICAgICBpZighX3NlbGYubW92ZS5pbnZlcnRTd2l0Y2gpe1xuICAgICAgICAgICAgX3NlbGYuc3BlZWQudmFsdWUgKj0tMTsgXG4gICAgICAgICAgICBfc2VsZi5tb3ZlLmRpcmVjdGlvbiAqPS0xOyBcbiAgICAgICAgICAgIF9zZWxmLm1vdmUuaW52ZXJ0U3dpdGNoID0gdHJ1ZTsgICAgIFxuICAgICAgICB9XG5cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuXG4vLyBicm93c2VyaWZ5IGV4cG9ydFxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUGxheWVyQ29udHJvbGxlcigpOyIsInZhciBiYXNpY3NDb21wb25lbnRzICAgICAgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50cy9iYXNpY3NDb21wb25lbnRzXCIpO1xudmFyIGNhbnZhc0NvbmYgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL2NvbmZpZ0NhbnZhc1wiKTtcbnZhciBiYXNpYyAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9iYXNpY01ldGhvZGVzXCIpO1xuXG5QdXBwZXRzLmVudGl0eSgnYmxvYzEnLHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ3JlbmRlcicsJ3NpemUnLCdjb2xsaWRlcicsXCJwb2x5Z29uZVwiXX0pO1xuXG5cbnZhciBibG9jRmFjdG9yeSA9IGZ1bmN0aW9uICh4LHksYW5nbGUsdyxoKXtcblxuICAgIHZhciBwYXJhbXMgPSB7IHg6eCwgeTp5ICwgYW5nbGUgOiAgIGFuZ2xlLCB3aWR0aCA6IHcsIGhlaWdodCA6IGggICwgc2hhcGUgOiBcInNxdWFyZVwiLCBjdHggOiBjYW52YXNDb25mLmN0eCwgdHlwZTpcImJsb2NcIixsaW5lcyA6e30sZmlsbCA6XCIjZmZmZmZmXCIgfTtcblxuICAgIHBhcmFtcy5saW5lcyA9IGJhc2ljLmNvbXB1dGVQb2x5Z29uZShwYXJhbXMuc2hhcGUscGFyYW1zLngscGFyYW1zLnkscGFyYW1zLndpZHRoLHBhcmFtcy5oZWlnaHQscGFyYW1zLmFuZ2xlKTtcbiAgICBcbiAgICB0aGlzLmluaXQocGFyYW1zKTtcbn07XG5cbmJsb2NGYWN0b3J5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ocGFyYW1zKXtcblxuICAgIHRoaXMuZW50aXR5TnVtYmVyID0gUHVwcGV0cy5jcmVhdGVFbnRpdHkoJ2Jsb2MxJyx7cG9zaXRpb246e3g6cGFyYW1zLngsIHk6cGFyYW1zLnkgLCBhbmdsZSA6IHBhcmFtcy5hbmdsZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgICAgIDp7dzogcGFyYW1zLndpZHRoICwgaDogcGFyYW1zLmhlaWdodH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlciAgIDp7Y3R4OiBwYXJhbXMuY3R4LGZpbGw6cGFyYW1zLmZpbGx9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaWRlciA6e3R5cGU6cGFyYW1zLnR5cGUsc2hhcGUgOiBwYXJhbXMuc2hhcGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2x5Z29uZSA6e2xpbmVzOnBhcmFtcy5saW5lc319KTtcbn07XG5cblxubmV3IGJsb2NGYWN0b3J5KDU1MCwzMDAsOTAsNTAsMjAwKTtcbm5ldyBibG9jRmFjdG9yeSg1MDAsMjAwLDkwLDUwLDQwMCk7XG5uZXcgYmxvY0ZhY3RvcnkoMjAwLDEwMCw3MCw1MCw0MDApO1xubW9kdWxlLmV4cG9ydHMgPSBuZXcgYmxvY0ZhY3RvcnkoNjAsMzAwLDkwLDUwLDIwMCk7IiwidmFyIGJhc2ljc0NvbXBvbmVudHMgICAgICA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL2Jhc2ljc0NvbXBvbmVudHNcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIG1vZHVsZUV2ZW50Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcbnZhciBiYXNpYyAgICAgICAgICAgICAgICAgPSAgcmVxdWlyZShcIi4uL21vZHVsZXMvYmFzaWNNZXRob2Rlc1wiKTtcblxuUHVwcGV0cy5lbnRpdHkoJ2NhbWVyYScse2NvbXBvbmVudHMgOiBbJ3Bvc2l0aW9uJ119KTtcblxudmFyIENhbWVyYSA9IGZ1bmN0aW9uICh4LHksdyxoKXtcblxuICAgIHZhciBwYXJhbXMgPSB7IHg6eCwgeTp5fTtcbiAgICBcbiAgICB0aGlzLmluaXQocGFyYW1zKTtcbn07XG5cbkNhbWVyYS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHBhcmFtcyl7XG5cbiAgICB0aGlzLmVudGl0eU51bWJlciA9IFB1cHBldHMuY3JlYXRlRW50aXR5KCdjYW1lcmEnLHtwb3NpdGlvbjp7eDpwYXJhbXMueCwgeTpwYXJhbXMueX19KTtcblxuICAgIHZhciBfcGxheWVyRW50aXR5ID0gUHVwcGV0cy5maW5kKCdtb3ZlJyk7XG4gICAgdmFyIF9wbGF5ZXJSZWYgPSBQdXBwZXRzLmdldENvbXBvbmVudHMoX3BsYXllckVudGl0eSlbMF07XG4gICAgLy8gY29tcG9uZW50IG1vdmUgc21vb3RoIGZvciBwbGF5ZXI7XG4gICAgUHVwcGV0cy5jb21wb25lbnQoXCJ0YXJnZXRDYW1lcmFcIixmdW5jdGlvbihkYXRhLGVudGl0eSx1bmRlZmluZWQpe1xuICAgICAgICByZXR1cm4ge3JlZjpkYXRhLnRhcmdldH07XG4gICAgfSk7XG5cbiAgICBQdXBwZXRzLmFkZENvbXBvbmVudCh0aGlzLmVudGl0eU51bWJlcixcInRhcmdldENhbWVyYVwiLHt0YXJnZXQgOiBfcGxheWVyUmVmfSk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FtZXJhKDMwMCwyNTApO1xuIiwidmFyIGJhc2ljc0NvbXBvbmVudHMgICAgICA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL2Jhc2ljc0NvbXBvbmVudHNcIik7XG52YXIgY2FudmFzQ29uZiAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL21vZHVsZXMvY29uZmlnQ2FudmFzXCIpO1xudmFyIG1vZHVsZUV2ZW50Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL0V2ZW50Q29udHJvbGxlclwiKTtcbnZhciBiYXNpYyAgICAgICAgICAgICAgICAgPSAgcmVxdWlyZShcIi4uL21vZHVsZXMvYmFzaWNNZXRob2Rlc1wiKTtcblxuUHVwcGV0cy5lbnRpdHkoJ3dhbGwnLHtjb21wb25lbnRzIDogWydwb3NpdGlvbicsJ3NpemUnLCdjb2xsaWRlcicsXCJwb2x5Z29uZVwiXX0pO1xuXG52YXIgd2FsbEZhY3RvcnkgPSBmdW5jdGlvbiAoeCx5LHcsaCl7XG5cbiAgICB2YXIgcGFyYW1zID0geyB4OngsIHk6eSAsIGFuZ2xlIDogICAwLCB3aWR0aCA6IHcsIGhlaWdodCA6IGggICwgc2hhcGUgOiBcIlZlcnRpY2FsTGluZVwiLCBjdHggOiBjYW52YXNDb25mLmN0eCwgdHlwZTpcImJvcmRlclwiLGxpbmVzIDp7fSxmaWxsIDpcIiM5NWZmZmZcIiB9O1xuXG4gICAgcGFyYW1zLmxpbmVzID0gYmFzaWMuY29tcHV0ZVBvbHlnb25lKHBhcmFtcy5zaGFwZSxwYXJhbXMueCxwYXJhbXMueSxwYXJhbXMud2lkdGgscGFyYW1zLmhlaWdodCxwYXJhbXMuYW5nbGUpO1xuICAgIFxuICAgIHRoaXMuaW5pdChwYXJhbXMpO1xufTtcblxud2FsbEZhY3RvcnkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihwYXJhbXMpe1xuXG4gICAgdGhpcy5lbnRpdHlOdW1iZXIgPSBQdXBwZXRzLmNyZWF0ZUVudGl0eSgnd2FsbCcse3Bvc2l0aW9uOnt4OnBhcmFtcy54LCB5OnBhcmFtcy55ICwgYW5nbGUgOiBwYXJhbXMuYW5nbGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplICAgICA6e3c6IHBhcmFtcy53aWR0aCAsIGg6IHBhcmFtcy5oZWlnaHR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW5kZXIgICA6e2N0eDogcGFyYW1zLmN0eCxmaWxsOnBhcmFtcy5maWxsfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlkZXIgOnt0eXBlOnBhcmFtcy50eXBlLHNoYXBlIDogcGFyYW1zLnNoYXBlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWdvbmUgOntsaW5lczpwYXJhbXMubGluZXN9fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyB3YWxsRmFjdG9yeSgzMDAsNDAwLDYwMCwtMTAwMCk7IFxuIl19
