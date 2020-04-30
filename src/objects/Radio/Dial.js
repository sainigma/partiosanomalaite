import * as THREE from 'three'
export class Dial{
  constructor(object3d, incrementSteps, decrementSteps, stepAngle, offsetAngle){
    this.object = object3d
    this.offsetAngle = offsetAngle
    this.totalRotation = (incrementSteps + decrementSteps) * Math.abs(stepAngle)
    this.incrementSteps = incrementSteps
    this.decrementSteps = decrementSteps
    this.stepAngleRads = 2*3.14159*(stepAngle/360)
    this.state = 0
    if( object3d.children.length > 0 ){
      this.dialTarget = object3d.children[0]
      this.dialTarget.visible = false
      this.targetOriginalPosition = this.dialTarget.position.clone()
    }
  }
  moveTarget(ogOffset){
    const originalPosition = this.targetOriginalPosition
    let offset = ogOffset
    const currentAngle = this.stepAngleRads*this.state - this.offsetAngle
    offset.y = ogOffset.y * Math.cos(currentAngle) - ogOffset.x * Math.sin(currentAngle)
    offset.x = 0

    this.dialTarget.position.set(originalPosition.x+offset.x, originalPosition.y+offset.y, originalPosition.z)
    let angle = Math.atan( this.dialTarget.position.y / this.dialTarget.position.x  )
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