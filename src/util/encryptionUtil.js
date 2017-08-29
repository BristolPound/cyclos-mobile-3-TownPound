import CryptoJS from 'crypto-js'
import {
  encrypt as simpleEncrypt,
  decrypt as simpleDecrypt
} from 'react-native-simple-encryption'


export function encrypt(text, key) {
  var encryptedText

  if (__DEV__) {
    encryptedText = simpleEncrypt(key, text)
  }
  else {
    encryptedText = CryptoJS.AES.encrypt(text, key)
  }

  return encryptedText
}

export function decrypt(text, key) {
  var decryptedText

  if (__DEV__) {
    console.log("decrypting in dev mode")
    decryptedText = simpleDecrypt(key, text)
  }
  else {
    var bytes = CryptoJS.AES.decrypt(text, key)
    decryptedText = bytes.toString(CryptoJS.enc.Utf8)
  }

  return decryptedText
}
