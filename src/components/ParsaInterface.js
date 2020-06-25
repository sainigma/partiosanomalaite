import { GeneralConfig } from "./ParsaInterface/GeneralConfig"
import { KeyConfig } from "./ParsaInterface/KeyConfig"
import { TimeConfig } from "./ParsaInterface/TimeConfig"
import { Messenger } from "./ParsaInterface/Messenger"
import { lerpAnimation } from './../utils/genericAnimator'

class ClassAggregator extends Messenger(GeneralConfig(KeyConfig(TimeConfig(Object)))){
  constructor(){
    super()
  }
}

export class ParsaInterface extends ClassAggregator{

  constructor(display, keyboard, parsa, parsaGroup, dollyGrip, serverComms, audioPlayer ,intersecter, mouseListener, setActiveInterface){
    super()

    let date = new Date()
    this.version = 'V YYYYMMDDX'
    this.name = 'parsa'
    this.info = {
      year:date.getFullYear()
    }
    this.skipIntro = false
    this.display = display
    this.shiftToggled = false
    this.dollyTransitionTime = 0.34

    this.parsa = parsa
    this.model = parsa
    this.parsaGroup = parsaGroup
    this.dollyGrip = dollyGrip
    this.keyboard = keyboard
    this.mouseListener = mouseListener
    this.serverComms = serverComms
    this.audioPlayer = audioPlayer
    this.intersecter = intersecter
    this.setActiveInterface = setActiveInterface
    this.active = false

    this.state = {
      view:'off',
      subview:'',
      hasUpdated:false,
      previousKey:0,
      previousKeysLength:0
    }

    this.bouncer = {
      debounced: true,
      isWaiting: false,
      waitDuration: 0,
      waitStart: 0,
      mouseDebounced: true
    }


    this.messages = [/*
      {
        time:1586100737382,
        content:'Eka viesti',
        sender:'BBB'
      },
      {
        time:1586100737382,
        content:'Toka viesti',
        sender:'BBB'
      },
    */]
    this.newMessages = false
    this.parsaIndexInParsaGroup = -1
    this.animation = {
      isAnimating:false,
      defaultPosition:this.parsaGroup.position,
      defaultRotation:[
        this.parsaGroup.rotation.x,
        this.parsaGroup.rotation.y,
        this.parsaGroup.rotation.z
      ],
      positionOffset:[0,0,0],
      rotationOffset:[0.5944,0,0],
      direction:true,
      startTime:-1,
      duration:0.3
    }
  }

  loadStarted(){
    return this.parsa.loadStarted
  }

  hasLoaded(){
    return this.parsa.loadingComplete
  }

  offState(keyCodes,epoch){
    if( keyCodes.indexOf( 60 ) !== -1 || keyCodes.indexOf( 16 ) !== -1 ){
      this.state.view = 'intro'
      this.display.setMessage('................')
      this.state.hasUpdated = false
    }else{
      this.state.hasUpdated = true
      this.display.setMessage('')
    }
  }

  intro(epoch){
    const changeMessage = (message, timestamp) => {
      const displayMessage = this.display.getMessage()
      if( message !== displayMessage ){
        if( timestamp ){
          this.display.setScrollingMessage(message, timestamp)
        }else{
          this.display.setMessage(message)
        }
      }
    }

    if( this.bouncer.waitStart === 0 ){
      this.bouncer.waitStart = epoch
      this.display.setMessage( '................' )
      this.serverComms.send('handshake','yk')
    }else{
      const messages = [
        this.version,
        `by Kari Suominen   (C) 2020-${this.info.year}   `,
        'sainigma@github '
      ]

      const waitDuration = epoch - this.bouncer.waitStart
      switch(true){
        case waitDuration > (this.skipIntro ? 0.1 : 8):
          this.state.view = 'time'
          this.bouncer.waitStart = 0
          break
        case waitDuration > 7:
          changeMessage( messages[2] )
          break
        case waitDuration > 3:
          changeMessage( messages[1], epoch )
          break
        case waitDuration > 1:
          changeMessage( messages[0] )
          break
      }
    }
  }

  backToMainmenu(){
    this.state.view = 'mainmenu'
    this.state.subview = ''
    this.state.hasUpdated = false
    this.bouncer.debounced = false
  }

