export class KeyListener {
  constructor(){
    const keyDown = (event) => {
      event.preventDefault()
      const keyCode = event.which
      if( this.keysDown.indexOf( keyCode ) === -1 && this.keysDown.length < 6){
        this.keysDown.push(keyCode)
      }
    }
    const keyUp = (event) => {
      event.preventDefault()
      const keyCode = event.which
      this.keysDown = this.keysDown.filter( key => key !== keyCode )
    }


    this.keysDown = []
    document.addEventListener('keydown', keyDown, false)
    document.addEventListener('keyup', keyUp, false)
  }
  getKeysDown(){
    return this.keysDown
  }
}