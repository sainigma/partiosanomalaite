export class Dial{
  constructor(object3d, incrementSteps, decrementSteps, stepAngle){
    this.object = object3d
    this.incrementSteps = incrementSteps
    this.decrementSteps = decrementSteps
    this.stepAngleRads = 2*3.14159*(stepAngle/360)
    this.state = 0
    if( object3d.children.length > 0 ){
      object3d.children[0].visible = false
      this.targetOriginalPosition = object3d.children[0].position.clone()
    }
  }
  moveTarget(ogOffset){
    const originalPosition = this.targetOriginalPosition
    let offset = ogOffset
    if( offset.y > 0.01 ){
      offset.y = 0.01
    }else if( offset.y < -0.01 ){
      offset.y = -0.01
    }
    this.object.children[0].position.set(originalPosition.x+offset.x, originalPosition.y+offset.y, originalPosition.z)
    let angle = Math.atan( this.object.children[0].position.y / this.object.children[0].position.x  )
    if( this.stepAngleRads < 0 ){
      if( angle < this.stepAngleRads*0.6 ){
        this.increment()
      }else if( angle > -this.stepAngleRads*0.6 ){
        this.decrement()
      }
    }else{
      if( angle > this.stepAngleRads*0.6 ){
        this.increment()
      }else if( angle < -this.stepAngleRads*0.6 ){
        this.decrement()
      }
    }
  }
  resetTarget(){
    this.moveTarget({x:0,y:0})
  }
  increment(){
    if( this.state + 1 <= this.incrementSteps ){
      this.state++
      this.object.rotateZ(this.stepAngleRads)
    }
  }
  decrement(){
    if( this.state - 1 >= -this.decrementSteps ){
      this.state--
      this.object.rotateZ(-this.stepAngleRads)
    }
  }
  set(value){
    if( value !== this.state ){
      this.reset()
      this.object.rotateZ(this.stepAngleRads*value)
      this.state = value
    }
  }
  reset(){
    this.object.rotateZ(-this.stepAngleRads*this.state)
    this.state = 0
  }
  get(){
    return this.state
  }
}