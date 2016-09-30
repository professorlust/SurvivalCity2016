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

  function resizeCanvas() {
    Globals.canvas.width = window.innerWidth;
    Globals.canvas.height = window.innerHeight;
  }
  resizeCanvas();

  


  var h = new Unit('#00ff00', Globals.heroSpeed);
  h.target = Globals.mouse;
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
    h.moveLerp();
    shittyFindNearEnemy(h);
    h.shoot(h.closestEnemy);
    for (var i = es.length - 1; i >= 0 ; i--) {
      var e = es[i];
      if(e.alive){
        if (e.getDistance(h) < Globals.chaseDistance) {
          e.target = h;
          e.chasing = true;
          e.color = '#ff0000';
          // enemy is touching hero:
          if(e.getDistance(h) < Globals.killDist){
            //e.die();
            //remove:
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
      }
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