  reset(keyCodes){
    if( !this.state.hasUpdated ){
      this.display.setMessage('Muistin tuho   ?')
      this.state.hasUpdated = true
    }
    if( keyCodes.length > 0 && this.bouncer.debounced ){
      const keyCode = keyCodes[keyCodes.length-1]
      this.bouncer.debounced = false
      this.state.hasUpdated = false
      switch( keyCode ){
        case 13:
        case 192:
          this.resetTime()
          this.resetKeys()
          this.resetGeneral()
          this.resetMessenger()
          this.state.view = 'intro'
          break
        case 35:
        case 222:
          this.backToMainmenu()
          break
        default:
          this.bouncer.debounced = true
          this.state.hasUpdated = true
      }
    }
  }

  messageNotification(keyCodes){
    if( !this.state.hasUpdated ){
      this.display.setMessage('Viestejä')
      this.state.hasUpdated = true
    }else if( keyCodes.length > 0 ){
      const lastKey = keyCodes[keyCodes.length-1]
      if( lastKey === 85 && this.bouncer.debounced ){
        this.bouncer.debounced = false
        this.newMessages = false
        this.state.hasUpdated = true
      }else{
        this.mainmenuLogic(keyCodes)
      }
    }
  }

  mainmenuLogic(keyCodes){
    if( keyCodes.length === 2 && ( keyCodes[0] === 16 || keyCodes[0] === 60 ) ){
      this.bouncer.debounced = false
      this.state.hasUpdated = false
      switch( keyCodes[1] ){
        case 69:
          this.state.view = 'keys'
          this.state.subview = 'new'
          break
        case 73:
          this.state.view = 'reset'
          break
        default:
          this.bouncer.debounced = true
          this.state.hasUpdated = true
      }
    }else if( keyCodes[0] >= 65 && keyCodes[0] <= 90 ){
      this.bouncer.debounced = false
      this.state.hasUpdated = false
      switch( keyCodes[0] ){
        case 81:
          this.state.view = 'message'
          break
        case 87:
          this.inboxselection = -1
          this.state.view = 'inbox'
          break
        case 84:
          if( this.settingsAreValid() ){
            this.state.subview = 'send'
          }else{
            this.state.subview = 'invalid'
          }
          this.state.view = 'message'
          break
        case 85:
          if( this.newMessages ){
            this.state.view = 'inbox'
            this.inboxselection = this.messages.length - 1
          }
          break
        case 82:
          this.state.view = 'config'
          break
        case 80:
          this.state.view = 'time'
          break
        case 69:
          this.state.view = 'keys'
          this.state.subview = ''
          break
        default:
          this.bouncer.debounced = true
          this.state.hasUpdated = true
      }
    }
  }

  mainmenu(keyCodes){
    if( !this.state.hasUpdated ){
      this.display.setMessage('TOIMINTA       ?')
      this.state.hasUpdated = true
    }else{
      this.mainmenuLogic(keyCodes)
    }
  }
  
  updateWhenActive(keyCodes,epoch){
    this.keyboard.moveKeys( keyCodes )
    if( keyCodes.length > 0 || !this.state.hasUpdated ){
      const keysLength = keyCodes.length
      const lastKey = keyCodes[keysLength-1]
      if( keysLength > this.state.previousKeysLength ){
        this.bouncer.debounced = true
        this.state.previousKey = lastKey
      }
      this.state.previousKeysLength = keysLength
      switch( this.state.view ){
        case 'off':
          this.offState(keyCodes,epoch)
          break
        case 'intro':
          this.intro(epoch)
          break
        case 'mainmenu':
          if( this.newMessages ) this.messageNotification(keyCodes)
          else this.mainmenu(keyCodes)
          break
        case 'time':
          this.setTime(keyCodes)
          break
        case 'config':
          this.configuration(keyCodes)
          break
        case 'keys':
          this.keyConfigurator(keyCodes)
          break
        case 'message':
          this.messenger(keyCodes, epoch)
          break
        case 'inbox':
          this.inbox(keyCodes)
          break
        case 'reset':
          this.reset(keyCodes)
          break
      }
    }else if( this.serverComms.hasMessages && this.audioPlayer.paused('burst') ){
      this.messages = [ ...this.messages, ...this.serverComms.getMessages() ]
      this.newMessages = true
      this.state.hasUpdated = false
    }else{
      this.bouncer.debounced = true
      this.state.previousKey = 0
      this.state.previousKeysLength = 0
    }
  }

