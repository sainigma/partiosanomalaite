import * as THREE from 'three'

export class DollyGrip{
  constructor(camera){
    this.camera = camera
    this.cameraSetNamedView('default')
    this.cameraPivot = new THREE.Group()
    this.cameraPivot.add( camera )
    this.animations = []
  }
  cameraSetNamedView(name){
    const position = this.getPosition(name)
    const lookTarget = this.getView(name)
    this.camera.position.set( position.x, position.y, position.z )
    this.camera.lookAt( lookTarget )
    this.camera.currentTarget = this.getView(name)
  }
  getPosition(name){
    switch(name){
      case 'parsa':
        return new THREE.Vector3(0.5,-1,0)
      default:
        return new THREE.Vector3(-0.5, 2.5, 1.5)
    }
  }
  getView(name){
    switch(name){
      case 'parsa':
        return new THREE.Vector3(0,0,0)
      default:
        return new THREE.Vector3(0,1,0)
    }
  }
  getCameraPivot(){
    return this.cameraPivot
  }
  getCurrentPosition(){
    return this.cameraPivot.position
  }
  rotateAroundY( value ){
    this.cameraPivot.rotateOnWorldAxis( new THREE.Vector3(0,1,0), value )
  }
  addTransition(endPosition, endTarget, transitionTime){
    this.animations = [
      {
        startPosition:undefined,
        startTarget:undefined,
        startTime: -1,
        endPosition,
        endTarget,
        transitionTime
      },
      ...this.animations
    ]
  }
  update( epoch ){
    if( this.animations.length > 0 ){
      const lastIndex = this.animations.length -1
      if( this.animations[lastIndex].startTime === -1 ){
        this.animations[lastIndex].startPosition = this.cameraPivot.position
        this.animations[lastIndex].startTarget = this.camera.currentTarget
        this.animations[lastIndex].startTime = epoch
        console.log(this.animations[lastIndex])
      }else{
        let lerpValue = (epoch - this.animations[lastIndex].startTime) / this.animations[lastIndex].transitionTime
        if( lerpValue > 1 ){
          lerpValue = 1
        }
        const currentAnimation = this.animations[lastIndex]
        const currentPosition = currentAnimation.startPosition.lerp( currentAnimation.endPosition, lerpValue )
        const currentTarget = currentAnimation.startTarget.lerp( currentAnimation.endTarget, lerpValue )
        this.cameraPivot.position.set( currentPosition.x, currentPosition.y, currentPosition.z )
        this.camera.lookAt( currentTarget )
        if( lerpValue === 1 ){
          this.animations.pop()
          console.log('pop')
        }
      }
    }
  }
}