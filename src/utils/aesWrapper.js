import * as aesjs from 'aes-js'

const init = (text,key,hex) => {
  const keyBytes = aesjs.utils.utf8.toBytes(key)
  return {
    bytes:text!==undefined ? aesjs.utils.utf8.toBytes(text) : aesjs.utils.hex.toBytes(hex),
    aesCtr:new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5))
  }
}

export const encryptMessage = (text,key) => {
  if( key.length === 32 ){
    const state = init(text,key)
    const encryptedBytes = state.aesCtr.encrypt(state.bytes)
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
    return encryptedHex
  }
  return false
}

export const decryptMessage = (hex,key) => {
  try{
    const state = init(undefined,key,hex)
    const decryptedBytes = state.aesCtr.decrypt(state.bytes)
    const decryptedContent = aesjs.utils.utf8.fromBytes(decryptedBytes)
    try{
      const parsedContent = JSON.parse(decryptedContent)
      if( parsedContent.checksum !== undefined ){
        return parsedContent.message
      }
    }catch(e){
      return undefined
    }
    return decryptedContent
  }catch(e){
    console.log(e)
    return 'Ongelmia'
  }
}