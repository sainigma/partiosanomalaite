export class ServerComms{
  constructor(audioPlayer){
    this.messages = []

    this.settings = {
      frequency: 84.225,
      callsign: '',
      group: '',
      subgroup: '',
      checksum1: '',
      checksum2: '',
    }
    this.success = 0

    this.audioPlayer = audioPlayer
    console.log(audioPlayer)
    this.socket = new WebSocket('ws://localhost:8080')
    this.socket.onmessage = (event) => {this.incomingMessage(event)}
    this.socket.onopen = (transmission) => {
      try{
        this.socket.send(transmission)
      }catch(e){}
      
    }
    this.hasHandshakes = false
    this.hasMessages = false

    
  }

  sendMessage(destination, content, checksum){
    let transmission = {
      type:'transmit',
      destination,
      content,
      checksum
    }
    transmission = JSON.stringify(transmission)
    this.socket.onopen(transmission)
  }

  sendSettings(){
    let transmission = {
      type:'settings',
      frequency:this.settings.frequency,
      callsign:this.settings.callsign,
      group:this.settings.group,
      subgroup:this.settings.subgroup,
      checksum1:this.settings.checksum1,
      checksum2:this.settings.checksum2,
    }
    transmission = JSON.stringify(transmission)
    this.socket.onopen(transmission)
  }

  updateFrequency(frequency){
    if( frequency >= 30 && frequency <= 85.975 ){
      this.settings.frequency = frequency
      this.sendSettings()
      return true
    }else return false
  }

  updateSettings(params){
    this.settings.callsign = params.callsign !== undefined ? params.callsign : this.settings.callsign
    this.settings.group = params.group !== undefined ? params.group : this.settings.group
    this.settings.subgroup = params.subgroup !== undefined ? params.subgroup : this.settings.subgroup
    this.settings.checksum1 = params.checksum1 !== undefined ? params.checksum1 : this.settings.checksum1
    this.settings.checksum2 = params.checksum2 !== undefined ? params.checksum2 : this.settings.checksum2
    console.log(this.settings)
    if( this.settings.callsign !== '' && ( this.settings.checksum1 !== '' || this.settings.checksum2 !== '' ) ){
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

  ack(){
    this.success = 0
  }

  getMessages(){
    const messages = this.messages
    this.messages = []
    this.hasMessages = false
    return messages
  }

  incomingMessage(event){
    try{
      const transmission = JSON.parse(event.data)
      switch(transmission.type){
        case 'handshake':
          this.hasHandshakes = true
          console.log('yk')
          this.audioPlayer.play('yk')
          break
        case 'burst':
          this.audioPlayer.play('burst')
          console.log(transmission)
          console.log('brrrrrr')
          break
        case 'transmitOk':
          this.audioPlayer.play('burst')
          this.success = 200
          break
        case 'message':
          this.audioPlayer.play('burst')
          console.log(transmission)
          if( this.messages.length < 8 ){
            this.messages.push(transmission)
            this.hasMessages = true
          }
          break
      }
    }catch(error){}
  }
}