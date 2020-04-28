import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Parsa {
  constructor(owner){
    this.outlineIndex
    this.owner = owner
    this.loadStarted = false
    //this.loadModel()
    this.loadingComplete = false
  }
  loadModel(){
    this.loadStarted = true
    const manager = new THREE.LoadingManager()
    const parsaDiv = document.createElement('div')
    document.getElementById('debug').appendChild(parsaDiv)

    manager.onStart = () => {
      parsaDiv.appendChild(document.createTextNode('Loading parsa..'))
    }
    manager.onProgress = () => {
      parsaDiv.appendChild(document.createTextNode('.'))
    }
    manager.onLoad = () => {
      parsaDiv.appendChild(document.createTextNode(' complete'))
      this.loadingComplete = true
    }

    let loader = new GLTFLoader(manager).setPath('models/')
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
      this.owner.add(parsa)
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