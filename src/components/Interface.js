export class Interface {
  constructor(display){
    this.version = 'V 20200320A'

    let date = new Date()

    this.state = {
      view:'off',
      input:'',
      hasUpdated:false
    }
    this.settings = {
      time:0,
      callsign:'LBA',
      subgroup:'LAA',
      group:'AAA',
      ack:true,
      speed:600,
      power:0
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
        case waitDuration > 10:
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
  setTime(keyCodes){
    const baseMessage = 'AIKA ?      '
    if( !this.state.hasUpdated ){
      this.state.input = '____'
      this.display.setMessage(baseMessage+'____')
      this.state.hasUpdated = true
    }else{
        if( this.bouncer.debounced ){
          if( keyCodes.length === 2 && ( keyCodes[0] === 16 || keyCodes[0] === 60 )){
            this.bouncer.debounced = false
            let digit
            switch( keyCodes[1] ){
              case 81:
                digit = 1
                break
              case 87:
                digit = 2
                break
              case 69:
                digit = 3
                break
              case 82:
                digit = 4
                break
              case 84:
                digit = 5
                break
              case 89:
                digit = 6
                break
              case 85:
                digit = 7
                break
              case 73:
                digit = 8
                break
              case 79:
                digit = 9
                break
              case 80:
                digit = 0
                break
            }
            if( isNaN( parseInt(this.state.input) ) ){
              if( digit < 3 ){
                const newInput = digit+'___'
                this.state.input = newInput
                this.display.setMessage(baseMessage+newInput)
              }
            }else{
              let currentInput = this.state.input
              currentInput = currentInput.replace(/_/g,'')
              switch( currentInput.length ){
                case 1:
                  if( parseInt(currentInput)*10 + digit < 24 ){
                    let newInput = currentInput + digit + '__'
                    this.state.input = newInput
                    this.display.setMessage(baseMessage+newInput)
                  }
                  break
                case 2:
                  if( digit < 6 ){
                    let newInput = currentInput + digit + '_'
                    this.state.input = newInput
                    this.display.setMessage(baseMessage+newInput)
                  }
                  break
                case 3:
                  let newInput = currentInput + digit
                  this.state.input = newInput
                  this.display.setMessage('AIKA ok?    '+newInput)
                default:
                  console.log( currentInput )
              }
            }
          }else if( keyCodes[0] === 35 || keyCodes[0] === 222){
            this.state.input = '____'
            this.display.setMessage(baseMessage+'____')
            this.bouncer.debounced = false
          }else if( keyCodes[0] === 8 || keyCodes[0] === 221 ){
            let currentInput = this.state.input
            currentInput = currentInput.replace(/_/g,'')
            let newInput = currentInput.slice(0,currentInput.length-1)
            console.log(newInput)
            switch( newInput.length ){
              case 0:
                newInput += '____'
                break
              case 1:
                newInput += '___'
                break
              case 2:
                newInput += '_'
              case 3:
                newInput += '_'
                break
            }
            this.state.input = newInput
            this.display.setMessage(baseMessage+newInput)
            this.bouncer.debounced = false
          }else if( keyCodes[0] === 13 || keyCodes[0] === 222 ){
            let currentInput = this.state.input
            currentInput = currentInput.replace(/_/g,'')
            if( currentInput.length === 4 ){
              //tallenna aika
              this.state.view = 'mainmenu'
              this.state.hasUpdated = false
            }
          }
        }else if( keyCodes.length === 0 || (keyCodes.length === 1 && (keyCodes[0] === 16 || keyCodes[0] === 60)) ){
          this.bouncer.debounced = true
          console.log( "debounced" )
        }
    }
  }
  mainmenu(keyCodes){
    if( !this.state.hasUpdated ){
      this.display.setMessage('TOIMINTA       ?')
      this.state.hasUpdated = true
    }else{
      if( keyCodes.length === 2 && ( keyCodes[0] === 16 || keyCodes[0] === 60 ) ){

      }else if( keyCodes[0] >= 65 && keyCodes[0] <= 90 ){
        switch( keyCodes[0] ){
          case 82:
            this.state.hasUpdated = false
            this.state.view = 'config'
            break
        }
      }
    }
  }
  configuration(keyCodes){
    const submenus = [
      `Tunnus       ${ this.settings.callsign ? this.settings.callsign : '  ?' }`,
      `Ryhmät   ${ this.settings.subgroup ? this.settings.subgroup : '  ?' },${ this.settings.group ? this.settings.group : ' ?' }`,
      `Kuitt   ${ this.settings.ack ? '   autom' : 'ei autom' }`,
      'Lähtnop    600bd',
      'Pieni taso',
    ]
    if( !this.state.hasUpdated ){
      this.display.setMessage(submenus[0])
      this.state.hasUpdated = true
    }else{
      if( this.bouncer.debounced ){
        const currentMessage =this.display.getMessage()
        let index = submenus.indexOf(currentMessage)
        switch( keyCodes[0] ){
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
            this.state.view = 'mainmenu'
            this.state.hasUpdated = false
            break
        }
      }
    }
  }

  update(keyCodes, epoch){
    if( keyCodes.length > 0 || !this.state.hasUpdated ){
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
      }
    }else{
      this.bouncer.debounced = true
    }
  }
}