require('./test.js');
(function() {
  var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');
  var mouse = {
    x: 0,
    y: 0
  };
  var numberOfEs = 100;
  var chaseDistance = 200;
  var moveLerpSensitivity = 300;
  var heroSpeed = 25;
  var enemySpeed = 1;
  var killDist = 25;

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
  canvas.addEventListener('mousemove', function(evt) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = evt.clientX - rect.left;
    mouse.y = evt.clientY - rect.top;
  }, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  function Unit(color, speed) {
    var spawn = randSpawn();
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
    var speedMod = dH / moveLerpSensitivity;
    speedMod = speedMod > 1 ? 1 : speedMod;
    this.x += dX / dH * this.speed * speedMod;
    this.y += dY / dH * this.speed * speedMod;
  }
  Unit.prototype.draw = function() {
    var centerX = this.x;
    var centerY = this.y;
    var radius = this.radius;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#003300';
    context.stroke();

  }
  Unit.prototype.findWanderPoint = function(halfDist) {
    if (!this.target) {
      this.target = {
        x: getRandomFloat(this.x - halfDist, this.x + halfDist),
        y: getRandomFloat(this.y - halfDist, this.y + halfDist)
      };

    }

  };
  Unit.prototype.getDistance = function(unit) {
    return Math.sqrt((this.x - unit.x) * (this.x - unit.x) + (this.y - unit.y) * (this.y - unit.y));
  }

  function randSpawn() {
    var x = getRandomFloat(0, canvas.width);
    var y = getRandomFloat(0, canvas.height);
    return {
      x: x,
      y: y
    };

  }

  var h = new Unit('#00ff00', heroSpeed);
  h.target = mouse;
  var es = [];
  for (var i = 0; i < numberOfEs; i++) {
    var unit = new Unit('#ff0000', enemySpeed);
    es.push(unit);
  }

  function drawLoop() {
    stats.begin();
    context.clearRect(0, 0, canvas.width, canvas.height);
    h.moveLerp(h.target);
    for (var i = es.length - 1; i >= 0 ; i--) {
      var e = es[i];
      if (e.getDistance(h) < chaseDistance) {
        e.target = h;
        e.chasing = true;
        e.color = '#ff0000';
        if(e.getDistance(h) < killDist){
          e.color = '#000';
          es.splice(i, 1);
        }
      } else {
        e.color = '#ffa500';
        if (e.chasing) {
          e.target = null;
          e.chasing = false;
        }
        e.findWanderPoint(200);
      }
      e.move(e.target);
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

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}