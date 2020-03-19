import * as THREE from 'three'
import { SegmentDisplay } from './components/SegmentDisplay'

let camera,scene,renderer
let segmentDisplay

const init = () => {
  let container
  container = document.getElementById('root')

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 3)
  camera.position.x = 0.4
  camera.position.y = 0.5
  camera.lookAt( new THREE.Vector3(0.4,0,0) )

  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer( {alpha: false} )
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  segmentDisplay = new SegmentDisplay(16,scene)
  
  scene.add(camera)
}

const animate = () => {
  requestAnimationFrame(animate)
  update()
}
let asd = Date.now()/1E3
const update = () => {
  const epochSeconds = Date.now()/1E3
  if( epochSeconds - asd > 0.1 ){
    asd = epochSeconds
    segmentDisplay.update(1)
  }

  renderer.render(scene,camera)
}

init()
animate()