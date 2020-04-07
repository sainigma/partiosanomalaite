import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { getCharacterArray } from './SegmentDisplay/characters'

export class SegmentDisplay {
  constructor(segments, owner, initialPosition){
    this.segmentGroup = new THREE.Group()
    this.segments = segments
    this.message = ''
    this.slicedMessage = ''
    //this.message = 'TOIMINTA ?'
    //this.message = '                           LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    this.cursor = 0
    this.stop = false
    this.scrolling = false
    this.timestamp
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
    this.scrolling = false
    this.timestamp = 0
  }
  moveToLast(){
    const messageLength = this.message.length
    if( messageLength > 16 ){
      this.message = this.message.slice(messageLength - 16, messageLength)
    }
  }
  setScrollingMessage(message, timestamp){
    this.message=message
    this.cursor=0
    this.stop=false
    this.scrolling=true
    this.timestamp = timestamp
  }
  getMessage(){
    return this.message
  }
  update(epoch){
    let scrollingOffset = 0
    if( this.scrolling ){
      scrollingOffset = parseInt( (epoch - this.timestamp)*10 ) -8
      if( scrollingOffset < 0 ) scrollingOffset = 0
      const maxScroll = this.message.length - 16
      if( scrollingOffset > maxScroll ) scrollingOffset = maxScroll
    }
    if( !this.stop && this.segmentGroup.children.length === this.segments){
      let internalMessage = this.message.slice(scrollingOffset,this.message.length)
      internalMessage = internalMessage.slice(0,16)
      this.slicedMessage = internalMessage
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