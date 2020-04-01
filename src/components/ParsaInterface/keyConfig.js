export const keyConfig = (mix) => class extends mix{

  constructor(){
    super()
    this.keys = {
      key1:'',
      key2:'',
      firstActive:true
    }
    this.checksums = {
      key1:'',
      key2:''
    }
  }

  topRowToNumeric(keyCode){
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
      80:48
    }
    if( enumerator[keyCode] !== undefined ) return enumerator[keyCode]
    else return keyCode
  }

  setKeys(keyCodes) {
    let key = this.keys.firstActive ? this.keys.key1 : this.keys.key2
    const keysLength = key.replace(/ /g, '').length
    console.log(keysLength)
    if (!this.state.hasUpdated) {
      this.state.hasUpdated = true
      if (keysLength < 32) {
        this.display.setMessage(`Avain${this.keys.firstActive ? 1 : 2}=${key}`)
        this.display.moveToLast()
      } else {
        if (this.keys.firstActive) {
          this.checksums.key1 = 'KEY1'
        } else this.checksums.key2 = 'KEY2'
        const keyChecksum = this.keys.firstActive ? this.checksums.key1 : this.checksums.key2
        this.display.setMessage(`${key}= ${keyChecksum} ok?`)
        this.display.moveToLast()
      }
    } else if (keyCodes.length > 0 && this.bouncer.debounced) {

      let keyCode = keyCodes[keyCodes.length - 1]
      const shiftKey = ( keyCodes[0]===16||keyCodes[0]===60 ) ? true : false
      if( keyCode > 64 && keyCode < 91 && keysLength < 32 ){
        if( shiftKey ){
          keyCode = this.topRowToNumeric(keyCode)
        }
        this.state.hasUpdated = false
        this.bouncer.debounced = false

        if (key.length === 0 || key.length % 5 === 0) {
          key += ' '
        }
        key += String.fromCharCode(keyCode)
        if (this.keys.firstActive) {
          this.keys.key1 = key
        } else this.keys.key2 = key
      }else{
        switch(keyCode){
          case 8:
          case 221:
            key = key.slice(0, key.length - 1)
            if (key[key.length - 1] === ' ') key = key.slice(0, key.length - 1)
            this.state.hasUpdated = false
            this.bouncer.debounced = false
            if (this.keys.firstActive) {
              this.keys.key1 = key
            } else this.keys.key2 = key
            break
          case 13:
          case 192:
            if( keysLength === 32 ){
              if (this.keys.firstActive) {
                this.keys.key1 = key.replace(/ /g, '')
              } else {
                this.keys.key2 = key.replace(/ /g, '')
              }
              this.state.subview = ''
              this.state.hasUpdated = false
              this.bouncer.debounced = false
            }
            break
          case 35:
          case 222:
            this.bouncer.debounced = false
            this.state.hasUpdated = false
            this.state.subview = ''
            if( this.keys.firstActive ){
              this.keys.key1 = ''
              this.checksums.key1 = ''
            }else{
              this.keys.key2 = ''
              this.checksums.key2 = ''
            }
        }
      }
    }
  }

  viewKeys(keyCodes){
    if( !this.state.hasUpdated ){
      this.state.hasUpdated = true
      if( this.keys.key1 === '' && this.keys.key2 === '' ){
        this.display.setMessage("Ei avaimia")
      }else{
        const key1 = this.keys.key1 !== '' ? `Avain1      ${this.checksums.key1}` : 'Ei avainta'
        const key2 = this.keys.key2 !== '' ? `Avain2      ${this.checksums.key2}` : 'Ei avainta'
        this.display.setMessage(`${key1} ${key2}`)
        if( this.keys.firstActive ){
          this.display.setMessage(key1)
        } else this.display.setMessage(key2)
      }
    }else if(this.bouncer.debounced){
      if( keyCodes.length > 1 ){
        if( (keyCodes[0] === 16 || keyCodes[0] === 60) && keyCodes[1] === 69 ){
          this.bouncer.debounced = false
          this.state.hasUpdated = false
          this.state.subview = 'new'
        }
      }else if( keyCodes.length === 1 ){
        switch(keyCodes[0]){
          case 173:
          case 188:
          case 37:
          case 39:
            this.bouncer.debounced = false
            this.state.hasUpdated = false
            this.keys.firstActive = !this.keys.firstActive
            break
          case 35:
          case 221:
            this.bouncer.debounced = false
            this.state.hasUpdated = false
            this.keys.firstActive = true
            this.state.view = 'mainmenu'
            break
        }
      }
    }
  }

  keyConfigurator(keyCodes){
    if( this.state.subview === 'new' ){
      this.setKeys(keyCodes)
    }else{
      this.viewKeys(keyCodes)
    }
  }
}