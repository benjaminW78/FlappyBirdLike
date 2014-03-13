// Basic components for entities !

Puppets.component("position",function(data,entity,undefined){
    return { angle : data.angle || 0 , x : data.x || 0  , y : data.y || 0 };
});

Puppets.component("render",function(data,entity,undefined){
    return { ctx : data.ctx ,Fillcolor : data.fill || "#22ff33" , Strokecolor : data.stroke || "" , 
             shape : data.shape || ''};
});

Puppets.component("size",function(data,entity,undefined){
    return { width : data.w || 50  , height : data.h || 50 };
});

Puppets.component("speed",function(data,entity,undefined){
    return { value : data.value || 2 };
});


module.exports = this; 