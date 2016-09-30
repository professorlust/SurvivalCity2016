
var Globals = require('./Globals.js');
function Util(){var a = 'test';return a;}
Util.randSpawn = function() {
  var x = this.getRandomFloat(0, Globals.canvas.width);
  var y = this.getRandomFloat(0, Globals.canvas.height);
  return {
    x: x,
    y: y
  };

}
Util.getRandomFloat = function(min, max) {
  return Math.random() * (max - min) + min;
}

Util.findTangentSlope = function(x,y,clockwise){
  if(clockwise){
    return {x:-y,y:x};
  }else{
    return {x:y,y:-x};
  }
}
Util.distance = function(p1,p2){
  return Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) );
};
Util.drawCirc = function(x,y,color) {
  var centerX = x;
  var centerY = y;
  var radius = 4;

  Globals.context.beginPath();
  Globals.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  Globals.context.fillStyle = color;
  Globals.context.fill();
  Globals.context.lineWidth = 2;
  Globals.context.strokeStyle = '#003300';
  Globals.context.stroke();

}
module.exports = Util;