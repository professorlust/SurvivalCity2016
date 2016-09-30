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