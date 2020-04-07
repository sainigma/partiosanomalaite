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
import { Intersecter } from './components/Intersecter'
import './styles.css'

let camera,scene,renderer
let parsaGroup,cameraPivot
let segmentDisplay,parsa,enviroSphere,keyboard
let keyListener, mouseListener, parsaInterface, serverComms, audioPlayer
let intersecter

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
  
  scene.add(parsaGroup)
  cameraPivot.add(camera)
  parsaGroup.rotation.set(0,0,0)
  scene.add(cameraPivot)
  scene.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-3.141*0.7)
  audioPlayer = new AudioPlayer()
  keyListener = new KeyListener(audioPlayer)
  serverComms = new ServerComms(audioPlayer)
  intersecter = new Intersecter(window, camera, parsaGroup)
  mouseListener = new MouseListener(intersecter)
  keyboard = new Keyboard(parsaGroup,audioPlayer)
  parsaInterface = new ParsaInterface(
    segmentDisplay,
    keyboard,
    parsa,
    parsaGroup,
    serverComms,
    audioPlayer,
    intersecter,
    mouseListener
  )
}

const animate = () => {
  requestAnimationFrame(animate)
  update()
}

let lastRefreshed = Date.now()/1E3
let lastActive = ''

const update = () => {
  const epoch = Date.now()/1E3
  const keysDown = keyListener.getKeysDown()
  const mouse = mouseListener.getDeltas()
  const zoom = 1-mouse.y/1080
  if( mouseListener.mouse >= 4 ){
    cameraPivot.rotateOnWorldAxis( new THREE.Vector3(0,1,0), mouse.x/1e4 )
    //cameraPivot.rotateOnWorldAxis( new THREE.Vector3(1,0,0), mouse.y/1e4 )
  }
  
  if( epoch - lastRefreshed > 0.001 ){
    parsaInterface.update( keysDown, epoch, serverComms )
    lastRefreshed = epoch
    segmentDisplay.update(epoch)
  }
  
  renderer.render(scene,camera)
}

init()
animate()