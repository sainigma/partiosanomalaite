export class AudioPlayer{
  constructor(){
    this.volume = 1
    this.sounds = {
      'key':new Audio('sounds/key.wav'),
      'burst':new Audio('sounds/burst.mp3'),
      'keyDown':new Audio('sounds/keyDown.wav'),
      'keyUp':new Audio('sounds/keyUp.wav'),
      'static':new Audio('sounds/static.mp3')
    }
  }
  play(handle){
    this.sounds[handle].play()
    if( !this.paused('static') && (handle === 'burst' || handle === 'yk') ){
      this.stop('static')
      this.sounds[handle].addEventListener('ended',(e)=>{
        this.playLooped('static')
      },{once:true})
    }
    this.sounds[handle]
  }
  playLooped(handle){
    this.sounds[handle].loop = true
    this.sounds[handle].play()
  }
  stop(handle){
    this.sounds[handle].pause()
  }
  paused(handle){
    return this.sounds[handle].paused
  }
  setVolume(value){
    this.sounds['burst'].volume = value
    this.sounds['yk'].volume = value
    this.sounds['static'].volume = value
  }
}