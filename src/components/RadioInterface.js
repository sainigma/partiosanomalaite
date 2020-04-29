import { GenericInterface } from './GenericInterface'
import { Intersecter } from './Intersecter'
import { degs2rads, verticalFov2horizontalRads } from './../utils/mathUtils'

export class RadioInterface extends GenericInterface{
  constructor(radio, radioGroup, serverComms, audioPlayer, intersecter, mouseListener, dollyGrip, setActiveInterface){
    super(radio, radioGroup, serverComms, audioPlayer, intersecter, mouseListener, ['runko', 'radio', 'runkoOutline'])
    this.radioIntersecter = new Intersecter(window, dollyGrip.camera)
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
    this.dragTarget = {
      dial:undefined,
      object:undefined,
      distance:0,
      cursorAtStart:{
        x:-1,
        y:-1
      },
      cursorDelta:{
        x:0,
        y:0
      },
      inner:{
        width:0,
        height:0
      },
      fov:undefined
    }
    this.channels = {
      active:0,
      list:[30000]
    }
    for( let i=1; i<10; i++ ){
      const value =  Math.floor(this.frequency.min + Math.random() * (this.frequency.max - this.frequency.min))
      this.channels.list.push(value)
    }

    this.animation = {
      isAnimating:false
    }
  }

  initDials(){
    const KHzDial = this.radio.getDialObject('KHz')
    this.radioIntersecter.addGroup( KHzDial )
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
    this.initDials()
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

  checkKeyCodesForChannel( keyCodes ){
    const increment = keyCodes.includes(39)
    const decrement = keyCodes.includes(37)
    if( !increment && !decrement ){
      return false
    }
    if( this.bouncer.debounced ){
      const index = this.channels.active
      this.loadFromChannelList( index + (increment ? 1 : -1) )
    }
    return true
  }

  checkKeyCodesForPower(keyCodes){
    const increasePower = keyCodes.includes(81)
    const decreasePower = keyCodes.includes(65)
    if( !increasePower && !decreasePower ){
      return false
    }
    if( this.bouncer.debounced ){
      this.radio.moveDial('power',increasePower)
      const newPower = this.radio.getDial('power') > 0 
      if( newPower !== this.power ){
        this.togglePower(newPower)
      }
    }
    return true
  }
  loadFromChannelList(index){
    if( index >= 0 && index < this.channels.list.length ){
      this.channels.active = index
      this.setFrequency(this.channels.list[index])
      this.radio.setDial("channel",index)
    }
  }

  resetFrequency(){
    this.frequency.update = false
    this.frequency.increment = 0
    this.radio.resetDial('KHz')
    this.radio.resetDial('MHz')
  }
  setFrequency(value){
    this.frequency.value = value
    this.channels.list[ this.channels.active ] = value
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

  initDragTarget(target, cursor){
    const targetDialName = target.object.name.split('DragTarget')[0]
    this.dragTarget = {
      dial:this.radio.getDialObject(targetDialName),
      object:target.object,
      distance:target.distance,
      cursorAtStart:cursor,
      cursorDelta:{
        x:0,
        y:0
      },
      inner:{
        width:window.innerWidth,
        height:window.innerHeight
      },
      fov:{
        horizontal:verticalFov2horizontalRads(this.dollyGrip.camera.fov),
        vertical:degs2rads(this.dollyGrip.camera.fov),
      }
    }
  }
  moveDragTarget(cursor){
    const oldDelta = this.dragTarget.cursorDelta
    const newDelta = {
      x:cursor.x - this.dragTarget.cursorAtStart.x,
      y:-(cursor.y - this.dragTarget.cursorAtStart.y)
    }
    if( oldDelta.x !== newDelta.x || oldDelta.y !== newDelta.y ){
      this.dragTarget.cursorDelta = newDelta
      const attitudeDelta = {
        x: (newDelta.x/this.dragTarget.inner.width)*this.dragTarget.fov.horizontal,
        y: (newDelta.y/this.dragTarget.inner.height)*this.dragTarget.fov.vertical,
      }
      this.dragTarget.object.position.x = 0.1 * attitudeDelta.x * this.dragTarget.distance
      this.dragTarget.object.position.y = 0.1 * attitudeDelta.y * this.dragTarget.distance
    }
  }

  resetDragTarget(){
    this.dragTarget.object.position.x = 0
    this.dragTarget.object.position.y = 0
    this.dragTarget = {
      dial:undefined,
      object:undefined,
      distance:0,
      cursorAtStart:{
        x:-1,
        y:-1
      },
      cursorDelta:{
        x:0,
        y:0
      },
      inner:{
        width:0,
        height:0
      },
      fov:undefined
    }
  }

  updateWhenActive( keyCodes, epoch ){
    const cursorLocation = this.mouseListener.getAbsolute()
    this.radioIntersecter.intersect( cursorLocation.x, cursorLocation.y )
    const firstHover = this.radioIntersecter.getFirstHover()
    if( firstHover || this.dragTarget.object !== undefined ){
      if( this.mouseListener.getButtons() > 0 ){
        if( this.dragTarget.object === undefined ){
          document.getElementById('root').style.cursor = 'grabbing'
          this.initDragTarget(firstHover, cursorLocation)
          console.log(firstHover)
          console.log(this.dragTarget)
        }else{
          if( firstHover ){
            this.dragTarget.distance = firstHover.distance
          }
          this.moveDragTarget(cursorLocation)
        }
      }else{
        if( this.dragTarget.object !== undefined ){
          this.resetDragTarget()
        }
        document.getElementById('root').style.cursor = 'grab'
      }
    }else{
      document.getElementById('root').style.cursor = 'auto'
    }

    if( keyCodes.length > 0 ){
      const frequencyChanged = this.checkKeyCodesForFrequency( keyCodes )
      const powerChanged = this.checkKeyCodesForPower( keyCodes )
      const channelChanged = this.checkKeyCodesForChannel( keyCodes )
      if( frequencyChanged || powerChanged || channelChanged ){
        this.bouncer.debounced = false
      }else{
        this.bouncer.debounced = true
      }
      this.updateFrequency(epoch)
    }else{
      this.bouncer.debounced = true
      if( this.frequency.update ){
        this.resetFrequency()
        this.channels.list[ this.channels.active ] = this.frequency.value
        this.serverComms.updateFrequency(this.frequency.value/1E3)
      }
    }
  }
}