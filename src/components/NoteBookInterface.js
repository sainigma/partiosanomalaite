import { GenericInterface } from "./GenericInterface"

export class NoteBookInterface extends GenericInterface{
  constructor(noteBook, audioPlayer, intersecter, mouseListener, dollyGrip, setActiveInterface){
    super(noteBook, noteBook, undefined, audioPlayer, intersecter, mouseListener, ['vihko', 'sivu', 'vihkoOutline'])
    this.noteBook = noteBook
    this.name = 'notebook'
    this.dollyGrip = dollyGrip
    this.dollyTransitionTime = 0.34
    this.noteBookGroup = noteBookGroup
    this.setActiveInterface = setActiveInterface
    this.animation = {
      isAnimating:false
    }
  }
}