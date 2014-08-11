// Basic components for entities !
console.log(Game.Puppets)

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