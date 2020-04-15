import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Parsa {
  constructor(owner){
    this.outlineIndex
    let loader = new GLTFLoader().setPath('models/')
    loader.load('parsa.gltf', (gltf) => {
      let parsa = gltf.scene
      parsa.children.forEach( (child,index) => {
        if( child.name === 'partiosanomalaite_outlines' ){
          this.outlineIndex = index
          child.visible = false
        }
      })
      parsa.scale.set(10,10,10)
      parsa.name = 'parsa'
      this.parsa = parsa
      owner.add(parsa)
    })
    
  }
  getDisplayPosition(){
    return new THREE.Vector3(0,0.3,0.45)
  }
  setOutline(state){
    if( this.parsa !== undefined ){
      this.parsa.children[this.outlineIndex].visible = state
    }
  }
}