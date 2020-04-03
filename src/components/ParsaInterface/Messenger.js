export const Messenger = (mix) => class extends mix{
  constructor(){
    super()
    this.message = ''
    this.destination = ''
    this.transmissionStart = 0
    this.success = 0
  }
  resetMessenger(){
    this.message=''
    this.destination=''
    this.transmissionStart = 0
  }
  transmissionWaitingResponse(){
    return this.transmissionStart !== 0 && this.success === 0
  }
  shiftEnumerator(keyCode){
    const enumerator = {
      81:49,
      87:50,
      69:51,
      82:52,
      84:53,
      89:54,
      85:55,
      73:56,
      79:57,
      80:48,
      66:222,
      78:192
    }
    if( enumerator[keyCode] !== undefined ) return enumerator[keyCode]
    else return keyCode
  }

  sendMessage(keyCodes,epoch){
    if( !this.state.hasUpdated ){
      if( this.transmissionStart === 0 ){
        if( this.audioPlayer.paused('burst') ){
          this.serverComms.sendMessage(this.destination, this.message, this.checksums.key1 )
          this.display.setMessage('Lähetetään')
          this.transmissionStart = epoch
        }
      }else if(this.success === 400){
        this.state.hasUpdated = true
        this.display.setMessage('Linja varattu')
      }else if(this.success === 200){
        this.state.hasUpdated = true
        this.display.setMessage('Lähetetty')
      }else if( this.success === 0 && epoch - this.transmissionStart > 10 ){
        this.success = 400
      }else if( this.serverComms.success === 200 && this.audioPlayer.paused('burst') ){
        this.success = 200
        this.serverComms.ack()
      }
    }else if(this.success !== 0 && keyCodes.length > 0 ){
      const keyCode = keyCodes[keyCodes.length-1]
      switch(keyCode){
        case 13:
        case 192:
        case 35:
        case 222:
          if( this.success === 200 ){
            this.message = ''
          }
          this.transmissionStart = 0
          this.success = 0
          this.backToMainmenu()
          break
      }
    }
  }

  prepareMessageSend(keyCodes){
    const destinationLength = this.destination.split('_').length
    if(!this.state.hasUpdated){
      if( this.destination === '' ){
        this.destination = '___'
      }
      this.state.hasUpdated = true
      this.display.setMessage(`Asema=${this.destination}`)
    }
    if( keyCodes.length > 0 && this.bouncer.debounced ){
      const keyCode = keyCodes[keyCodes.length-1]
      if( keyCode > 64 && keyCode < 91 && destinationLength > 1 ){
        this.bouncer.debounced = false
        this.state.hasUpdated = false
        this.destination = this.codeSetter(this.destination, keyCode)
      }else{
        this.bouncer.debounced = false
        this.state.hasUpdated = false
        switch(keyCode){
          case 8:
          case 221:
            this.destination = this.codeEraser(this.destination)
            break
          case 13:
          case 192:
            this.state.subview = 'push'
            break
          case 35:
          case 222:
            this.destination = ''
            this.backToMainmenu()
            break
          default:
            this.bouncer.debounced = true
            this.state.hasUpdated = true
        }
      }
    }
  }

  cannotSend(keyCodes){
    if( !this.state.hasUpdated ){
      this.state.hasUpdated = true
      if( this.settings.callsign !== '' ){
        if( this.keys.key1 !== '' || this.keys.key2 !== '' ){
          this.display.setMessage(`Tyhjä vstkenttä`)
        }else{
          this.display.setMessage(`Avain puuttuu`)
        }
      }else{
        this.display.setMessage(`Vajaat asetukset`)
      }
    }
    if( keyCodes.length > 0 && this.bouncer.debounced ){
      const keyCode = keyCodes[keyCodes.length -1]
      this.bouncer.debounced = false
      this.state.hasUpdated = false
      switch(keyCode){
        case 13:
        case 192:
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

  composeMessage(keyCodes){
    if(!this.state.hasUpdated){
      this.state.hasUpdated = true
      this.display.setMessage(`Sanoma= ${this.message}`)
      this.display.moveToLast()
    }
    else if( keyCodes.length > 0 && this.bouncer.debounced ){

      let keyCode = keyCodes[keyCodes.length -1]
      const shiftKey = ( keyCodes[0]===16||keyCodes[0]===60 ) ? true : false

      if( keyCode >= 65 && keyCode <= 90 ){
        if( shiftKey ) keyCode = this.shiftEnumerator(keyCode)
        this.message += String.fromCharCode(keyCode)
        this.state.hasUpdated = false
        this.bouncer.debounced = false
      }else{
        switch(keyCode){
          case 173:
          case 39:
            if( shiftKey ){
              this.message += ' '
              this.state.hasUpdated = false
              this.bouncer.debounced = false
            }
            break
          case 8:
          case 221:
            if( shiftKey ){
              this.message = ''
            }else{
              this.message = this.message.slice(0,this.message.length-1)
            }
            this.state.hasUpdated = false
            this.bouncer.debounced = false
            break
          case 35:
          case 222:
            this.backToMainmenu()
            break
        }
      }
    }
  }
  messenger(keyCodes,epoch){
    switch(this.state.subview){
      case 'send':
        this.prepareMessageSend(keyCodes)
        break
      case 'invalid':
        this.cannotSend(keyCodes)
        break
      case 'push':
        this.sendMessage(keyCodes,epoch)
        break
      default:
        this.composeMessage(keyCodes)
    }
  }
}