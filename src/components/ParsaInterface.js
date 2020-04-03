import { GeneralConfig } from "./ParsaInterface/GeneralConfig"
import { KeyConfig } from "./ParsaInterface/KeyConfig"
import { TimeConfig } from "./ParsaInterface/TimeConfig"
import { Messenger } from "./ParsaInterface/Messenger"

class ClassAggregator extends Messenger(GeneralConfig(KeyConfig(TimeConfig(Object)))){
  constructor(){
    super()
  }
}

export class ParsaInterface extends ClassAggregator{

  constructor(display, parsaGroup, serverComms, audioPlayer){
    super()
    this.version = 'V 20200402A'
    this.parsaGroup = parsaGroup
    let date = new Date()

    this.skipIntro = true

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
      waitStart: 0
    }
    this.info = {
      year:date.getFullYear()
    }
    this.display = display
    this.serverComms = serverComms
    this.audioPlayer = audioPlayer
    this.serverComms.send('handshake','yk')
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
      const ogRot = this.parsaGroup.rotation
      this.parsaGroup.rotation.set(120,ogRot.y,ogRot.z)
      this.bouncer.waitStart = epoch
      this.display.setMessage( '................' )
      console.log("intro alkoi")
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

  mainmenu(keyCodes){
    if( !this.state.hasUpdated ){
      this.display.setMessage('TOIMINTA       ?')
      this.state.hasUpdated = true
    }else{
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
          case 84:
            if( this.settingsAreValid() ){
              this.state.subview = 'send'
            }else{
              this.state.subview = 'invalid'
            }
            this.state.view = 'message'
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
  }
  
  update(keyCodes, epoch){
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
          this.mainmenu(keyCodes)
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
        case 'reset':
          this.reset(keyCodes)
          break
      }
    }else{
      this.bouncer.debounced = true
      this.state.previousKey = 0
      this.state.previousKeysLength = 0
    }
  }
}