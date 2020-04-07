export class MouseListener {
  constructor(intersecter){
    const mouseMove = (event) => {
      const clientX = event.clientX
      const clientY = event.clientY
      this.intersecter.intersect( event.clientX, event.clientY, false )
      if( this.initialMouseX === -1 ){
        this.initialMouseX = clientX
        this.initialMouseY = clientY
      }else{
        this.deltaX = (this.initialMouseX - clientX)
        this.deltaY = (this.initialMouseY - clientY)
      }
    }
    const mouseButtonToggle = (event) => {
      if( this.mouse === 0 ){
        this.initialMouseX = event.clientX
        this.initialMouseY = event.clientY
      }else if( this.mouse === 1 ){
        this.intersecter.intersect( event.clientX, event.clientY, true )
      }
      this.mouse = event.buttons
    }

    this.initialMouseX = 1920/2
    this.initialMouseY = 1080/2
    this.deltaX = 0
    this.deltaY = 0
    this.mouse = 0
    this.intersecter = intersecter
    document.addEventListener('mousemove', mouseMove, false)
    document.addEventListener('pointerdown', mouseButtonToggle, false)
    document.addEventListener('pointerup', mouseButtonToggle, false)
  }
  getDeltas(){
    return {x:this.deltaX, y:this.deltaY}
  }
}