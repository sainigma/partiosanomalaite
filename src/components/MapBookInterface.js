import { GenericInterface } from "./GenericInterface"

export class MapBookInterface extends GenericInterface{
  constructor(mapBook, intersecter, mouseListener, dollyGrip, setActiveInterface){
    super(mapBook, undefined, undefined, undefined, intersecter, mouseListener, ['karttatasku', 'karttataskuOutline'])
    this.mapBook = mapBook
    this.name = 'mapBook'
    this.dollyGrip = dollyGrip
    this.dollyTransitionTime = 0.34
    this.setActiveInterface = setActiveInterface
    this.animation = {
      isAnimating:false
    }
  }

  getCameraPosition(){
    let newTarget = {
      x:this.mapBook.karttatasku.position.x,
      y:0.5,
      z:this.mapBook.karttatasku.position.z
    }
    return newTarget
  }

  getLookAtTarget(){
    let newTarget = {
      x:-this.mapBook.karttatasku.position.x,
      y:0,
      z:this.mapBook.karttatasku.position.z
    }
    return newTarget
  }

  activate(){
    console.log('mapbook activated')
    console.log(this.mapBook)
    this.active = true
    this.setActiveInterface(this.name)
    this.dollyGrip.addTransition( this.getCameraPosition(), this.getLookAtTarget(), this.dollyTransitionTime )
  }

  deactivate(){
    console.log('mapbook deactivated')
    this.active = false
  }

  keyCodesWithMouseActions( keyCodes, epoch ){

  }

  updateWhenActive( keyCodes, epoch ){

  }
}