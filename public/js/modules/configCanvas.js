var config = {};
isTouch=true;
config.domCanvas = document.createElement("canvas");


// var width=document.createAttribute("width");
    config.domCanvas.width=window.innerWidth;

// config.domCanvas.setAttributeNode(width);

// var height =document.createAttribute("height");
    config.domCanvas.height=window.innerHeight;

// config.domCanvas.setAttributeNode(height);
config.ctx = config.domCanvas.getContext("2d");
document.body.appendChild(config.domCanvas);
    // console.log(config.domCanvas);

module.exports = config; 