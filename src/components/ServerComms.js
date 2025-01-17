import { encryptMessage, decryptMessage } from './../utils/aesWrapper'

export class ServerComms{
  constructor(audioPlayer, wsock){
    this.messages = []

    this.settings = {
      frequency: 30.000,
      callsign: '',
      group: '',
      subgroup: '',
      checksum1: '',
      checksum2: '',
    }
    this.success = 0
    this.power = false

    this.audioPlayer = audioPlayer

    this.wsock = wsock

    this.hasHandshakes = false
    this.hasMessages = false
    this.keys = {
      key1:'',
      key2:''
    }
    this.connect()
  }

  connect(){

    this.socket = new WebSocket(this.wsock)

    this.socket.onmessage = (event) => {this.incomingMessage(event)}

    this.socket.onopen = (transmission) => {
      console.log('connected')
      try{
        this.socket.send(transmission)
      }catch(e){}
    }

    this.socket.onclose = () => {
      setTimeout( ()=>{
        console.log('reconnecting..')
        this.connect()
      },5000  )
    }
  }

  sendMessage(destination, message, checksums, keys){
    if( this.power ){
      const key = keys.key1.length === 32 ? keys.key1 : keys.key2
      const checksum = checksums.key1.length===4?checksums.key1:checksums.key2
      const content = JSON.stringify({
        checksum,
        message
      }) 
  
      const encryptedContent = encryptMessage(content, key)
      let transmission = {
        type:'transmit',
        destination,
        content:encryptedContent,
        checksum
      }
      transmission = JSON.stringify(transmission)
      this.socket.onopen(transmission)
    }
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
    console.log(transmission)
    transmission = JSON.stringify(transmission)
    this.socket.onopen(transmission)
  }

  setPower(power){
    this.power = power
  }

  updateFrequency(frequency){
    if( frequency >= 30 && frequency <= 85.975 ){
      this.settings.frequency = frequency
      this.sendSettings()
      return true
    }else return false
  }

  updateSettings(params){
    this.keys = params.keys !== undefined ? params.keys : this.keys
    this.settings.callsign = params.callsign !== undefined ? params.callsign : this.settings.callsign
    this.settings.group = params.group !== undefined ? params.group : this.settings.group
    this.settings.subgroup = params.subgroup !== undefined ? params.subgroup : this.settings.subgroup
    this.settings.checksum1 = params.checksum1 !== undefined ? params.checksum1 : this.settings.checksum1
    this.settings.checksum2 = params.checksum2 !== undefined ? params.checksum2 : this.settings.checksum2
    
    if( this.settings.callsign !== '' && ( this.settings.checksum1 !== '' || this.settings.checksum2 !== '' ) ){
      this.sendSettings()
    }
  }

  send(type,message,target){
    let transmission = {
      type,
      message,
      frequency:this.settings.frequency,
      callsign: this.settings.callsign,
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

  incomingMessage(event) {
    if (this.power) {
      try {
        let transmission = JSON.parse(event.data)
        switch (transmission.type) {
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
            if (this.messages.length < 8) {
              transmission.time = Date.now()
              console.log(transmission)
              const decryptedContent = decryptMessage(transmission.content, this.keys.key1)
              if (decryptedContent !== undefined) {
                transmission.content = decryptedContent
                this.messages.push(transmission)
                this.hasMessages = true
              }
            }
            break
        }
      } catch (error) { }
    }
  }
}