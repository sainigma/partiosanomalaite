import * as THREE from 'three'
export class Intersecter{
  constructor(window, camera){
    this.objectGroups = []
    this.hovered = []
    this.window = {
      innerWidth:window.innerWidth,
      innerHeight:window.innerHeight,
    }
    this.raycaster = new THREE.Raycaster()
    this.camera = camera
  }
  intersect( clientX, clientY ){
    if( this.objectGroups.length > 0 && this.objectGroups[0] !== undefined ){
      const userClickedAt = new THREE.Vector2(
        ( clientX / window.innerWidth ) * 2 - 1,
        -( clientY / window.innerHeight ) * 2 + 1
      )
      this.raycaster.setFromCamera( userClickedAt, this.camera )
      
      let intersects = []
      this.objectGroups.forEach( objectGroup => {
        const currentIntersects = this.raycaster.intersectObjects( objectGroup.children, true )
        if( currentIntersects.length > 0 ){
          intersects = [...intersects, ...currentIntersects]
        }
      })
      this.hovered = intersects
    }
  }
  addGroup(objectGroup){
    this.objectGroups.push(objectGroup)
  }
  getFirstHover(){
    if( this.hovered.length > 0 ) return this.hovered[0]
    return false
  }
}