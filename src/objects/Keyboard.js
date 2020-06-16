import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Keyboard {
  constructor(owner,audioPlayer){
    this.keyEnum = {}
    this.keysDown = []
    this.audioPlayer = audioPlayer
    this.loadModel(owner)
  }

  loadModel(owner){
    const manager = new THREE.LoadingManager()
    const keyboardDiv = document.createElement('div')
    document.getElementById('debug').appendChild(keyboardDiv)

    manager.onStart = () => {
      keyboardDiv.appendChild(document.createTextNode('Loading keyboard..'))
    }
    manager.onProgress = () => {
      keyboardDiv.appendChild(document.createTextNode('.'))
    }
    manager.onLoad = () => {
      keyboardDiv.appendChild(document.createTextNode(' complete'))
    }
    let loader = new GLTFLoader(manager).setPath('models/')
    loader.load('nappaimisto.gltf', (gltf) => {
      this.keyboard = gltf.scene
      this.keyboard.scale.set(10,10,10)
      this.keyboard.position.set(0,0.025641*10, -0.021675*10)

      this.keyboard.children.forEach( (item,index) => {
        const key = item.name
        this.keyEnum[key] = index
      })
      owner.add(this.keyboard)
    })
  }

  keyCodeEnumerator(keyCode){
    if( keyCode >= 65 && keyCode <= 90 ){
      return this.keyEnum[keyCode]
    }else{
      switch( keyCode ){
        case 16:
        case 60:
          return this.keyEnum['shift']
        case 188:
        case 37:
          return this.keyEnum['left']
        case 173:
        case 39:
          return this.keyEnum['right']
        case 190:
        case 40:
          return this.keyEnum['dot']
        case 8:
        case 221:
          return this.keyEnum['backspace']
        case 13:
        case 192:
          return this.keyEnum['enter']
        case 35:
        case 222:
          return this.keyEnum['end']
        default:
          return -1
      }
    }
  }

  moveKey(keyCode, isPushed, direct){
    let key = null
    let actuate = false
    let index = !direct ? this.keyCodeEnumerator(keyCode) : keyCode
    if( index === -1 ) return false

    if( direct || this.keysDown.indexOf( index ) === -1 ){
      actuate = true
      key = this.keyboard.children[index]
    }

    if( actuate ){
      if( isPushed ){
        this.audioPlayer.play('keyDown')
        key.scale.set(1,0.1,1)
        this.keysDown.push( index )
      }else{
        this.audioPlayer.play('keyUp')
        key.scale.set(1,1,1)
        this.keysDown = this.keysDown.filter( key => key !== keyCode )
      }
    }
  }
  pullKeys(keyCodes){
    const enumKeysDown = keyCodes.map( key => this.keyCodeEnumerator(key))
    const keysToPull = this.keysDown.filter( key => {
      if( enumKeysDown.indexOf(key)===-1 ){
        return key
      }
    })
    keysToPull.forEach( key => this.moveKey(key,false,true))
  }

  moveKeys(keyCodes){
    if( keyCodes.length === 0 ){
      if( this.keysDown.length !== 0 ){
        this.keysDown.forEach( key => this.moveKey(key,false,true))
        this.keysDown = []
      }
      return 0
    }
    this.pullKeys(keyCodes)
    keyCodes.forEach( key => this.moveKey(key,true,false) )
  }
}