import CryptoJS from 'crypto-js'
import util from 'util'

const decrypt = (toDecrypt, key) => {

  var bytes = CryptoJS.AES.decrypt(toDecrypt, key)
  var plaintext = bytes.toString(CryptoJS.enc.Utf8)

  return plaintext
}

export default decrypt
