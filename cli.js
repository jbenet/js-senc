#!/usr/bin/env node

var senc = require('./index')
var mb = require('multibase')
var P = require('minimist')(process.argv.slice(2))

var usage = `usage:  senc  -e -k <key> - encrypt stdin with aes
        senc  -d -k <key> - decrypt stdin with aes

OPTIONS
  -h, --help    this help text
  -d            set decrypt mode
  -e            set encrypt mode
  -k <string>   key to use (in multibase)
  -b <base>     the multibase encoding to write key to
  --key-gen     generate a key
`

function die(err) {
  console.error('error: ' + err)
  process.exit(-1)
}

if (process.argv.slice(2).length == 0 || P.h || P.help) {
  console.log(usage)
  process.exit(0)
}

if (P.e && P.d) {
  die('use either -e or -d but not both')
}

// select base
if (P.b) {
  try {
    mb.Encode(P.b, new Buffer())
  } catch (e) {
    die('unrecognized multibase: ' + P.b)
  }
} else {
  P.b = 'base58btc'
}

// run key-gen
if (P['key-gen']) {
  var o = mb.encode(P.b, senc.RandomKey()).toString()
  process.stdout.write(o)
  process.stdout.write("\n")
} else {

  // select Key
  if (!P.k) {
    if (P.key) {
      P.k = P.key
    } else {
      die('key required')
    }
  }
  if (!mb.isEncoded(P.k)) {
    die('key must be in multibase format')
  }
  var key = mb.decode(P.k)

  var S
  if (P.e) {
    S = senc.EncryptStream(key)
  } else if (P.d) {
    S = senc.DecryptStream(key)
  } else {
    die('must use either -e or -d')
  }

  process.stdin
    .pipe(S)
    .pipe(process.stdout)
}
