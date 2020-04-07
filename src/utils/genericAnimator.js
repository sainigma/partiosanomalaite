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

  if( newAnimation.alternativeRotation === undefined ){
    let alternativeRotation = newAnimation.defaultRotation.clone()
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

  let startPosition = newAnimation.direction ? newAnimation.defaultPosition : newAnimation.alternativePosition
  let endPosition = newAnimation.direction ? newAnimation.alternativePosition : newAnimation.defaultPosition
  let startRotation = newAnimation.direction ? newAnimation.defaultRotation.toVector3() : newAnimation.alternativeRotation.toVector3()
  let endRotation = newAnimation.direction ? newAnimation.alternativeRotation.toVector3() : newAnimation.defaultRotation.toVector3()

  const currentPosition = startPosition.lerp(endPosition,lerpValue)
  const currentRotation = startRotation.lerp(endRotation,lerpValue)
  target.position.set( currentPosition.x, currentPosition.y, currentPosition.z )
  target.rotation.set( currentRotation.x, currentRotation.y, currentRotation.z )

  if( lerpValue === 1 ){
    console.log("end")
    newAnimation.isAnimating = false
    newAnimation.direction = !newAnimation.direction
    newAnimation.startTime = -1
  }

  return newAnimation
}