export class ServerComms{
  constructor(){
    this.messages = []

    this.frequency = 84.225
    this.callsign = ''
    this.group = ''
    this.subgroup = ''
    this.checksum1 = ''
    this.checksum2 = ''

    this.socket = new WebSocket('ws://localhost:8080')
    this.socket.onmessage = this.incomingMessage
    this.socket.onopen = (transmission) => {
      this.socket.send(transmission)
    }
    
    this.hasHandshakes = false
    this.hasMessages = false
  }

  sendSettings(){
    let transmission = {
      type:'settings',
      frequency,
      callsign,
      group,
      subgroup,
      checksum1,
      checksum2,
    }
    transmission = JSON.stringify(transmission)
    this.socket.onopen(transmission)
  }

  updateFrequency(frequency){
    if( frequency >= 30 && frequency <= 85.975 ){
      this.frequency = frequency
      this.sendSettings()
      return true
    }else return false
  }

  updateParsaSettings(callsign, group, subgroup, checksum1, checksum2){
    this.callsign = callsign !== '' ? callsign : this.callsign
    this.group = group !== '' ? group : this.group
    this.subgroup = subgroup !== '' ? subgroup : this.subgroup
    this.checksum1 = checksum1 !== '' ? checksum1 : this.checksum1
    this.checksum2 = checksum2 !== '' ? checksum2 : this.checksum2
    if( this.callsign !== '' && ( this.checksum1 !== '' || this.checksum2 !== '' ) ){
      this.sendSettings()
    }
  }

  send(type,message,target){
    let transmission = {
      type,
      message,
      frequency:this.frequency,
      callsign: this.callsign,
      target: target !== undefined ? target : 0
    }
    transmission = JSON.stringify(transmission)
    this.socket.onopen(transmission)
  }

  incomingMessage(event){
    try{
      const transmission = JSON.parse(event.data)
      switch(transmission.type){
        case 'handshake':
          this.hasHandshakes = true
          console.log('yk')
          break
        case 'burst':
          console.log('brrrrrr')
          break
        case 'message':
          this.messages.push(transmission)
          this.hasMessages = true
          console.log(transmission.message)
          break
      }
    }catch(error){}
  }
}