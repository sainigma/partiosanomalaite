import * as THREE from 'three'
import { SegmentDisplay } from './objects/SegmentDisplay'
import { Parsa } from './objects/Parsa'
import { Keyboard } from './objects/Keyboard'
import { EnviroSphere } from './objects/EnviroSphere'
import { KeyListener } from './components/KeyListener'
import './styles.css'

let camera,scene,renderer
let sceneObjects,allObjects
let segmentDisplay,parsa,enviroSphere,keyboard
let keyListener

const init = () => {
  let container
  container = document.getElementById('root')

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 50)
  camera.position.y = 1.4
  camera.position.x = 0
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
  keyboard = new Keyboard(sceneObjects)
  sceneObjects.rotateOnWorldAxis(new THREE.Vector3(1,0,0),3.141/6)
  allObjects.add(sceneObjects)
  allObjects.add(camera)

  scene.add(allObjects)
  allObjects.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-3.141*0.7)
  keyListener = new KeyListener()
}

const animate = () => {
  requestAnimationFrame(animate)
  update()
}
let asd = Date.now()/1E3
const update = () => {
  const epochSeconds = Date.now()/1E3
  const keysDown = keyListener.getKeysDown()
  keyboard.moveKeys( keysDown )
  if( epochSeconds - asd > 0.1 ){
    asd = epochSeconds
    segmentDisplay.update(1)
  }
  renderer.render(scene,camera)
}

init()
animate()