export class RadioInterface{
  constructor(radio, serverComms, audioPlayer, intersecter, mouseListener){
    this.radio = radio
    this.serverComms = serverComms
    this.audioPlayer = audioPlayer
    this.intersecter = intersecter
    this.mouseListener = mouseListener
  }
}