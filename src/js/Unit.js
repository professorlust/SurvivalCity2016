var Util = require('./Util.js');
var Globals = require('./Globals.js');
function Unit(color, speed) {
  var spawn = Util.randSpawn();
  this.x = spawn.x;
  this.y = spawn.y;
  this.color = color || '#ff0000';
  this.radius = 10;
  this.speed = speed || 2;
  this.target = null;
  this.chasing = false;

}
Unit.prototype.move = function(target) {
  if (!target) {
    return;
  }
  var dX = target.x - this.x;
  var dY = target.y - this.y;
  //console.log(dX + ',' + dY);
  if (Math.abs(dX) < this.speed && Math.abs(dY) < this.speed) {
    this.target = null;
    return;
  }
  var dH = Math.sqrt(dX * dX + dY * dY);
  this.x += dX / dH * this.speed;
  this.y += dY / dH * this.speed;
}
Unit.prototype.moveLerp = function(target) {
  if (!target) {
    return;
  }
  var dX = target.x - this.x;
  var dY = target.y - this.y;
  //console.log(dX + ',' + dY);
  if (Math.abs(dX) < this.speed && Math.abs(dY) < this.speed) {
    return;
  }
  var dH = Math.sqrt(dX * dX + dY * dY);
  var speedMod = dH / Globals.moveLerpSensitivity;
  speedMod = speedMod > 1 ? 1 : speedMod;
  this.x += dX / dH * this.speed * speedMod;
  this.y += dY / dH * this.speed * speedMod;
}
Unit.prototype.draw = function() {
  var centerX = this.x;
  var centerY = this.y;
  var radius = this.radius;

  Globals.context.beginPath();
  Globals.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  Globals.context.fillStyle = this.color;
  Globals.context.fill();
  Globals.context.lineWidth = 2;
  Globals.context.strokeStyle = '#003300';
  Globals.context.stroke();

}
Unit.prototype.findWanderPoint = function(halfDist) {
  if (!this.target) {
    this.target = {
      x: Util.getRandomFloat(this.x - halfDist, this.x + halfDist),
      y: Util.getRandomFloat(this.y - halfDist, this.y + halfDist)
    };

  }

};
Unit.prototype.getDistance = function(unit) {
  return Math.sqrt((this.x - unit.x) * (this.x - unit.x) + (this.y - unit.y) * (this.y - unit.y));
}
 
// export (expose) foo to other modules
module.exports = Unit;