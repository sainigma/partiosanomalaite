export class GenericInterface{
  constructor(model, modelGroup, serverComms, audioPlayer, intersecter, mouseListener, hoverObjectNames){
    this.model = model
    this.modelGroup = modelGroup
    this.serverComms = serverComms
    this.audioPlayer = audioPlayer
    this.intersecter = intersecter
    this.mouseListener = mouseListener

    this.state = {
      view:'off',
      subview:'',
      hasUpdated:false,
      previousKey:0,
      previousKeyLength:0
    }

    this.bouncer = {
      debounced: true,
      isWaiting: false,
      waitDuration: 0,
      waitStart: 0,
      mouseDebounced: true
    }

    this.active = false
    this.hoverObjectNames = hoverObjectNames
  }

  getName(){
    return this.name
  }

  toggleActive(){
    this.active = !this.active
    if( this.active ){
      this.activate()
    }else{
      this.deactivate()
    }
  }

  animate(epoch){
    this.animation = lerpAnimation(epoch, this.animation, this.modelGroup)
  }

  update(keyCodes, epoch){
    if( this.active ){
      if( this.animation.isAnimating ){
        this.animate(epoch)
      }
      this.updateWhenActive( this.keyCodesWithMouseActions(keyCodes), epoch )
    }else{
      const firstHover = this.intersecter.getFirstHover()
      if( firstHover ){
        if( this.hoverObjectNames.includes( firstHover.object.parent.name ) ){
          if( this.mouseListener.mouse === 1 ){
            this.toggleActive()
            this.model.setOutline(false)
          }else{
            this.model.setOutline(true)
          }
        }
      }else{
        this.model.setOutline(false)
      }
    }
  }
}