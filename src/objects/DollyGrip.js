import * as THREE from 'three'

export class DollyGrip{
  constructor(camera){
    this.camera = camera
    this.offsets = new THREE.Vector3( -2, 5, 5 )
    this.cameraPivot = new THREE.Group()
    this.bindTarget = new THREE.Vector3( -1.2,0.8,-2.5 )
    this.cameraPivot.add( camera )
    this.init()
    this.animations = []
  }
  init(){
    this.camera.position.set( this.offsets.x, this.offsets.y, this.offsets.z )
    this.camera.lookAt( this.cameraPivot.getWorldPosition() )
    this.camera.currentTarget = this.offsets
  }
  getPosition(name){
    switch(name){
      default:
        return new THREE.Vector3(this.offsets.x, this.offsets.y, this.offsets.z)
    }
  }
  getView(name){
    switch(name){
      default:
        return new THREE.Vector3(0,0,0)
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
    this.camera.currentTarget.set( this.camera.position.x - this.offsets.x, this.camera.position.y - this.offsets.y, this.camera.position.z - this.offsets.z )
  }
  addTransition(endPosition, endTarget, transitionTime){
    this.animations = [
      {
        startPosition:undefined,
        startTarget:undefined,
        startTime: -1,
        endPosition:new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z),
        endTarget:new THREE.Vector3(endTarget.x, endTarget.y, endTarget.z),
        transitionTime
      },
      ...this.animations
    ]
  }
  update( epoch ){
    if( this.animations.length > 0 ){
      const lastIndex = this.animations.length -1
      if( this.animations[lastIndex].startTime === -1 ){
        const startPosition = this.cameraPivot.position
        const startTarget = this.camera.currentTarget
        this.animations[lastIndex].startPosition = new THREE.Vector3( startPosition.x, startPosition.y, startPosition.z )
        this.animations[lastIndex].startTarget = new THREE.Vector3( startTarget.x, startTarget.y, startTarget.z )
        this.animations[lastIndex].startTime = epoch
      }else{
        let lerpValue = (epoch - this.animations[lastIndex].startTime) / this.animations[lastIndex].transitionTime
        if( lerpValue > 1 ){
          lerpValue = 1
        }
        const currentAnimation = this.animations[lastIndex]
        const currentPosition = currentAnimation.startPosition.clone().lerp( currentAnimation.endPosition, lerpValue )
        const currentTarget = currentAnimation.startTarget.clone().lerp( currentAnimation.endTarget, lerpValue )
        this.cameraPivot.position.set( currentPosition.x, currentPosition.y, currentPosition.z )
        this.camera.position.set( currentTarget.x + this.offsets.x, currentTarget.y +this.offsets.y, currentTarget.z+this.offsets.z )
        this.camera.lookAt( this.cameraPivot.getWorldPosition() )
        this.camera.currentTarget.set( currentTarget.x, currentTarget.y, currentTarget.z )
        if( lerpValue === 1 ){
          this.animations.pop()
        }
      }
    }
  }
}