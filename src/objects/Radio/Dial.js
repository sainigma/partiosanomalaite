export class Dial{
  constructor(object3d, incrementSteps, decrementSteps, stepAngle){
    this.object = object3d
    this.incrementSteps = incrementSteps
    this.decrementSteps = decrementSteps
    this.stepAngleRads = 2*3.14159*(stepAngle/360)
    this.state = 0
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