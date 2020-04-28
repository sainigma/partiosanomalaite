import { GenericInterface } from "./GenericInterface"

export class RadioInterface extends GenericInterface{
  constructor(radio, radioGroup, serverComms, audioPlayer, intersecter, mouseListener, dollyGrip, setActiveInterface){
    super(radio, radioGroup, serverComms, audioPlayer, intersecter, mouseListener, ['runko', 'radio', 'runkoOutline'])
    this.radio = radio
    this.name = 'radio'
    this.power = false
    this.dollyGrip = dollyGrip
    this.dollyTransitionTime = 0.34
    this.radioGroup = radioGroup
    this.setActiveInterface = setActiveInterface
    this.frequency = {
      min:30000,
      max:85975,
      update:false,
      increment:1025,
      value:30000,
      lastChanged:0,
      delay:0.08
    }
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

  keyCodesWithMouseActions( keyCodes ){
    return keyCodes;
  }

  checkKeyCodesForFrequency( keyCodes ){
    const MHzIncrement = keyCodes.includes(82)
    const KHzIncrement = keyCodes.includes(85)
    const MHzDecrement = keyCodes.includes(70)
    const KHzDecrement = keyCodes.includes(74)

    let increment = 0

    if( MHzIncrement ){
      this.radio.setDial('MHz',1)
      increment += 1000
    }else if( MHzDecrement ){
      this.radio.setDial('MHz',-1)
      increment -= 1000
    }else{
      this.radio.resetDial('MHz')
    }

    if( KHzIncrement ){
      this.radio.setDial('KHz',1)
      increment += 25
    }else if( KHzDecrement ){
      this.radio.setDial('KHz',-1)
      increment -= 25
    }else{
      this.radio.resetDial('KHz')
    }

    this.frequency.increment = increment
    if( MHzIncrement || MHzDecrement || KHzIncrement || KHzDecrement ){
      this.frequency.update = true
      return true
    }else{
      this.resetFrequency()
      return false
    }
  }

  togglePower(power){
    this.power = power
    this.radio.setActive(power)
    if( power ){
      this.setFrequency(this.frequency.value)
    }
    this.serverComms.setPower(power)
  }

  checkKeyCodesForPower(keyCodes){
    const increasePower = keyCodes.includes(81)
    const decreasePower = keyCodes.includes(65)
    if( !increasePower && !decreasePower ){
      return false
    }
    if( this.bouncer.debounced ){
      if( increasePower ) this.radio.moveDial('power',true)
      if( decreasePower ) this.radio.moveDial('power',false)
      const newPower = this.radio.getDial('power') > 0 
      if( newPower !== this.power ){
        this.togglePower(newPower)
      }
    }
    return true
  }

  resetFrequency(){
    this.frequency.update = false
    this.frequency.increment = 0
    this.radio.resetDial('KHz')
    this.radio.resetDial('MHz')
  }
  setFrequency(value){
    this.frequency.value = value
    this.radio.setFrequency(value)
  }
  updateFrequency(epoch){
    if( this.power && this.frequency.update && epoch - this.frequency.lastChanged > this.frequency.delay ){
      const newFrequency = this.frequency.value + this.frequency.increment
      if( newFrequency >= this.frequency.min && newFrequency <= this.frequency.max ){
        this.frequency.value += this.frequency.increment
        this.frequency.lastChanged = epoch
        this.radio.setFrequency(this.frequency.value)
      }else if( newFrequency > this.frequency.max ){
        this.frequency.value = this.frequency.max
        this.radio.setFrequency(this.frequency.value)
      }else if( newFrequency < this.frequency.min ){
        this.frequency.value = this.frequency.min
        this.radio.setFrequency(this.frequency.value)
      }
    }
  }

  updateWhenActive( keyCodes, epoch ){
    if( keyCodes.length > 0 ){
      const frequencyChanged = this.checkKeyCodesForFrequency( keyCodes )
      const powerChanged = this.checkKeyCodesForPower( keyCodes )
      if( frequencyChanged || powerChanged ){
        this.bouncer.debounced = false
      }else{
        this.bouncer.debounced = true
      }
      this.updateFrequency(epoch)
    }else{
      this.bouncer.debounced = true
      if( this.frequency.update ){
        console.log("moi")
        this.resetFrequency()
        this.serverComms.updateFrequency(this.frequency.value/1E3)
      }
    }
  }
}