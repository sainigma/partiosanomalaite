import * as THREE from 'three'
import { SegmentDisplay } from './components/SegmentDisplay'
import { Parsa } from './components/Parsa'
import { EnviroSphere } from './components/EnviroSphere'

let camera,scene,renderer
let sceneObjects,allObjects
let segmentDisplay,parsa,enviroSphere

const init = () => {
  let container
  container = document.getElementById('root')

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 50)
  camera.position.y = 1
  camera.position.x = -1
  camera.position.z = 1
  camera.lookAt( new THREE.Vector3(0,0,0) )

  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer( {alpha: false, antialias: true} )
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;



  container.appendChild(renderer.domElement)

  

  enviroSphere = new EnviroSphere(scene,renderer)


  sceneObjects = new THREE.Group()
  allObjects = new THREE.Group()
  parsa = new Parsa(sceneObjects)
  const segmentInitialPosition = new THREE.Vector3(-0.38,0.42,-0.3)
  segmentDisplay = new SegmentDisplay(16,sceneObjects,segmentInitialPosition)
  sceneObjects.rotateOnWorldAxis(new THREE.Vector3(1,0,0),3.141/6)
  allObjects.add(sceneObjects)
  allObjects.add(camera)

  scene.add(allObjects)
  //scene.add(sceneObjects)
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
  allObjects.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-0.01)
  renderer.render(scene,camera)
}

init()
animate()