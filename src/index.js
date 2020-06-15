import * as THREE from 'three'

import { SegmentDisplay } from './objects/SegmentDisplay'
import { Parsa } from './objects/Parsa'
import { Radio } from './objects/Radio'
import { Keyboard } from './objects/Keyboard'
import { EnviroSphere } from './objects/EnviroSphere'
import { DollyGrip } from './objects/DollyGrip'
import { NoteBook } from './objects/NoteBook'
import { MapBook } from './objects/MapBook'
import { Ground } from './objects/Ground'

import { ParsaInterface } from './components/ParsaInterface'
import { RadioInterface } from './components/RadioInterface'
import { MapBookInterface } from './components/MapBookInterface'
import { NoteBookInterface } from './components/NoteBookInterface'

import { KeyListener } from './components/KeyListener'
import { MouseListener } from './components/MouseListener'
import { ServerComms } from './components/ServerComms'
import { AudioPlayer } from './components/AudioPlayer'
import { Intersecter } from './components/Intersecter'
import './styles.css'


let camera,camera2,mainCamera,scene,renderer
let parsaGroup,radioGroup,notebookGroup,dollyGrip
let segmentDisplay,parsa,enviroSphere,keyboard,radio,noteBook,mapBook,ground
let parsaInterface, radioInterface, mapBookInterface, noteBookInterface, interfaces = []
let keyListener, mouseListener, serverComms, audioPlayer
let intersecter

const setActiveInterface = (name, forced) => {
  if( name === undefined ){
    interfaces.forEach( objectInterface => {
      if( objectInterface.getName() === forced ){
        objectInterface.deactivate(true)
      }
    })
  }else{
    interfaces.forEach( objectInterface => {
      if( objectInterface.getName() !== name ){
        objectInterface.deactivate()
      }
    })
  }
}

const init = () => {
  let container
  container = document.getElementById('root')

  camera2 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 50)
  camera2.position.set(-10,15,10)
  camera2.lookAt(0,0,0)
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 50)

  mainCamera = camera

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
  notebookGroup = new THREE.Group()

  ground = new Ground(scene)
  dollyGrip = new DollyGrip(camera)
  parsa = new Parsa(parsaGroup)
  radio = new Radio(radioGroup)
  mapBook = new MapBook(notebookGroup)
  noteBook = new NoteBook(notebookGroup, mapBook, camera)
  const segmentInitialPosition = new THREE.Vector3(-0.38,0.42,-0.3)
  segmentDisplay = new SegmentDisplay(16,parsaGroup,segmentInitialPosition)
  
  scene.add(parsaGroup)
  scene.add(radioGroup)
  scene.add(notebookGroup)
  scene.add(dollyGrip.getCameraPivot())

  radioGroup.position.set(0.19747*10,0.030103*10,-0.241485*10)
  radioGroup.rotateY( -33.5*3.14159/180 )
  radioGroup.rotateX(-3.13*3.14159/180 )
  radioGroup.rotateZ( 2.66*3.14159/180 )

  notebookGroup.position.set(-0.391283*10, 0.038558*10, -0.103919*10)
  notebookGroup.rotateY( 27.2971*3.14159/180 )
  notebookGroup.rotateX( 18.3023*3.14159/180 )
  notebookGroup.rotateZ( 1.38244*3.14159/180 )

  parsaGroup.position.set(-0.100125*10, 0.002713*10,0.000321*10)
  parsaGroup.rotateY( -0.129661*3.14159/180 )
  parsaGroup.rotateX( 6.7524*3.14159/180 )
  parsaGroup.rotateZ( 0.681243*3.14159/180 )

  scene.rotation.set(0,6.28*1.6,0)
  audioPlayer = new AudioPlayer()
  keyListener = new KeyListener(audioPlayer)
  serverComms = new ServerComms(audioPlayer)

  intersecter = new Intersecter(window, mainCamera)
  intersecter.addGroup(parsaGroup)
  intersecter.addGroup(radioGroup)
  intersecter.addGroup(notebookGroup)
  intersecter.addGroup(dollyGrip.getCameraPivot())

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
    mouseListener,
    setActiveInterface
  )
  radioInterface = new RadioInterface(
    radio, 
    radioGroup, 
    serverComms, 
    audioPlayer, 
    intersecter, 
    mouseListener, 
    dollyGrip,
    setActiveInterface
  )
  noteBookInterface = new NoteBookInterface(
    noteBook,
    scene,
    audioPlayer,
    intersecter,
    mouseListener,
    dollyGrip,
    setActiveInterface,
  )
  mapBookInterface = new MapBookInterface(
    mapBook,
    noteBookInterface,
    intersecter,
    mouseListener,
    dollyGrip,
    setActiveInterface
  )
  interfaces.push(parsaInterface)
  interfaces.push(radioInterface)
  interfaces.push(mapBookInterface)
  interfaces.push(noteBookInterface)

}
let loadingFinishedAt = 0
const loadingScreen = () => {
  if( loadingFinishedAt > 0 ){
    if( Date.now()/1E3 > (loadingFinishedAt + 0.5) ){
      document.getElementById('debug').style.visibility='hidden'
      requestAnimationFrame(animate)
      update()
    }else{
      requestAnimationFrame(loadingScreen)
    }
  }else{
    if( !noteBookInterface.hasLoaded() && !noteBookInterface.loadStarted() ){
      noteBookInterface.model.loadModel()
    }else if( noteBookInterface.hasLoaded() && !radioInterface.hasLoaded() && !radioInterface.loadStarted() ){
      radioInterface.model.loadModel()
    }else if( radioInterface.hasLoaded() && !parsaInterface.hasLoaded() && !parsaInterface.loadStarted() ){
      parsaInterface.model.loadModel()
    }else if( parsaInterface.hasLoaded() && !mapBookInterface.hasLoaded() && !mapBookInterface.loadStarted() ){
      mapBookInterface.model.loadModel()
    }
    if( mapBookInterface.hasLoaded()
        && radioInterface.hasLoaded()
        && parsaInterface.hasLoaded()
        && noteBookInterface.hasLoaded()
      ){
      loadingFinishedAt = Date.now()/1E3
    }
    requestAnimationFrame(loadingScreen)
  }
}

const animate = () => {
  requestAnimationFrame(animate)
  update()
}

let lastRefreshed = Date.now()/1E3
let i = 0
const update = () => {
  const epoch = Date.now()/1E3
  const keysDown = keyListener.getKeysDown()
  const mouse = mouseListener.getDeltas()
  if( mouseListener.mouse >= 4 ){
    dollyGrip.rotateAroundY( mouse.x/1e4 )
  }

  dollyGrip.update(epoch)

  if( epoch - lastRefreshed > 0.001 ){
    parsaInterface.update( keysDown, epoch )
    radioInterface.update( keysDown, epoch )
    mapBookInterface.update( undefined, epoch )
    noteBookInterface.update( keysDown, epoch )
    lastRefreshed = epoch
    segmentDisplay.update(epoch)
  }
  /*
  scene.rotation.set(0,i,0)
  i+=0.1
  console.log(i)
  if( i > 6.28 ){
    i = 0
  }
  renderer.toneMappingExposure = Math.sin(3*i/6.28)
  */
  renderer.render(scene,mainCamera)
}

init()
loadingScreen()