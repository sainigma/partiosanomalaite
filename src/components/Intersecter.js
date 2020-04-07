import * as THREE from 'three'
export class Intersecter{
  constructor(window, camera, objects){
    this.hovered = []
    this.window = {
      innerWidth:window.innerWidth,
      innerHeight:window.innerHeight,
    }
    this.raycaster = new THREE.Raycaster()
    this.camera = camera
    this.activeObjects = objects
  }
  intersect( clientX, clientY ){
    const userClickedAt = new THREE.Vector2(
      ( clientX / window.innerWidth ) * 2 - 1,
      -( clientY / window.innerHeight ) * 2 + 1
    )
    this.raycaster.setFromCamera( userClickedAt, this.camera )

    const intersects = this.raycaster.intersectObjects( this.activeObjects.children, true )
    this.hovered = intersects
  }
  setActiveGroup(objectGroup){
    this.activeObjects = objectGroup
  }
  getFirstHover(){
    if( this.hovered.length > 0 ) return this.hovered[0]
    return false
  }
}