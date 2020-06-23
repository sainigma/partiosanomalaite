import { GenericInterface } from "./GenericInterface"
import * as THREE from 'three'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils'

export class NoteBookInterface extends GenericInterface{
  constructor(noteBook, scene, audioPlayer, intersecter, mouseListener, dollyGrip, setActiveInterface){
    super(noteBook, undefined, undefined, audioPlayer, intersecter, mouseListener, ['vihko', 'sivu', 'vihkoOutline'])
    this.pickupSound = new Audio('sounds/notebook.wav')
    this.noteBook = noteBook
    this.name = 'notebook'
    this.scene = scene
    this.dollyGrip = dollyGrip
    this.dollyTransitionTime = 0.34
    this.setActiveInterface = setActiveInterface
    this.animation = {
      isAnimating:false
    }
  }
  updateWhenActive( keyCodes, epoch ){
    const firstHover = this.intersecter.getFirstHover()
    const grabbing = document.getElementById('root').style.cursor === 'grabbing'
    if( firstHover ){
      const nextPage = this.intersecter.contains('nextPage')
      const prevPage = this.intersecter.contains('prevPage')
      if( nextPage || ( prevPage && this.noteBook.selectedPage > 0 ) ){
        if( !grabbing ){
          document.getElementById('root').style.cursor = 'pointer'
        }
      }else if(firstHover.object.parent.name === 'sivu'){
        if( !grabbing ){
          document.getElementById('root').style.cursor = 'auto'
        }
      }
      if( this.mouseListener.mouse === 1 && this.bouncer.mouseDebounced ){
        if( nextPage ){
          this.noteBook.changePage(true)
          this.bouncer.mouseDebounced = false
        }else if( prevPage ){
          this.bouncer.mouseDebounced = false
          this.noteBook.changePage(false)
        }
      }else if( this.mouseListener.mouse === 0 ){
        this.bouncer.mouseDebounced = true
      }
    }else{
      if( !grabbing ){
        document.getElementById('root').style.cursor = 'auto'
      }
    }
    this.noteBook.animate(epoch)
  }
  keyCodesWithMouseActions( keyCodes ){

  }
  isActive(){
    return this.active
  }
  activate(){
    const pickupSound = this.pickupSound.cloneNode()
    pickupSound.play()
    this.noteBook.vihko.position.set(0,0,0)
    this.dollyGrip.camera.add( this.noteBook.vihko )
    this.noteBook.vihko.position.copy( this.dollyGrip.bindTarget )
    this.noteBook.vihko.rotateX(3.14159*0.5)
    this.active = true
    this.setActiveInterface(undefined, 'mapBook')
  }
  deactivate( forced ){
    if( this.active && forced !== undefined ){
      const pickupSound = this.pickupSound.cloneNode()
      pickupSound.volume = 0.5
      pickupSound.play()
      this.noteBook.vihko.position.set(0,0,0)
      this.noteBook.noteBookGroup.add( this.noteBook.vihko )
      this.noteBook.resetTransforms()
      this.active = false
    }
  }
}