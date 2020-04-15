import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class MapBook {

  constructor(owner){
    this.outlineIndex
    
    this.animation = {
      isAnimating: false,
      startTime: -1,
      duration: 0.75,
      direction:true
    }
    this.isAnimating = false

    const path = 'textures/karttatasku/2048/'

    this.baseTexture
    this.pages

    this.noteBookMaterial
    this.noteBookSurface
    this.pageSurface

    this.initialPosition = new THREE.Vector3(-2.3, 0, -1.5)
    this.karttatasku
    this.loadModel(owner)
  }

  loadModel(owner){
    let loader = new GLTFLoader().setPath('models/')
    loader.load('karttatasku.gltf', (gltf) => {
      let karttatasku = gltf.scene

      karttatasku.children.forEach( (child,index) => {
        if( child.name === 'karttataskuOutline' ){
          this.outlineIndex = index
          child.visible = false
        }
      })
      karttatasku.scale.set(10,10,10)
      karttatasku.name = 'karttatasku'
      
      karttatasku.position.set(this.initialPosition.x, this.initialPosition.y, this.initialPosition.z)
      karttatasku.rotation.set(0,6.28*0.05,0)
      this.karttatasku = karttatasku
      owner.add(karttatasku)
    })
  }

  getInitialPosition(){
    return this.initialPosition.clone()
  }

  setOutline(state){
    if( this.karttatasku !== undefined ){
      this.karttatasku.children[this.outlineIndex].visible = state
    }
  }
}