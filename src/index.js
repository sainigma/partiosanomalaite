import * as THREE from 'three'

import { SegmentDisplay } from './objects/SegmentDisplay'
import { Parsa } from './objects/Parsa'
import { Radio } from './objects/Radio'
import { Keyboard } from './objects/Keyboard'
import { EnviroSphere } from './objects/EnviroSphere'
import { DollyGrip } from './objects/DollyGrip'

import { KeyListener } from './components/KeyListener'
import { MouseListener } from './components/MouseListener'
import { ParsaInterface } from './components/ParsaInterface'
import { ServerComms } from './components/ServerComms'
import { AudioPlayer } from './components/AudioPlayer'
import { Intersecter } from './components/Intersecter'
import './styles.css'

let camera,scene,renderer
let parsaGroup,radioGroup,dollyGrip
let segmentDisplay,parsa,enviroSphere,keyboard,radio
let keyListener, mouseListener, parsaInterface, serverComms, audioPlayer
let intersecter

const init = () => {
  let container
  container = document.getElementById('root')

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 50)

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
  radioGroup = new THREE.Group()

  dollyGrip = new DollyGrip(camera)
  parsa = new Parsa(parsaGroup)
  radio = new Radio(radioGroup)
  const segmentInitialPosition = new THREE.Vector3(-0.38,0.42,-0.3)
  segmentDisplay = new SegmentDisplay(16,parsaGroup,segmentInitialPosition)
  
  scene.add(parsaGroup)
  scene.add(radioGroup)
  scene.add(dollyGrip.getCameraPivot())
  radioGroup.position.set(2,0,-3)
  radioGroup.rotateOnWorldAxis( new THREE.Vector3(0,1,0), -3.141*0.15 )
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
    dollyGrip,
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

const update = () => {
  const epoch = Date.now()/1E3
  const keysDown = keyListener.getKeysDown()
  const mouse = mouseListener.getDeltas()
  const zoom = 1-mouse.y/1080
  if( mouseListener.mouse >= 4 ){
    dollyGrip.rotateAroundY( mouse.x/1e4 )
  }

  dollyGrip.update(epoch)

  if( epoch - lastRefreshed > 0.001 ){
    parsaInterface.update( keysDown, epoch, serverComms )
    lastRefreshed = epoch
    segmentDisplay.update(epoch)
  }
  
  renderer.render(scene,camera)
}

init()
animate()