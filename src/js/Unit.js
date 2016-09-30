var Util = require('./Util.js');
var Globals = require('./Globals.js');
function Unit(color, speed) {
  var spawn = Util.randSpawn();
  this.x = spawn.x;
  this.y = spawn.y;
  this.color = color || '#ff0000';
  this.radius = 10;
  this.speed = speed || 2;
  this.lungeSpeed = this.speed * 10;
  this.target = null;
  this.chasing = false;
  this.moveState = 0;
  this.moveStates = {
    away:0,
    to:1,
    orbit:2
  }
  this.lungeTarget = null;

}
Unit.prototype.moveAway = function(){
  if (!this.target) {
    return;
  }
  var dX = this.target.x - this.x;
  var dY = this.target.y - this.y;
  if (Math.abs(dX) < this.speed && Math.abs(dY) < this.speed) {
    this.target = null;
    return;
  }
  var dH = Math.sqrt(dX * dX + dY * dY);
  this.x -= dX / dH * this.speed;
  this.y -= dY / dH * this.speed;
}
Unit.prototype.moveOrbit = function(clockwise){
  if (!this.target) {
    return;
  }
  var dX = this.target.x - this.x;
  var dY = this.target.y - this.y;
  var tangent = Util.findTangentSlope(dX,dY,clockwise);
  dX = tangent.x;
  dY = tangent.y;
  if (Math.abs(dX) < this.speed && Math.abs(dY) < this.speed) {
    this.target = null;
    return;
  }
  var dH = Math.sqrt(dX * dX + dY * dY);
  this.x += dX / dH * this.speed;
  this.y += dY / dH * this.speed;
}
Unit.prototype.moveTo = function(){
  if (!this.target) {
    return;
  }
  var dX = this.target.x - this.x;
  var dY = this.target.y - this.y;
  if (Math.abs(dX) < this.speed && Math.abs(dY) < this.speed) {
    this.target = null;
    return;
  }
  var dH = Math.sqrt(dX * dX + dY * dY);
  this.x += dX / dH * this.speed;
  this.y += dY / dH * this.speed;
  
}
// Copy of moveLerp:
Unit.prototype.lunge = function() {
  if (!this.lungeTarget) {
    return;
  }
  var dX = this.lungeTarget.x - this.x;
  var dY = this.lungeTarget.y - this.y;
  //Reached target
  if (Math.abs(dX) < this.lungeSpeed && Math.abs(dY) < this.lungeSpeed) {
    this.lungeTarget = null;
    return;
  }
  var dH = Math.sqrt(dX * dX + dY * dY);
  var speedMod = dH / Globals.moveLerpSensitivity;
  speedMod = speedMod > 1 ? 1 : speedMod;
  this.x += dX / dH * this.lungeSpeed * speedMod;
  this.y += dY / dH * this.lungeSpeed * speedMod;
}
Unit.prototype.move = function() {
  switch(this.moveState){
    case this.moveStates.away:
      this.moveAway();
    break;
    case this.moveStates.to:
      this.moveTo();
    break;
    case this.moveStates.orbit:
      this.moveOrbit();
    break;
  }
  this.lunge();
}
Unit.prototype.moveLerp = function() {
  if (!this.target) {
    return;
  }
  var dX = this.target.x - this.x;
  var dY = this.target.y - this.y;
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