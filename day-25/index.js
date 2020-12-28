const fs = require('fs')

function parse (input) {
  return input.trim().split('\n').map(JSON.parse)
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`5764801
17807724`)

function findLoopSize (publicKeys) {
  const keys = new Set(publicKeys)

  let value = 1
  let loops = 0
  while (!keys.has(value)) {
    ++loops
    value = (value * 7) % 20201227
  }

  return [value, loops]
}

function getEncryptionKey (publicKeys) {
  let [publicKey, loopSize] = findLoopSize(publicKeys)
  const subject = publicKeys.find(key => key !== publicKey)
  let value = 1
  while (loopSize--) {
    value = (value * subject) % 20201227
  }
  return value
}

console.log('24-1-test:', getEncryptionKey(test))
console.log('24-1:', getEncryptionKey(input))
