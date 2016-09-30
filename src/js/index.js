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
    h.moveLerp(h.target);
    for (var i = es.length - 1; i >= 0 ; i--) {
      var e = es[i];
      if (e.getDistance(h) < Globals.chaseDistance) {
        e.target = h;
        e.chasing = true;
        e.color = '#ff0000';
        if(e.getDistance(h) < Globals.killDist){
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

