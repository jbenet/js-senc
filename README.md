# js-senc - js implementation of [senc](https://github.com/jbenet/go-simple-encrypt)


## Library

> WARNING: Library uses [pull-streams](https://github.com/pull-stream).

Works in node.js and the browser. Uses [libp2p-crypto](https://github.com/libp2p/js-libp2p-crypto).

### Install

```js
npm install --save senc
```

### Encrypt
```js
var senc = require('senc')
var stdio = require('pull-stdio')
var key = senc.RandomKey()

pull(
  stdio.stdin({encoding: binary}),
  senc.EncryptStream(key),
  stdio.stdout(() => {})
)
```

### Decrypt
```js
var senc = require('senc')
var stdio = require('pull-stdio')
var key = <key-from-above>

pull(
  stdio.stdin({encoding: binary}),
  senc.DecryptStream(key),
  stdio.stdout(() => {})
)
```

### Random Key
```js
var senc = require('senc')
console.log(senc.RandomKey())
```

## Command Line

### Install
```sh
npm install --global senc
```

### Usage

```sh
usage:  senc  -e -k <key> - encrypt stdin with aes
        senc  -d -k <key> - decrypt stdin with aes

OPTIONS
  -h, --help    this help text
  -d            set decrypt mode
  -e            set encrypt mode
  -k <string>   key to use (in multibase)
  -b <base>     the multibase encoding to write key to
  --key-gen     generate a key
```

### Key-gen

```sh
> senc --key-gen
zEkHKdVKVUazjMndot4puCyA57Ji7vH6VhemsNk8vvkhi

> key=$(senc --key-gen)
```

### Encrypt

```sh
senc -k zEkHKdVKVUazjMndot4puCyA57Ji7vH6VhemsNk8vvkhi -e <plaintext >ciphertext
```

### Decrypt

```sh
senc -k zEkHKdVKVUazjMndot4puCyA57Ji7vH6VhemsNk8vvkhi -d <ciphertext >plaintext2
```

### Full Example

```sh
# keygen
senckey=$(senc --key-gen)

# encrypt
senc -k $senckey -e <plaintext >ciphertext

# decrypt
senc -k $senckey -d <ciphertext >plaintext2

# check the diff
diff plaintext plaintext2
```
