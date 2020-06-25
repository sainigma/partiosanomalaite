export const Messenger = (mix) => class extends mix{
  constructor(){
    super()
    this.message = ''
    this.destination = ''
    this.transmissionStart = 0
    this.success = 0
    this.inboxselection = 0
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
          this.serverComms.sendMessage(this.destination, this.message, this.checksums, this.keys )
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

  readMessage(keyCodes, resetIndex){
    if( !this.state.hasUpdated ){
      this.state.hasUpdated = true
      const content = this.messages[this.inboxselection].content
      if( content.length <= 16 ){
        this.display.setMessage( content )
      }else{
        this.display.setScrollingMessage( content, Date.now()/1E3 )
      }
      
      if( this.inboxselection === this.messages.length -1 ){
        this.newMessages = false
      }
    }else{
      if( keyCodes.length > 0 && this.bouncer.debounced ){
        const lastKey = keyCodes[keyCodes.length-1]
        const shifted = keyCodes[0] === 16 || keyCodes[0] === 60 ? true : false
        if( shifted ){
          switch( lastKey ){
            case 87:
              console.log('kopioi')
              this.message = this.messages[this.inboxselection].content
              this.state.view = 'message'
              this.state.hasUpdated = false
              this.bouncer.debounced = false
              break
            case 8:
            case 221:
              this.state.subprevious = this.state.subview
              this.state.subview = 'delete'
              this.state.hasUpdated = false
              this.bouncer.debounced = false
              break
          }

        }else{
          switch(lastKey){
            case 35:
            case 222:
              this.bouncer.debounced = false
              this.state.subview = ''
              this.state.hasUpdated = false
              if( resetIndex ) this.inboxselection = -1
          }
        }
      }
    }
  }

  deleteMessage(keyCodes){
    if( !this.state.hasUpdated ){
      this.state.hasUpdated = true
      this.display.setMessage(`Viesti ${this.inboxselection+1}   Pois?`)
    }else if( this.bouncer.debounced ){
      this.bouncer.debounced = false
      const lastKey = keyCodes[keyCodes.length - 1]
      switch( lastKey ){
        case 13:
        case 192:
          this.messages = this.messages.filter( (s,i) => { return i !== this.inboxselection } )
          this.inboxselection = -1
          this.state.subview = ''
          this.state.subprevious = ''
          this.state.hasUpdated = false
          break
        case 35:
        case 222:
          this.state.subview = this.state.subprevious
          this.state.subprevious = ''
          this.state.hasUpdated = false
          break
      }
    }
  }

  changeInboxSelection(value){
    this.state.hasUpdated = false
    if( this.messages.length > 1 ){
      this.inboxselection += value
      if( this.inboxselection > (this.messages.length -1) ) this.inboxselection = 0
      else if( this.inboxselection < 0 ) this.inboxselection = this.messages.length - 1
    }else if( this.messages.length === 1){
      this.inboxselection = 0
    }else this.inboxselection = -1
  }

  inbox(keyCodes){
    switch(this.state.subview){
      case 'read':
        this.readMessage(keyCodes,false)
        break
      case 'delete':
        this.deleteMessage(keyCodes)
        break
      default:
        this.inboxMenu(keyCodes)
    }
  }

  inboxMenu(keyCodes) {
    if (!this.state.hasUpdated) {
      this.state.hasUpdated = true
      if (this.inboxselection === -1) {
        switch (this.messages.length) {
          case 0:
            this.display.setMessage('Ei viestejä')
            break
          case 1:
            this.display.setMessage('Valitse Vst= 1')
            break
          default:
            this.display.setMessage(`Valitse Vst= 1-${this.messages.length}`)
        }
      } else {
        const pad = (input) => { return input < 10 ? `0${input}` : input }
        const msgDate = new Date(this.messages[this.inboxselection].time+this.time)
        const msgTime = `${pad(msgDate.getHours())}${pad(msgDate.getMinutes())}`
        this.display.setMessage(`${this.inboxselection + 1}=${msgTime}   Läh=${this.messages[this.inboxselection].sender}`)
      }
    } else if (keyCodes.length > 0 && this.bouncer.debounced) {
      this.bouncer.debounced = false
      const lastKey = keyCodes[keyCodes.length - 1]
      const shifted = keyCodes[0] === 16 || keyCodes[0] === 60 ? true : false
      if (shifted) {
        if (this.inboxselection === -1) {
          const shiftedKey = this.topRowToNumeric(lastKey) - 49
          if (shiftedKey >= 0 && shiftedKey < this.messages.length) {
            this.inboxselection = shiftedKey
            this.state.hasUpdated = false
          }
        } else {
          switch (lastKey) {
            case 8:
            case 221:
              this.state.subprevious = this.state.subview
              this.state.subview = 'delete'
              this.state.hasUpdated = false
              break
            case 87:
              this.message = this.messages[this.inboxselection].content
              this.state.view = 'message'
              this.state.hasUpdated = false
              break
          }
        }
      } else {
        switch (lastKey) {
          case 13:
          case 192:
            if (this.inboxselection !== -1) {
              this.state.subview = 'read'
              this.state.hasUpdated = false
            }
            break
          case 37:
          case 188:
            this.changeInboxSelection(-1)
            break
          case 39:
          case 173:
            this.changeInboxSelection(1)
            break
          case 35:
          case 222:
            if (this.inboxselection === -1) {
              this.backToMainmenu()
            } else {
              this.inboxselection = -1
              this.state.hasUpdated = false
            }

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