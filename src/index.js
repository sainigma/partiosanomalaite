import * as THREE from 'three'
import { SegmentDisplay } from './objects/SegmentDisplay'
import { Parsa } from './objects/Parsa'
import { Keyboard } from './objects/Keyboard'
import { EnviroSphere } from './objects/EnviroSphere'
import { KeyListener } from './components/KeyListener'
import { MouseListener } from './components/MouseListener'
import { ParsaInterface } from './components/ParsaInterface'
import { ServerComms } from './components/ServerComms'
import { AudioPlayer } from './components/AudioPlayer'
import './styles.css'

let camera,scene,renderer
let parsaGroup,cameraPivot
let segmentDisplay,parsa,enviroSphere,keyboard
let keyListener, mouseListener, parsaInterface, serverComms, audioPlayer

const init = () => {
  let container
  container = document.getElementById('root')

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 50)
  camera.position.y = 1.8
  camera.position.x = 0
  camera.position.z = 2
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
  parsaGroup = new THREE.Group()
  cameraPivot = new THREE.Group()
  parsa = new Parsa(parsaGroup)
  const segmentInitialPosition = new THREE.Vector3(-0.38,0.42,-0.3)
  segmentDisplay = new SegmentDisplay(16,parsaGroup,segmentInitialPosition)
  keyboard = new Keyboard(parsaGroup)
  scene.add(parsaGroup)
  cameraPivot.add(camera)
  parsaGroup.rotation.set(0,0,0)
  scene.add(cameraPivot)
  scene.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-3.141*0.7)
  keyListener = new KeyListener()
  mouseListener = new MouseListener()
  audioPlayer = new AudioPlayer()
  serverComms = new ServerComms(audioPlayer)
  parsaInterface = new ParsaInterface(segmentDisplay, parsaGroup, serverComms, audioPlayer)
}

const animate = () => {
  requestAnimationFrame(animate)
  update()
}

let lastRefreshed = Date.now()/1E3

const update = () => {
  const epoch = Date.now()/1E3
  const keysDown = keyListener.getKeysDown()
  if( keysDown.length > 0 ){
    audioPlayer.activate()
  }
  const mouse = mouseListener.getDeltas()
  const zoom = 1-mouse.y/1080
  keyboard.moveKeys( keysDown )
  cameraPivot.rotation.set(0,3*(mouse.x/1920),0)
  cameraPivot.scale.set(zoom, zoom, zoom)
  
  if( epoch - lastRefreshed > 0.001 ){
    parsaInterface.update( keysDown, epoch, serverComms )
    lastRefreshed = epoch
    segmentDisplay.update(epoch)
  }
  
  renderer.render(scene,camera)
}

init()
animate()