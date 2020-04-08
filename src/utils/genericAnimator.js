import * as THREE from 'three'

export const lerpAnimation = (epoch, animation, target) => {
  let newAnimation = animation
  /*
  let animation = {
    isAnimating:false,
    defaultPosition:this.parsaGroup.position,
    defaultRotation:this.parsaGroup.rotation,
    positionOffset:undefined,
    rotationOffset:undefined,
    direction:true,
    startTime:-1,
    duration:3
  }  */
  if( newAnimation.startTime === -1 ){
    newAnimation.startTime = epoch
  }
  let startPosition = newAnimation.defaultPosition
  let startRotation = new THREE.Vector3(newAnimation.defaultRotation.x,newAnimation.defaultRotation.y,newAnimation.defaultRotation.z)

  if( newAnimation.alternativeRotation === undefined ){
    let alternativeRotation = new THREE.Vector3(startRotation.x,startRotation.y,startRotation.z)
    alternativeRotation.x += newAnimation.rotationOffset[0]
    alternativeRotation.y += newAnimation.rotationOffset[1]
    alternativeRotation.z += newAnimation.rotationOffset[2]
    newAnimation.alternativeRotation = alternativeRotation
  }
  if( newAnimation.alternativePosition === undefined ){
    let alternativePosition = newAnimation.defaultPosition.clone()
    alternativePosition.x += newAnimation.positionOffset[0]
    alternativePosition.y += newAnimation.positionOffset[1]
    alternativePosition.z += newAnimation.positionOffset[2]
    newAnimation.alternativePosition = alternativePosition
  }
  let lerpValue = (epoch - newAnimation.startTime)/newAnimation.duration

  if( lerpValue > 1 ){
    lerpValue = 1
  }
  
  let endPosition = newAnimation.alternativePosition.clone()
  let endRotation = newAnimation.alternativeRotation.clone()

  let currentPosition, currentRotation
  if( newAnimation.direction ){
    currentPosition = startPosition.lerp(endPosition,lerpValue)
    currentRotation = startRotation.lerp(endRotation,lerpValue)
  }else{
    currentPosition = endPosition.lerp(startPosition,lerpValue)
    currentRotation = endRotation.lerp(startRotation,lerpValue)
  }

  
  target.position.set( currentPosition.x, currentPosition.y, currentPosition.z )
  target.rotation.set( currentRotation.x, currentRotation.y, currentRotation.z )

  if( lerpValue === 1 && newAnimation.direction ){
    newAnimation.isAnimating = false
    newAnimation.startTime = -1
  }

  return newAnimation
}