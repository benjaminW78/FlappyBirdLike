window.onload = function(){
    
var Game = require('./loader/game');
console.log(Game);
}
        // Puppets.component("position2d", function(data, entity){
        //       return {x : data.x || 0, y : data.y || 0 };
        // });//add component position2d;

        // Puppets.system("moveRight", function(position2d){
        //       position2d.x += 10;
        // }, {components : ["position2d"]});//add system moveRight to Puppets systemList

        // Puppets.entity("moverEntity", {components : ["position2d"]});
        // /*add moverEntity model to entities models list of Puppets*/

        // Puppets.createEntity("moverEntity", {position2d : { x : 10}});
        // /* create an entity with moverEntity model. So the entity has a position2d component like :
        //    { x : 10, y : 0 }
        // */

        // setInterval(function(){
  
             // PuppetsInstance.run();
        // }, 1000);
        /* each second, Puppets plays its system list. So each second, the position2d of our entity will       
           change. */
