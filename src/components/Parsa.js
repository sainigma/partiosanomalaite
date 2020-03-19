import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Parsa {
  constructor(owner){
    let loader = new GLTFLoader().setPath('models/')

    loader.load('parsa.gltf', (gltf) => {
      let parsa = gltf.scene
      parsa.scale.set(10,10,10)
      owner.add(parsa)
    })
  }
  getDisplayPosition(){
    return new THREE.Vector3(0,0.3,0.45)
  }
}