(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  numberOfEs : 50,
  chaseDistance : 200,
  moveLerpSensitivity : 300,
  heroSpeed : 5,
  enemySpeed : 1,
  killDist : 25,
  canvas : document.getElementById('canvas'),
  context : document.getElementById('canvas').getContext('2d'),
  mouse : {
    x: 0,
    y: 0
  },
  lastClick : null
};
},{}],2:[function(require,module,exports){
var Util = require('./Util.js');
function Gun() {
  this.reloadTime = 2000;
  this.fireSpeed = 300;
  this.shotsPerClip = 6;
  this.shotsRemaining = this.shotsPerClip;
  this.reloading = false;
  this.readyForNextShot = true;
  this.waitingForNextShot = false;
  this.accuracy = 0.5;
}
Gun.prototype.shoot = function(killable){
  if(this.shotsRemaining > 0){
    this.shotsRemaining--;
    var chance = Util.getRandomFloat(0,1);
    //console.log('shots fired: ' + chance + '/1');
    if(chance <= this.accuracy){
      console.log('shot hit!');
      killable.die();
    }else{
      console.log('shot miss!');
    }
  }else{
    this.reload();
  }
}
Gun.prototype.tryShoot = function(killable){
  if(!this.waitingForNextShot){
    //actually take a shot:
    this.shoot(killable);
    //start waiting for next shot:
    this.waitingForNextShot = true;
    this.timeWhenReadyForNextShot = (new Date()).getTime() + this.fireSpeed;
  }else{
    //is it ready for next shot:
    if((new Date()).getTime() >= this.timeWhenReadyForNextShot){
      this.waitingForNextShot = false;
    }
  }
  
}
Gun.prototype.reload = function(){
  if(!this.reloading){
    console.log('reloading');
    this.reloading = true;
    this.timeWhenDoneReloading = (new Date()).getTime() + this.reloadTime;
  }else{
    if((new Date()).getTime() >= this.timeWhenDoneReloading){
      console.log('doneReloading');
      this.reloading = false;
      this.shotsRemaining = this.shotsPerClip;
    }
  }
  
}
module.exports = Gun;
},{"./Util.js":4}],3:[function(require,module,exports){
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
  this.moveState = 1;
  this.moveStates = {
    away:0,
    to:1,
    orbit:2
  }
  this.behavior = 0;
  this.behaviorStates = {
    wander:0,
    chase:1
  };
  this.lungeTarget = null;
  this.alive = true;
  this.distanceToClosestEnemy = null;
  this.closestEnemy = null;
  this.weapon = null;
  // initialize with new target:
  this.reachedTarget();
}
Unit.prototype.die = function(){
  this.color = '#000';
  this.alive = false;
}
//
// Movement
//
Unit.prototype.reachedTarget = function(){
  switch(this.behavior){
    case this.behaviorStates.wander:
    // find new wander point
      this.findWanderPoint(200);
      this.moveState = this.moveStates.to;
    break;
    case this.behaviorStates.chase:
    break;
  }
  
}
Unit.prototype.moveAway = function(){
  if (!this.target) {
    return;
  }
  var dX = this.target.x - this.x;
  var dY = this.target.y - this.y;
  if (Math.abs(dX) < this.speed && Math.abs(dY) < this.speed) {
    this.target = null;
    this.reachedTarget();
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
    this.reachedTarget();
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
    this.reachedTarget();
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
Unit.prototype.moveLerp = function(extraTarget) {
  var specialSpeed = 20;
  if (!extraTarget) {
    return;
  }
  var dX = extraTarget.x - this.x;
  var dY = extraTarget.y - this.y;
  //console.log(dX + ',' + dY);
  if (Math.abs(dX) < specialSpeed*2 && Math.abs(dY) < specialSpeed*2) {
    // Do NOT call reached target or null target for moveLerp as it is intended for mouse movement
    //this.reachedTarget();
    Globals.lastClick = null;
    return;
  }
  var dH = Math.sqrt(dX * dX + dY * dY);
  var speedMod = dH / Globals.moveLerpSensitivity;
  speedMod = speedMod > 1 ? 1 : speedMod;
  this.x += dX / dH * specialSpeed * speedMod;
  this.y += dY / dH * specialSpeed * speedMod;
}

//
// Combat
//
Unit.prototype.shoot = function(killable) {
  if(this.weapon && killable){
    this.weapon.tryShoot(killable);
  }
}
//
// Util
//
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
},{"./Globals.js":1,"./Util.js":4}],4:[function(require,module,exports){

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
},{"./Globals.js":1}],5:[function(require,module,exports){
var Unit = require('./Unit.js');
var Util = require('./Util.js');
var Globals = require('./Globals.js');
var Gun = require('./Gun.js');
(function() {

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
  Globals.canvas.addEventListener('mousemove', function(evt) {
    var rect = Globals.canvas.getBoundingClientRect();
    Globals.mouse.x = evt.clientX - rect.left;
    Globals.mouse.y = evt.clientY - rect.top;
  }, false);
  Globals.canvas.addEventListener('click', function(evt) {
    var rect = Globals.canvas.getBoundingClientRect();
    Globals.lastClick = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
    console.log(lastClick);
  }, false);

  function resizeCanvas() {
    Globals.canvas.width = window.innerWidth;
    Globals.canvas.height = window.innerHeight;
  }
  resizeCanvas();

  


  var h = new Unit('#00ff00', Globals.heroSpeed);
  // follow mouse:
  //h.target = Globals.mouse;
  h.behavior = h .behaviorStates.chase;
  h.moveState = h.moveStates.away;
  h.weapon = new Gun();
  var es = [];
  for (var i = 0; i < Globals.numberOfEs; i++) {
    var unit = new Unit('#ff0000', Globals.enemySpeed);
    es.push(unit);
  }
  
  function shittyFindNearEnemy(unit){
    unit.closestEnemy = null;
    for (var i = es.length - 1; i >= 0 ; i--) {
      var e = es[i];
      if(e.alive){
        var dist = Util.distance(unit,e);
        if(!unit.closestEnemy){
          unit.closestEnemy = e;
          unit.distanceToClosestEnemy = dist;
        }else{
          if(dist < unit.distanceToClosestEnemy){
            unit.closestEnemy = e;
            unit.distanceToClosestEnemy = dist;
          }
        }
      }
    }
  }

  function drawLoop() {
    stats.begin();
    Globals.context.clearRect(0, 0, Globals.canvas.width, Globals.canvas.height);
    h.moveLerp(Globals.lastClick);
    shittyFindNearEnemy(h);
    h.target = h.closestEnemy;
    h.move();
    h.shoot(h.closestEnemy);
    for (var i = es.length - 1; i >= 0 ; i--) {
      var e = es[i];
      if(e.alive){
        if (e.getDistance(h) < Globals.chaseDistance) {
          // in chase range of hero (agro distance)
          e.target = h;
          e.behavior = e.behaviorStates.chase;
          //e.chasing = true;
          e.color = '#ff0000';
          if(e.getDistance(h) < Globals.killDist){
            // enemy is touching hero:
            //e.die();
            //remove:
            //es.splice(i, 1);
          }
        } else {
          // out of chase range of hero:
          e.color = '#ffa500';
          if (e.behavior == e.behaviorStates.chase) {
            e.target = null;
            e.behavior = e.behaviorStates.wander;
          }
          //e.findWanderPoint(200);
          //e.moveState = e.moveStates.to;
        }
        e.move();
      }
      e.draw();
    }
    h.draw();
    if(h.target){
      Util.drawCirc(h.target.x,h.target.y,'#0000ff');
    }
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


},{"./Globals.js":1,"./Gun.js":2,"./Unit.js":3,"./Util.js":4}]},{},[5]);
