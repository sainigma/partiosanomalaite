import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Ground {
  constructor(owner){
    this.outlineIndex
    this.loadModel(owner)
  }
  loadModel(owner){
    const manager = new THREE.LoadingManager()
    const groundDiv = document.createElement('div')
    document.getElementById('debug').appendChild(groundDiv)

    manager.onStart = () => {
      groundDiv.appendChild(document.createTextNode('Loading ground..'))
    }
    manager.onProgress = () => {
      groundDiv.appendChild(document.createTextNode('.'))
    }
    manager.onLoad = () => {
      groundDiv.appendChild(document.createTextNode(' complete'))
    }

    let loader = new GLTFLoader(manager).setPath('models/')
    loader.load('maasto.gltf', (gltf) => {
      let maasto = gltf.scene
      maasto.scale.set(10,10,10)
      maasto.name = 'maasto'
      this.maasto = maasto
      owner.add(maasto)
    })
  }
}