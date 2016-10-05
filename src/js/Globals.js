module.exports = {
  numberOfEs : 50,
  chaseDistance : 100,
  moveLerpSensitivity : 300,
  heroSpeed : 1,
  enemySpeed : 0.5,
  killDist : 5,
  canvas : document.getElementById('canvas'),
  context : document.getElementById('canvas').getContext('2d'),
  mouse : {
    x: 0,
    y: 0
  },
  lastClick : null,
  loopCount : 0, // how many times the loop has run.
  margin: 20 // margin for turning off something that has become active due to chase distance for example.
};