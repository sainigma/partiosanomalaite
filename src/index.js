import * as THREE from 'three'

import { SegmentDisplay } from './objects/SegmentDisplay'
import { Parsa } from './objects/Parsa'
import { Radio } from './objects/Radio'
import { Keyboard } from './objects/Keyboard'
import { EnviroSphere } from './objects/EnviroSphere'
import { DollyGrip } from './objects/DollyGrip'
import { NoteBook } from './objects/NoteBook'
import { MapBook } from './objects/MapBook'

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


let camera,scene,renderer
let parsaGroup,radioGroup,notebookGroup,dollyGrip
let segmentDisplay,parsa,enviroSphere,keyboard,radio,noteBook,mapBook
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

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 50)

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

  radioGroup.position.set(2,0,-2.5)
  radioGroup.rotateOnWorldAxis( new THREE.Vector3(0,1,0), -3.141*0.19 )
  scene.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-3.141*0.7)

  audioPlayer = new AudioPlayer()
  keyListener = new KeyListener(audioPlayer)
  serverComms = new ServerComms(audioPlayer)

  intersecter = new Intersecter(window, camera)
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

const loadingScreen = () => {
  if( mapBookInterface.hasLoaded() ){
    document.getElementById('debug').style.visibility='hidden'
    requestAnimationFrame(animate)
    update()
  }else{
    requestAnimationFrame(loadingScreen)
  }
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
    parsaInterface.update( keysDown, epoch )
    radioInterface.update( keysDown, epoch )
    mapBookInterface.update( undefined, epoch )
    noteBookInterface.update( keysDown, epoch )
    lastRefreshed = epoch
    segmentDisplay.update(epoch)
    /*
    if( keysDown[0] === 39 ) noteBook.changePage(true)
    else if( keysDown[0] === 37 ) noteBook.changePage(false)
    noteBook.animate(epoch)*/
  }
  
  renderer.render(scene,camera)
}

init()
loadingScreen()
//animate()