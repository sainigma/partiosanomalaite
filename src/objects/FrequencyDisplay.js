import * as THREE from 'three'

export class FrequencyDisplay {
  constructor(){
    this.displayGroup = new THREE.Group()
    this.value = ''
    this.active = true
  }
  enumerator(value){
    switch(value){
      case '0':
        return ['UL','UM','UR','DL','DM','DR']
      case '1':
        return ['UR','DR']
      case '2':
        return ['UM','UR','MM','DL','DM']
      case '3':
        return ['UM','UR','MM','DM','DR']
      case '4':
        return ['UL','UR','MM','DR']
      case '5':
        return ['UM','UL','MM','DR','DM']
      case '6':
        return ['UM','UL','MM','DR','DM','DL']
      case '7':
        return ['UM','UR','DR']
      case '8':
        return ['UL','UM','UR','MM','DL','DM','DR']
      case '9':
        return ['DM','DR','UR','UM','UL','MM']
      default:
        return ['MM']
    }
      
    
  }
  createDisplay(singleDisplay, owner){
    singleDisplay.name = 'display'
    singleDisplay.index = 0
    this.displayGroup.add(singleDisplay)
    for( let i=1; i<5; i++ ){
      const newDisplay = singleDisplay.clone()
      newDisplay.name +=i
      newDisplay.index = i
      newDisplay.position.x = newDisplay.position.x+0.0091*i
      this.displayGroup.add(newDisplay)
    }
    singleDisplay.name+=0
    owner.add( this.displayGroup )
    this.changeFrequency(3)
  }
  setCharacter(singleDisplay, value){
    const activeSegments = this.enumerator(value)
    singleDisplay.children.forEach( child => {
      if( child.shorthand === undefined ){
        const splitter = child.name.split('segmentti')
        child.shorthand = splitter[1]
      }
      child.visible = activeSegments.includes( child.shorthand )
    })
  }
  setDisplay(){
    this.displayGroup.children.forEach( singleDisplay => {
      this.setCharacter( singleDisplay, this.value[singleDisplay.index] )
    })
  }
  changeFrequency(newFrequency){
    const zeros = '00000'
    let tempFrequency = `${newFrequency}`
    this.value = tempFrequency+zeros.slice(0,5-tempFrequency.length)
    this.setDisplay()
  }
  setActive(isActive){
    this.displayGroup.visible = isActive
    this.active = isActive
  }
}