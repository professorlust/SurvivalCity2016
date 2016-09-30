
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
module.exports = Util;