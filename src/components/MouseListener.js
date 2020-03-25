export class MouseListener {
  constructor(){
    const mouseMove = (event) => {
      const clientX = event.clientX
      const clientY = event.clientY
      if( this.initialMouseX === -1 ){
        this.initialMouseX = clientX
        this.initialMouseY = clientY
      }else{
        this.deltaX = (this.initialMouseX - clientX)
        this.deltaY = (this.initialMouseY - clientY)
      }
    }
    this.initialMouseX = 1920/2
    this.initialMouseY = 1080/2
    this.deltaX = 0
    this.deltaY = 0
    document.addEventListener('mousemove', mouseMove, false)
  }
  getDeltas(){
    return {x:this.deltaX, y:this.deltaY}
  }
}