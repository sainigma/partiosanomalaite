export const generalConfig = (mix) => class extends mix{

  constructor(){
    super()
    this.settings = {
      index:0,
      callsign:'',
      subgroup:'',
      group:'',
      ack:true,
      speed:2,
      boost:false
    }
  }

  codeSetter(code,letter){
    let result
    switch( 4 - code.split('_').length ){
      case 2:
        result = code.slice(0,2) + String.fromCharCode(letter)
        break
      case 1:
        result = code.slice(0,1) + String.fromCharCode(letter) + '_'
        break
      default:
        result = String.fromCharCode(letter) + '__'
    }
    console.log( result )
    return result
  }

  codeEraser(code){
    let result
    switch( code.split('_').length ){
      case 1:
        result = code.slice(0,2) + '_'
        break
      case 2:
        result = code.slice(0,1) + '__'
        break
      default:
        result = '___'
    }
    return result
  }

  groupConfiguration(keyCodes){
    if( !this.state.hasUpdated ){
      this.settings.group = this.settings.group !== '' ? this.settings.group : '___'
      this.settings.subgroup = this.settings.subgroup !== '' ? this.settings.subgroup : '___'
      if( this.settings.group.split('_').length === 1 ){
        this.display.setMessage(`ok?      ${this.settings.subgroup} ${this.settings.group}`)
      }else this.display.setMessage(`         ${this.settings.subgroup} ${this.settings.group}`)
      this.state.hasUpdated = true
    }else if( keyCodes.length > 0 && this.bouncer.debounced ){
      this.bouncer.debounced = false
      const keyCode = keyCodes[keyCodes.length-1]
      if( keyCode > 64 && keyCode < 91 ){
        this.state.hasUpdated = false
        if( this.settings.subgroup.split('_').length !== 1 ){
          this.settings.subgroup = this.codeSetter(this.settings.subgroup, keyCode)
        }else this.settings.group = this.codeSetter(this.settings.group, keyCode)
      }else{
        switch( keyCode ){
          case 8:
          case 221:
            this.state.hasUpdated = false
            if( this.settings.group.split('_').length === 4 ){
              this.settings.subgroup = this.codeEraser(this.settings.subgroup)
            }else this.settings.group = this.codeEraser(this.settings.group)
            break
          case 13:
          case 192:
            if( this.settings.subgroup.split('_').length === 1 ){
              this.state.hasUpdated = false
              this.state.subview = ''
            }
            break
          case 35:
          case 222:
            this.state.hasUpdated = false
            this.state.subview = ''
            this.settings.group = ''
            this.settings.subgroup = ''
            break
        }
      }
    }
  }

  callsignConfiguration(keyCodes){
    if( !this.state.hasUpdated ){
      this.settings.callsign = this.settings.callsign !== '' ? this.settings.callsign : '___'
      if( this.settings.callsign.split('_').length === 1 ){
        this.display.setMessage(`ok?          ${ this.settings.callsign }`)
      }else this.display.setMessage(`             ${ this.settings.callsign }`)
      this.state.hasUpdated = true

    }else if( keyCodes.length > 0 && this.bouncer.debounced ){
      this.bouncer.debounced = false
      const keyCode = keyCodes[keyCodes.length-1]
      if( keyCode > 64 && keyCode < 91 ){
        this.settings.callsign = this.codeSetter(this.settings.callsign, keyCode)
        this.state.hasUpdated = false
      }else{
        switch( keyCode ){
          case 8:
          case 221:
            this.settings.callsign = this.codeEraser(this.settings.callsign)
            this.state.hasUpdated = false
            break
          case 13:
          case 192:
            if( this.settings.callsign.split('_').length === 1 ){
              this.state.hasUpdated = false
              this.state.subview = ''
            }
            break
          case 35:
          case 222:
            this.state.hasUpdated = false
            this.state.subview = ''
            this.settings.callsign = ''
            break
        }
      }
    }
  }

  configuration(keyCodes){
    if( this.state.subview !== '' ){
      switch( this.state.subview ){
        case 'callsign':
          this.callsignConfiguration(keyCodes)
          break
        case 'groups':
          this.groupConfiguration(keyCodes)
          break
      }
    }else this.configurationMenu(keyCodes)
  }

  configurationMenu(keyCodes){
    const setCallsign = () => {
      this.state.subview = 'callsign'
      this.settings.callsign = ''
      this.state.hasUpdated = false
    }

    const setGroups = () => {
      this.state.subview = 'groups'
      this.settings.group = ''
      this.settings.subgroup = ''
      this.state.hasUpdated = false
    }

    const toggleAck = () => {
      this.settings.ack = !this.settings.ack
    }

    const incrementSpeed = () => {
      let speed = this.settings.speed + 1
      if( speed > 2 ) speed = 0
      this.settings.speed = speed
    }

    const toggleBoost = () => {
      this.settings.boost = !this.settings.boost
    }

    const executeConfigAction = (i) => {
      this.settings.index = i
      this.bouncer.debounced = false
      switch(i){
        case 0:
          setCallsign()
          break
        case 1:
          setGroups()
          break
        case 2:
          toggleAck()
          break
        case 3:
          incrementSpeed()
          break
        case 4:
          toggleBoost()
          break
      }
      this.state.hasUpdated = false
    }

    const submenus = [
      `Tunnus       ${ this.settings.callsign ? this.settings.callsign : '  ?' }`,
      `Ryhmät   ${ this.settings.subgroup ? this.settings.subgroup : '  ?' } ${ this.settings.group ? this.settings.group : '  ?' }`,
      `Kuitt   ${ this.settings.ack ? '   autom' : 'ei autom' }`,
      `Lähtnop   ${ this.settings.speed === 0 ? ' 600bd' : this.settings.speed === 1 ? '1200bd' : '2400bd' }`,
      `${this.settings.boost ? 'Suuri taso' : 'Pieni taso'}`,
    ]

    if( !this.state.hasUpdated ){
      this.display.setMessage(submenus[this.settings.index])
      this.state.hasUpdated = true
    }else{
      if( this.bouncer.debounced ){
        const currentMessage =this.display.getMessage()
        let index = submenus.indexOf(currentMessage)
        const keyCode = keyCodes[keyCodes.length-1]
        switch( keyCode ){
          case 173:
          case 39:
            index++
            if( index >= submenus.length ) index = 0
            this.display.setMessage( submenus[index] )
            this.bouncer.debounced = false
            break
          case 188:
          case 37:
            index--
            if( index < 0 ) index = submenus.length -1
            this.display.setMessage( submenus[index] )
            this.bouncer.debounced = false
            break
          case 35:
          case 222:
            this.settings.index = 0
            this.state.view = 'mainmenu'
            this.state.hasUpdated = false
            break
          case 13:
          case 192:
            executeConfigAction(index)
            break
        }
      }
    }
  }
}