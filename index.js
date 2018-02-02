var crypto = require('libp2p-crypto')
var through = require('pull-through')
var aes = require('./aes')

const KeyLength = 32 // aes256
const BlockSize = 16

var x = module.exports = {}
x.EncryptStream = EncryptStream
x.DecryptStream = DecryptStream
x.RandomKey = RandomKey
x.KeyLength = KeyLength
x.BlockSize = BlockSize

function copy(a) {
  var b = new Buffer(a.length)
  a.copy(b, 0, 0, a.length)
  return b
}

function RandomKey() {
  return crypto.randomBytes(KeyLength)
}

function EncryptStream(key) {
  if (key.length != KeyLength) {
    throw new Error('key length must be ' + KeyLength)
  }

  // use a randomly generated IV
  var IV = crypto.randomBytes(BlockSize)
  var Cipher = aes.create(key, IV)
  var wroteIV = false

  return through(function(data) {
    if (!wroteIV) {
      this.queue(copy(IV))
      wroteIV = true
    }

    if ('string' === typeof data)
      data = new Buffer(data, 'utf8')
    else if (!isBuffer(data))
      return this.emit('error', new Error('must be buffer'))

    if (data.length === 0) return

    var stream = this
    Cipher.encrypt(data, function (err, ciphertext) {
      if (err) return stream.emit('error', err)
      stream.queue(ciphertext)
    })
  }, function (end) {
    return this.queue(null)
  })
}

function DecryptStream(key) {
  if (key.length != KeyLength) {
    throw new Error('key length must be ' + KeyLength)
  }

  var IV = new Buffer(0)
  var Cipher = null

  return through(function(data) {
    if ('string' === typeof data)
      data = new Buffer(data, 'binary')
    else if (!isBuffer(data))
      return this.emit('error', new Error('must be buffer'))

    if (data.length === 0) return

    // still getting IV.
    var remainingIV = BlockSize - IV.length
    if (remainingIV > 0) {
      rIV = Buffer.from(data.slice(0, remainingIV)) // copy
      IV = Buffer.concat([IV, rIV])
      data = data.slice(remainingIV)

      if (0 == BlockSize - IV.length) {
        // ok IV is ready. make the cipher.
        Cipher = aes.create(key, IV)
      }
    }

    if (data.length === 0) return
    if (!Cipher) new Error("should not have gotten here...")

    var stream = this
    Cipher.decrypt(data, function (err, plaintext) {
      if (err) return stream.emit('error', err)
      stream.queue(plaintext)
    })
  }, function (end) {
    return this.queue(null)
  })
}
