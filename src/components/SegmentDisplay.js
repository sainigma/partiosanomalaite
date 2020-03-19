import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { getCharacterArray } from './SegmentDisplay/characters'

export class SegmentDisplay {
  constructor(segments, owner, initialPosition){
    this.segmentGroup = new THREE.Group()
    this.segments = segments
    //this.message = 'V 20200319-02'
    //this.message = 'TOIMINTA ?'
    this.message = '                            LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    this.cursor = 0
    this.stop = false

    let loader = new GLTFLoader().setPath('models/')

    loader.load('segmentDisplay.gltf', (gltf) => {
      let segmentDisplayPrototype = gltf.scene
      for( let i=0; i<segments; i++ ){
        let displayClone = segmentDisplayPrototype.clone()
        displayClone.position.set(i*0.05,0,0)
        this.segmentGroup.add(displayClone)
      }
      this.segmentGroup.position.set(initialPosition.x, initialPosition.y, initialPosition.z)
      owner.add(this.segmentGroup)
    })
  }
  setSegment(index,character){
    this.resetSegment(index)
    if( character !== '' && character !== ' ' ){
      const characterArray = getCharacterArray('basic',character)
      characterArray.forEach( item => {
        this.segmentGroup.children[index].children[item].visible = true
      })
    }
  }
  resetSegment(index){
    this.segmentGroup.children[index].children.forEach( segment => {
      segment.visible = false
    })
    this.segmentGroup.children[index].children[16].visible = true
  }
  setMessage(message){
    this.message=message
    this.cursor=0
    this.stop = false
  }
  update(cursorOffset){
    if( !this.stop && this.segmentGroup.children.length === this.segments){
      let offset = 0
      if( this.message.length-(this.cursor+cursorOffset)>this.segments ){
        offset = this.cursor+cursorOffset
        this.cursor = offset
      }else{
        offset = this.cursor
        this.stop = true
      }
      let internalMessage = this.message.slice(offset,this.message.length)
      internalMessage = internalMessage.slice(0,16)
      const internalMessageLength = internalMessage.length
      for( let i=0; i<16; i++ ){
        let character = ''
        if( i < internalMessageLength ){
          character = internalMessage[i]
        }
        this.setSegment(i,character)
      }
    }
  }
}