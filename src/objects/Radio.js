import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Radio {
  constructor(owner){
    this.outlineIndex
    let loader = new GLTFLoader().setPath('models/')
    loader.load('radio.gltf', (gltf) => {
      let radio = gltf.scene
      /*
      radio.children.forEach( (child,index) => {
        if( child.name === 'radio_outlines' ){
          this.outlineIndex = index
          child.visible = false
        }
      })*/
      radio.scale.set(10,10,10)
      radio.name = 'radio'
      this.radio = radio
      console.log(radio)
      owner.add(radio)
    })
    
  }
  getDisplayPosition(){
    return new THREE.Vector3(0,0.3,0.45)
  }
  setOutline(state){
    if( this.radio !== undefined ){
      this.radio.children[this.outlineIndex].visible = state
    }
  }
}