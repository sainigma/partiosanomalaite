import * as THREE from 'three'
import { FrequencyDisplay } from './FrequencyDisplay'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Radio {
  constructor(owner){
    this.outlineIndex
    this.singleDisplay = new THREE.Group()
    this.frequencyDisplay = new FrequencyDisplay()
    this.loadModel(owner)
  }

  splitChildren(){
    let segments = []
    this.radio.children.forEach( (child,index) => {
      if( child.name === 'runkoOutline' ){
        this.outlineIndex = index
        child.visible = false
      }else if( child.name.includes('segmentti') ){
        if( child.name !== 'segmenttiDot' ){
          segments.push(child)
        }
      }
    })
    this.initFrequencyDisplay(segments)
  }

  initFrequencyDisplay(segments){
    segments.forEach( segment => {
      this.singleDisplay.add(segment)
    })
    this.frequencyDisplay.createDisplay(this.singleDisplay, this.radio)
  }

  loadModel(owner){
    const manager = new THREE.LoadingManager()
    const radioDiv = document.createElement('div')
    document.getElementById('debug').appendChild(radioDiv)

    manager.onStart = () => {
      radioDiv.appendChild(document.createTextNode('Loading radio..'))
    }
    manager.onProgress = () => {
      radioDiv.appendChild(document.createTextNode('.'))
    }
    manager.onLoad = () => {
      radioDiv.appendChild(document.createTextNode(' complete'))
      this.splitChildren()
    }

    let loader = new GLTFLoader(manager).setPath('models/')
    loader.load('radio.gltf', (gltf) => {
      let radio = gltf.scene
      radio.scale.set(10,10,10)
      radio.name = 'radio'
      this.radio = radio
      this.radio.add( this.singleDisplay )
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