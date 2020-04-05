export class KeyListener {
  constructor(audioPlayer){
    const keyDown = (event) => {
      event.preventDefault()
      const keyCode = event.which
      if( this.keysDown.indexOf( keyCode ) === -1 && this.keysDown.length < 6){
        this.keysDown.push(keyCode)
        this.audioPlayer.play('keyDown')
      }
    }
    const keyUp = (event) => {
      event.preventDefault()
      const keyCode = event.which
      this.keysDown = this.keysDown.filter( key => key !== keyCode )
      this.audioPlayer.play('keyUp')
    }

    this.audioPlayer = audioPlayer
    this.keysDown = []
    document.addEventListener('keydown', keyDown, false)
    document.addEventListener('keyup', keyUp, false)
  }
  getKeysDown(){
    return this.keysDown
  }
}