export class ServerComms{
  constructor(){
    const incomingMessage = (event) => {
      console.log(event)
    }
    this.messages = []
    this.socket = new WebSocket('ws://localhost:8080')
    this.socket.onmessage = incomingMessage
    this.frequency = 84.225
  }
  send(message){
    this.socket.onopen = () => {
      this.socket.send(message)
    }
  }
}