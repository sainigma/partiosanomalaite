import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export class EnviroSphere {
  constructor(scene,renderer){
    const manager = new THREE.LoadingManager()
    const enviroDiv = document.createElement('div')
    document.getElementById('debug').appendChild(enviroDiv)

    manager.onStart = () => {
      enviroDiv.appendChild(document.createTextNode('Loading environment..'))
    }
    manager.onProgress = () => {
      enviroDiv.appendChild(document.createTextNode('.'))
    }
    manager.onLoad = () => {
      enviroDiv.appendChild(document.createTextNode(' complete'))
    }

    let loader = new RGBELoader(manager).setDataType( THREE.UnsignedByteType ).setPath('textures/')
    let pmremGenerator = new THREE.PMREMGenerator( renderer )
    pmremGenerator.compileEquirectangularShader()

    loader.load( 'environment.hdr', (texture) => {
      let envMap = pmremGenerator.fromEquirectangular( texture ).texture
      scene.background = envMap
      scene.environment = envMap

      texture.dispose()
      pmremGenerator.dispose()
    })
  }
}