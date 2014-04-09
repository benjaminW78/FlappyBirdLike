
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
