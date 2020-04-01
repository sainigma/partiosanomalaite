export const timeConfig = (mix) => class extends mix{

  constructor(){
    super()
    this.time = 0
  }
  setTime(keyCodes){
    const baseMessage = 'AIKA ?      '
    if( !this.state.hasUpdated ){
      if( this.time === 0 ){
        this.state.input = '____'
      }else{
        const pad = (input) => { return input < 10 ? `0${input}` : input }
        const initialTime = new Date( Date.now() + this.time )
        this.state.input = `${pad( initialTime.getHours() )}${pad( initialTime.getMinutes() )}`
      }
      
      this.display.setMessage(baseMessage+this.state.input)
      this.state.hasUpdated = true
    }else{
        if( this.bouncer.debounced ){
          if( keyCodes.length > 1 && ( keyCodes[0] === 16 || keyCodes[0] === 60 )){
            this.bouncer.debounced = false
            let digit
            const shiftEnum = [ 80, 81, 87, 69, 82, 84, 89, 85, 73, 79 ]
            digit = shiftEnum.indexOf( keyCodes[keyCodes.length-1] )
            if( digit !== -1 ){
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
                    break
                }
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
              const hours = currentInput.slice(0,2)
              const minutes = currentInput.slice(2,4)
              let tempDate = new Date()
              tempDate.setHours(hours,minutes,0)
              this.time = tempDate.getTime() - Date.now()
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
}