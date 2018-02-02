// this file is here because we need a sync create call.
const ciphers = require('libp2p-crypto/src/aes/ciphers')

const CIPHER_MODES = {
  16: 'aes-128-ctr',
  32: 'aes-256-ctr'
}

exports.create = function (key, iv) {
  const mode = CIPHER_MODES[key.length]
  if (!mode) {
    throw new Error('Invalid key length')
  }

  const cipher = ciphers.createCipheriv(mode, key, iv)
  const decipher = ciphers.createDecipheriv(mode, key, iv)

  const res = {
    encrypt (data, cb) {
      cb(null, cipher.update(data))
    },

    decrypt (data, cb) {
      cb(null, decipher.update(data))
    }
  }

  return res
}
