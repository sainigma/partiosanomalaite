import { GenericInterface } from "./GenericInterface"

export class MapBookInterface extends GenericInterface{
  constructor(mapBook, noteBookInterface, intersecter, mouseListener, dollyGrip, setActiveInterface){
    super(mapBook, undefined, undefined, undefined, intersecter, mouseListener, ['karttatasku', 'karttataskuOutline'])
    this.mapBook = mapBook
    this.name = 'mapBook'
    this.noteBookInterface = noteBookInterface
    this.dollyGrip = dollyGrip
    this.dollyTransitionTime = 0.34
    this.setActiveInterface = setActiveInterface
    this.animation = {
      isAnimating:false
    }
  }

  getCameraPosition(){
    let newTarget = {
      x:this.mapBook.owner.position.x,
      y:this.mapBook.owner.position.y,
      z:this.mapBook.owner.position.z
    }
    return newTarget
  }

  getLookAtTarget(){
    let newTarget = {
      x:1,
      y:4,
      z:2
    }
    return newTarget
  }

  activate(){
    if( this.noteBookInterface.isActive() ){
      this.active = false
      this.setActiveInterface(undefined, 'notebook')

    }else{
      this.setActiveInterface(this.name)
      this.dollyGrip.addTransition( this.getCameraPosition(), this.getLookAtTarget(), this.dollyTransitionTime )
    
    }
  }

  deactivate(){
    this.active = false
  }

  keyCodesWithMouseActions( keyCodes, epoch ){

  }

  updateWhenActive( keyCodes, epoch ){

  }
}