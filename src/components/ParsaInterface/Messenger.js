export const Messenger = (mix) => class extends mix{
  constructor(){
    super()
    this.message = ''
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

  messenger(keyCodes){
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
            this.state.view = 'mainmenu'
            this.state.hasUpdated = false
            this.bouncer.debounced = false
            break
        }
      }
    }
  }
}