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

  constructor(display, parsaGroup){
    super()
    this.version = 'V 20200320A'
    this.parsaGroup = parsaGroup
    let date = new Date()

    this.state = {
      view:'off',
      subview:'',
      input:'',
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
    }else{
      const messages = [
        this.version,
        `by Kari Suominen   (C) 2020-${this.info.year}   `,
        'sainigma@github '
      ]

      const waitDuration = epoch - this.bouncer.waitStart
      switch(true){
        case waitDuration > 0.1:
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

  mainmenu(keyCodes){
    if( !this.state.hasUpdated ){
      this.display.setMessage('TOIMINTA       ?')
      this.state.hasUpdated = true
    }else{
      if( keyCodes.length === 2 && ( keyCodes[0] === 16 || keyCodes[0] === 60 ) ){
        switch( keyCodes[1] ){
          case 69:
            this.bouncer.debounced = false
            this.state.hasUpdated = false
            this.state.view = 'keys'
            this.state.subview = 'new'
            break
        }
      }else if( keyCodes[0] >= 65 && keyCodes[0] <= 90 ){
        switch( keyCodes[0] ){
          case 81:
            this.bouncer.debounced = false
            this.state.hasUpdated = false
            this.state.view = 'message'
            break
          case 82:
            this.state.hasUpdated = false
            this.state.view = 'config'
            break
          case 80:
            this.state.hasUpdated = false
            this.state.view = 'time'
            break
          case 69:
            this.state.hasUpdated = false
            this.state.view = 'keys'
            this.state.subview = ''
            break
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
          this.messenger(keyCodes)
          break
      }
    }else{
      this.bouncer.debounced = true
      this.state.previousKey = 0
      this.state.previousKeysLength = 0
    }
  }
}