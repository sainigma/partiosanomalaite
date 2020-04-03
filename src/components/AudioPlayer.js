export class AudioPlayer{
  constructor(){
    this.sounds = {
      'key':new Audio('sounds/key.wav'),
      'burst':new Audio('sounds/burst.mp3'),
      'yk':new Audio('sounds/yk.mp3')
    }
    this.active = false
  }
  activate(){
    if( !this.active ){
      this.play('key')
      this.active = true
    }
  }
  play(handle){
    this.sounds[handle].play()
  }
  paused(handle){
    return this.sounds[handle].paused
  }
}