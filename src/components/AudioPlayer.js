export class AudioPlayer{
  constructor(){
    this.sounds = {
      'key':new Audio('sounds/key.wav'),
      'burst':new Audio('sounds/burst.mp3'),
      'yk':new Audio('sounds/noise.mp3'),
      'keyDown':new Audio('sounds/keyDown.wav'),
      'keyUp':new Audio('sounds/keyUp.wav')
    }
  }
  play(handle){
    this.sounds[handle].play()
  }
  paused(handle){
    return this.sounds[handle].paused
  }
}