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