import * as THREE from 'three'

export const loadTexture = (name, filetype, path) => {
  let loader = new THREE.TextureLoader().setPath(path)
  return loader.load( (`${name}.${filetype}`), (texture) => {
    texture.flipY = false
    texture.encoding = 3001
    texture.wrapS = 1000
    texture.wrapT = 1000
    return texture
  })
}