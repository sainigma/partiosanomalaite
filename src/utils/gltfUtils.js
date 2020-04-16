import * as THREE from 'three'

export const loadTexture = (name, filetype, path, divToEdit) => {
  const manager = new THREE.LoadingManager()
  manager.onLoad = () => {
    divToEdit.appendChild(document.createTextNode('.'))
  }
  let loader = new THREE.TextureLoader(manager).setPath(path)
  return loader.load( (`${name}.${filetype}`), (texture) => {
    texture.flipY = false
    texture.encoding = 3001
    texture.wrapS = 1000
    texture.wrapT = 1000
    return texture
  })
}