import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export class EnviroSphere {
  constructor(scene,renderer){
    let loader = new RGBELoader().setDataType( THREE.UnsignedByteType ).setPath('textures/')
    let pmremGenerator = new THREE.PMREMGenerator( renderer )
    pmremGenerator.compileEquirectangularShader()

    loader.load( 'environment.hdr', (texture) => {
      let envMap = pmremGenerator.fromEquirectangular( texture ).texture
      //scene.background = envMap
      scene.environment = envMap

      texture.dispose()
      pmremGenerator.dispose()
    })
  }
}