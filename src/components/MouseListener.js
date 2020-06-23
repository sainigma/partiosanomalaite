export class MouseListener {
  constructor(intersecter){
    const mouseMove = (event) => {
      const clientX = event.clientX
      const clientY = event.clientY
      this.x = event.clientX
      this.y = event.clientY
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
      this.mouse = event.buttons
      if( this.mouse === 0 ){
        document.getElementById('root').style.cursor = 'auto'
        this.initialMouseX = event.clientX
        this.initialMouseY = event.clientY
      }else if( this.mouse === 1 ){
        this.intersecter.intersect( event.clientX, event.clientY, true )
      }else if( this.mouse > 1 ){
        document.getElementById('root').style.cursor = 'grabbing'
      }
    }

    this.initialMouseX = 1920/2
    this.initialMouseY = 1080/2
    this.x = 0
    this.y = 0
    this.deltaX = 0
    this.deltaY = 0
    this.mouse = 0
    this.intersecter = intersecter
    document.addEventListener('mousemove', mouseMove, false)
    document.addEventListener('pointerdown', mouseButtonToggle, false)
    document.addEventListener('pointerup', mouseButtonToggle, false)
  }
  getButtons(){
    return this.mouse
  }
  getDeltas(){
    return {x:this.deltaX, y:this.deltaY}
  }
  getAbsolute(){
    return {x:this.x, y:this.y}
  }
}