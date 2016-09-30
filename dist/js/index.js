(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  numberOfEs : 100,
  chaseDistance : 200,
  moveLerpSensitivity : 300,
  heroSpeed : 25,
  enemySpeed : 1,
  killDist : 25,
  canvas : document.getElementById('canvas'),
  context : document.getElementById('canvas').getContext('2d'),
  mouse : {
    x: 0,
    y: 0
  }
};
},{}],2:[function(require,module,exports){
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
},{"./Globals.js":1,"./Util.js":3}],3:[function(require,module,exports){

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
module.exports = Util;
},{"./Globals.js":1}],4:[function(require,module,exports){
var Unit = require('./Unit.js');
var Globals = require('./Globals.js');
(function() {

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
  Globals.canvas.addEventListener('mousemove', function(evt) {
    var rect = Globals.canvas.getBoundingClientRect();
    Globals.mouse.x = evt.clientX - rect.left;
    Globals.mouse.y = evt.clientY - rect.top;
  }, false);

  function resizeCanvas() {
    Globals.canvas.width = window.innerWidth;
    Globals.canvas.height = window.innerHeight;
  }
  resizeCanvas();

  


  var h = new Unit('#00ff00', Globals.heroSpeed);
  h.target = Globals.mouse;
  var es = [];
  for (var i = 0; i < Globals.numberOfEs; i++) {
    var unit = new Unit('#ff0000', Globals.enemySpeed);
    es.push(unit);
  }

  function drawLoop() {
    stats.begin();
    Globals.context.clearRect(0, 0, Globals.canvas.width, Globals.canvas.height);
    h.moveLerp();
    for (var i = es.length - 1; i >= 0 ; i--) {
      var e = es[i];
      if (e.getDistance(h) < Globals.chaseDistance) {
        e.target = h;
        e.chasing = true;
        e.color = '#ff0000';
        if(e.getDistance(h) < Globals.killDist){
          e.color = '#000';
          e.lungeTarget = {x:0,y:0};
          //es.splice(i, 1);
        }
      } else {
        e.color = '#ffa500';
        if (e.chasing) {
          e.target = null;
          e.chasing = false;
        }
        e.findWanderPoint(200);
        e.moveState = e.moveStates.to;
      }
      e.move();
      e.draw();
    }
    h.draw();
    stats.end();
    requestAnimationFrame(drawLoop);
  }
  requestAnimationFrame(drawLoop);
  var stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  $("#Stats-output").append(stats.domElement);
})();


},{"./Globals.js":1,"./Unit.js":2}]},{},[4]);
