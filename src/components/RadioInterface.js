import { GenericInterface } from "./GenericInterface"

export class RadioInterface extends GenericInterface{
  constructor(radio, radioGroup, serverComms, audioPlayer, intersecter, mouseListener, dollyGrip, setActiveInterface){
    super(radio, radioGroup, serverComms, audioPlayer, intersecter, mouseListener, ['runko', 'radio', 'runkoOutline'])
    this.radio = radio
    this.name = 'radio'
    this.dollyGrip = dollyGrip
    this.dollyTransitionTime = 0.34
    this.radioGroup = radioGroup
    this.setActiveInterface = setActiveInterface
    this.animation = {
      isAnimating:false
    }
  }

  getCameraPosition(){
    let newTarget = {
      x:this.radioGroup.position.x,
      y:-1.8,
      z:this.radioGroup.position.z+1
    }
    return newTarget
  }

  getLookAtTarget(){
    let newTarget = {
      x:this.radioGroup.position.x,
      y:0.5,
      z:-this.radioGroup.position.z+0.5
    }
    return newTarget
  }

  activate(){
    console.log('radio activated')
    this.active = true
    this.setActiveInterface(this.name)
    this.dollyGrip.addTransition( this.getCameraPosition(), this.getLookAtTarget(), this.dollyTransitionTime )
  }

  deactivate(){
    console.log('radio deactivated')
    this.active = false
  }

  keyCodesWithMouseActions( keyCodes, epoch ){

  }

  updateWhenActive( keyCodes, epoch ){

  }
}