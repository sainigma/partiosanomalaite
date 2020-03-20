import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Keyboard {
  constructor(owner){
    let loader = new GLTFLoader().setPath('models/')

    this.keyEnum = {}
    this.keysDown = []
    loader.load('nappaimisto.gltf', (gltf) => {
      this.keyboard = gltf.scene
      this.keyboard.scale.set(10,10,10)
      this.keyboard.position.set(0,0.42,0)
      
      this.keyboard.children.forEach( (item,index) => {
        const key = item.name
        this.keyEnum[key] = index
      })
      console.log( this.keyEnum )
      owner.add(this.keyboard)
    })
  }

  keyCodeEnumerator(keyCode){
    if( keyCode >= 65 && keyCode <= 90){
      return this.keyEnum[keyCode]
    }else if( keyCode === 16 || keyCode === 60 ){
      return this.keyEnum['shift']
    }else if( keyCode === 188 || keyCode === 37){
      return this.keyEnum['left']
    }else if( keyCode === 173 || keyCode === 39){
      return this.keyEnum['right']
    }else if( keyCode === 190 || keyCode === 40){
      return this.keyEnum['dot']
    }else if( keyCode === 8 || keyCode === 221){
      return this.keyEnum['backspace']
    }else if( keyCode === 13 || keyCode === 192 ){
      return this.keyEnum['enter']
    }else if( keyCode === 35 || keyCode === 222 ){
      return this.keyEnum['end']
    }else return -1
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
        key.scale.set(1,0.1,1)
        this.keysDown.push( index )
      }else{
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