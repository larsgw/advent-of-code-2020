const fs = require('fs')

const input = [18, 11, 9, 0, 5, 1]
const test = [0, 3, 6]

function getNthNumber (n, start) {
  const lastIndices = new Map()
  let lastNumber

  for (let i = 0; i < n; i++) {
    process.stdout.write(`Turn ${i+1}\r`)
    let number = 0

    if (i < start.length) {
      number = start[i]
    } else if (lastIndices.has(lastNumber)) {
      number = i - 1 - lastIndices.get(lastNumber)
    }

    lastIndices.set(lastNumber, i - 1)
    lastNumber = number
  }

  return lastNumber
}

console.log('15-1-test:', getNthNumber(2020, test))
console.log('15-1:', getNthNumber(2020, input))

console.log('15-2:', getNthNumber(30000000, input))