  getName(){
    return this.name
  }
  getActive(){
    return this.active
  }

  resetAnimation(){
    this.animation.isAnimating = false
    this.animation.startTime = -1
  }

  getCameraPosition(){
    let newTarget = {
      x:this.parsaGroup.position.x,
      y:this.parsaGroup.position.y,
      z:this.parsaGroup.position.z
    }
    return newTarget
  }

  getLookAtTarget(){
    let newTarget = {
      x:0,
      y:2,
      z:2
    }
    return newTarget
  }

  activate(){
    this.resetAnimation()
    this.animation.direction = true
    this.animation.isAnimating = true

    this.active = true
    this.state.hasUpdated = false
    this.setActiveInterface(this.name)
    this.dollyGrip.addTransition( this.getCameraPosition(), this.getLookAtTarget(), this.dollyTransitionTime )
  }

  deactivate(){
    if( this.active ){
      this.shiftToggled = false
      this.active = false
      this.resetAnimation()
      this.animation.direction = false
      this.animation.isAnimating = true
    }
  }

  toggleActive(){
    this.active = !this.active
    if( this.active ){
      this.activate()
    }else{
      this.deactivate()
    }
  }
  keyCodesWithMouseActions(keyCodes){
    const firstHover = this.intersecter.getFirstHover()
    if( !firstHover ){
      if( this.shiftToggled ) return [16, ...keyCodes]
      else return keyCodes
    }
    let keyCode = firstHover.object.name
    const cases = ['left','right','dot','shift','enter','backspace','end']
    if( !Number.isNaN(parseInt(keyCode)) || cases.includes(keyCode) ){
      document.getElementById('root').style.cursor = 'pointer'
    }else{
      if( document.getElementById('root').style.cursor !== 'grabbing' ){
        document.getElementById('root').style.cursor = 'auto'
      }
    }
    if( this.mouseListener.mouse === 1 && firstHover ){
      switch( keyCode ){
        case 'left':
          keyCode = 37
          break
        case 'right':
          keyCode = 39
          break
        case 'dot':
          keyCode = 40
          break
        case 'shift':
          if( this.bouncer.mouseDebounced ){
            this.shiftToggled = !this.shiftToggled
            this.bouncer.mouseDebounced = false
          }
          break
        case 'enter':
          keyCode = 13
          break
        case 'backspace':
          keyCode = 8
          break
        case 'end':
          keyCode = 35
          break
        default:
          keyCode = parseInt(keyCode) 
      }
      if( !Number.isNaN(keyCode) ){
        if( keyCodes.length > 0 && keyCodes[0] === 16 || keyCodes[0] === 60 ){
          return [ 16, keyCode ]
        }
        if( this.shiftToggled ) return [ 16, keyCode, ...keyCodes ]
        return [ keyCode, ...keyCodes ]
      }
    }else{
      this.bouncer.mouseDebounced = true
    }
    if( this.shiftToggled ) return [16, ...keyCodes]
    return keyCodes
  }

  animate(epoch){
    this.animation = lerpAnimation(epoch, this.animation, this.parsaGroup)
  }

  update(keyCodes, epoch){
    if( this.animation.isAnimating ){
      this.animate(epoch)
    }
    if( this.active ){
      this.updateWhenActive( this.keyCodesWithMouseActions(keyCodes) ,epoch)
    }else{
      this.updateWhenActive( [], epoch )
      const firstHover = this.intersecter.getFirstHover()
      if( firstHover ){
        switch( firstHover.object.parent.name ){
          case 'partiosanomalaite_export':
          case 'partiosanomalaite_outlines':
          case 'nappaimisto':
            if( this.mouseListener.mouse === 1 ){
              this.toggleActive()
              this.parsa.setOutline(false)
            }else{
              this.parsa.setOutline(true)
            }
            break
          default:
            this.parsa.setOutline(false)
        }
      }else{
        this.parsa.setOutline(false)
      }
    }
  }
}