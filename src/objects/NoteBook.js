import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { loadTexture } from './../utils/gltfUtils'

export class NoteBook {

  constructor(owner, mapBook, camera){
    this.outlineIndex
    this.noteBookIndex
    this.pageIndex

    this.manager = new THREE.LoadingManager()
    this.notebookDiv = document.createElement('div')
    document.getElementById('debug').appendChild(this.notebookDiv)
    this.manager.onStart = () => {
      this.notebookDiv.appendChild(document.createTextNode('Loading notebook..'))
    }
    this.manager.onProgress = () => {
      this.notebookDiv.appendChild(document.createTextNode('.'))
    }
    this.manager.onLoad = () => {
      this.notebookDiv.appendChild(document.createTextNode('complete'))
    }

    this.mapBook = mapBook
    this.camera = camera

    this.selectedPage = 0
    this.pagesLength = 8
    this.animation = {
      isAnimating: false,
      startTime: -1,
      duration: 0.75,
      direction:true
    }
    this.isAnimating = false

    const path = 'textures/vihko/1024/'

    this.baseTexture
    this.pages

    this.noteBookMaterial
    this.noteBookSurface
    this.pageSurface

    this.baseTexture = loadTexture('vihko','png',path,this.notebookDiv)
    this.pages = this.loadPages('text_','png',path,this.pagesLength)
    console.log( this.pages )
    this.loadModel(owner)

    this.initialPosition = new THREE.Vector3(0.02,0.12,-0.7)
    this.intiialRotation = new THREE.Vector3(0,6.28*0.06,0.1)
  }

  loadPages(name, filetype, path, pagesLength){
    const pad = (value) => {
      return ("0"+value).slice(-2)
    }

    let pages = []
    for(let i=0; i<pagesLength; i++){
      const trueName = `${name}${pad(i+1)}`
      pages.push( loadTexture(trueName, filetype, path, this.notebookDiv) )
    }
    return pages
  }

  loadModel(owner){

    const findMaterialFromChildren = (children, name) => {
      let result
      children.forEach( child => {
        if( child.material.name === name ) result = child.material
      })
      return result
    }

    let loader = new GLTFLoader(this.manager).setPath('models/')
    loader.load('vihko.gltf', (gltf) => {
      let vihko = gltf.scene

      vihko.children.forEach( (child,index) => {
        if( child.name === 'vihkoOutline' ){
          this.outlineIndex = index
          child.visible = false
        }else if( child.name === 'sivu' ){
          this.pageIndex = index
          child.visible = false
        }else{
          this.noteBookIndex = index
          child.visible = true
        }
      })
      this.noteBookMaterial = findMaterialFromChildren( vihko.children[this.noteBookIndex].children, 'vihko' )
      this.noteBookMaterial.map = this.baseTexture

      this.pageSurface = findMaterialFromChildren( vihko.children[this.pageIndex].children, 'projektioPinta' )
      this.pageSurface.transparent = true
      this.pageSurface.map = this.pages[0]

      this.noteBookSurface = findMaterialFromChildren( vihko.children[this.noteBookIndex].children, 'vihkoProjektiopinta' )
      this.noteBookSurface.map = this.pages[0]
      this.noteBookSurface.transparent = true

      this.page = vihko.children[this.pageIndex]
      vihko.scale.set(10,10,10)
      vihko.name = 'vihko'
      const mapBookPosition = this.mapBook.getInitialPosition()
      vihko.position.set(
        mapBookPosition.x+this.initialPosition.x,
        mapBookPosition.y+this.initialPosition.y,
        mapBookPosition.z+this.initialPosition.z
      )
      vihko.rotation.set(this.intiialRotation.x,this.intiialRotation.y,this.intiialRotation.z)
      this.vihko = vihko
      owner.add(vihko)
    })
  }

  lerpPageRotation(value){
    if( this.vihko !== undefined ){
      const startRotation = new THREE.Vector2(-3.141*0.05,0)
      const endRotation = new THREE.Vector2(-3.141*1.95,0)
      const currentRotation = startRotation.lerp(endRotation,value)
      this.vihko.children[this.pageIndex].rotation.x = currentRotation.x
    }
  }

  setOutline(state){
    if( this.vihko !== undefined ){
      this.vihko.children[this.outlineIndex].visible = state
    }
  }

  getPage(){
    return this.selectedPage
  }

  changePage(direction){
    if( this.vihko !== undefined ){
      if( this.animation.isAnimating === false ){
        this.animation.direction = direction
 
        if( direction ){
          if( this.selectedPage+1 < this.pagesLength ){
            this.animation.isAnimating = true
            this.pageSurface.map = this.pages[this.selectedPage]
            this.selectedPage++
            this.noteBookSurface.map = this.pages[this.selectedPage]
          }
        }else{
          if( this.selectedPage-1 >= 0 ){
            this.animation.isAnimating = true
            this.noteBookSurface.map = this.pages[this.selectedPage]
            this.selectedPage--
            this.pageSurface.map = this.pages[this.selectedPage]
          }

        }
        return true
      }
    }
    return false
  }
  animate(epoch){
    if( this.animation.isAnimating ){
      if( this.animation.startTime === -1 ){
        this.animation.startTime = epoch
        this.vihko.children[this.pageIndex].visible = true
      }
      let lerpValue = (epoch-this.animation.startTime)/this.animation.duration
      if( !this.animation.direction ) lerpValue = 1 - lerpValue
      if( lerpValue > 1 ) lerpValue = 1
      if( lerpValue < 0 ) lerpValue = 0
      this.lerpPageRotation(lerpValue)
      if( ( lerpValue === 1 && this.animation.direction === true ) || ( lerpValue === 0 && this.animation.direction === false ) ){
        this.animation.isAnimating = false
        this.animation.startTime = -1
        this.noteBookSurface.map = this.pages[this.selectedPage]
        this.vihko.children[this.pageIndex].visible = false
      }
    }
  }
}