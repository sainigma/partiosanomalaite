import * as THREE from 'three'
import { FrequencyDisplay } from './Radio/FrequencyDisplay'
import { Dial } from './Radio/Dial'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Radio {
  constructor(owner){
    this.loadStarted = false
    this.loadingComplete = false
    this.dials = {
      MHz:undefined,
      KHz:undefined,
      channel:undefined,
      power:undefined,
      volume:undefined,
      mode:undefined
    }
    this.owner = owner
    this.outlineIndex
    this.dot
    this.active = false
    this.singleDisplay = new THREE.Group()
    this.frequencyDisplay = new FrequencyDisplay()
    //this.loadModel(owner)
  }

  dialEnumerator(name){
    switch(name){
      case 'MHz':
        return this.dials.MHz
      case 'KHz':
        return this.dials.KHz
      case 'volume':
        return this.dials.volume
      case 'power':
        return this.dials.power
      case 'channel':
        return this.dials.channel
      case 'mode':
        return this.dials.mode
    }
    return undefined
  }
  getDial(name){
    const target = this.dialEnumerator(name)
    if( target === undefined ) return -1
    return target.get()
  }
  getDialObject(name){
    const target = this.dialEnumerator(name)
    if( target === undefined ) return -1
    return target.object
  }
  setDial(name,value){
    const target = this.dialEnumerator(name)
    if( target === undefined ) return -1
    target.set(value)
  }
  moveDial(name,positive){
    const target = this.dialEnumerator(name)
    if( target === undefined ) return -1
    positive ? target.increment() : target.decrement()
  }

  resetDial(name){
    const target = this.dialEnumerator(name)
    if( target === undefined ) return -1
    target.reset()
  }

  assignDial(child){
    switch(child.name){
      case 'MHzValitsin':
        this.dials.MHz = new Dial(child,1,1,30)
        break
      case 'KHzValitsin':
        this.dials.KHz = new Dial(child,1,1,-30)
        break
      case 'volyymiValitsin':
        this.dials.volume = new Dial(child,100,0,10)
        break
      case 'virtaTehoValitsin':
        this.dials.power = new Dial(child,3,0,27)
        break
      case 'kanavaValitsin':
        this.dials.channel = new Dial(child,9,0,-29.93)
        break
      case 'modeValitsin':
        this.dials.mode = new Dial(child,3,1,-30)
        break
    }
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
        }else{
          child.visible = false
          this.dot = child
        }
      }else if( child.name.includes('Valitsin') ){
        this.assignDial(child)
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

  loadModel(){
    this.loadStarted = true
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
      this.loadingComplete = true
    }

    let loader = new GLTFLoader(manager).setPath('models/')
    loader.load('radio.gltf', (gltf) => {
      let radio = gltf.scene
      radio.scale.set(10,10,10)
      radio.name = 'radio'
      this.radio = radio
      this.radio.add( this.singleDisplay )
      this.owner.add(radio)
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
  setFrequency(newFrequency){
    this.frequencyDisplay.changeFrequency(newFrequency)
  }
  setActive(isActive){
    this.active = isActive
    this.frequencyDisplay.setActive(isActive)
    this.dot.visible = isActive
  }
}