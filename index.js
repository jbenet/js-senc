var aes = require('./aes')
var s2 = require('./streams2')

var x = module.exports
x.EncryptStream = s2.EncryptStream
x.DecryptStream = s2.DecryptStream
x.RandomKey = aes.RandomKey
x.KeyLength = aes.KeyLength
x.BlockSize = aes.BlockSize
