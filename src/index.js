import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let camera,scene,renderer
let display = {
  segments:[]
}

const createDisplay = () => {
  const loader = new GLTFLoader().setPath('models/')
  loader.load('segmentDisplay.gltf', (gltf) => {
    let segmentDisplay = gltf.scene
    for(let i=0; i<16; i++){
      let displayClone = segmentDisplay.clone()
      displayClone.position.set(i*0.05,0,0)
      displayClone.children[i+1].visible = false
      scene.add(displayClone)
      display.segments.push(displayClone)
    }
  })
}


const init = () => {
  let container
  container = document.getElementById('root')

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 3)
  camera.position.x = 0.4
  camera.position.y = 0.5
  camera.lookAt( new THREE.Vector3(0.4,0,0) )

  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer( {alpha: true} )
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  createDisplay()
  //scene.add( display.displays[0] )

  scene.add(camera)
}

const animate = () => {
  requestAnimationFrame(animate)
  update()
}
let once = true
const update = () => {
  const epochSeconds = Date.now()/1E3


  if( display.segments.length > 0 && once ){
    console.log(display)
    once = false
  }
  renderer.render(scene,camera)
}

init()
animate()