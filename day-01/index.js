const fs = require('fs')

function numbersToSet (file) {
  return new Set(file.split('\n').filter(Boolean).map(JSON.parse))
}

const input = numbersToSet(fs.readFileSync('input.txt', 'utf8'))
const test = numbersToSet(`1721
979
366
299
675
1456`)

function findSum (numbers, target) {
  for (const m of numbers) {
    const n = target - m
    if (numbers.has(n)) {
      return m * n
    }
  }
}

console.log('1-1-test:', findSum(test, 2020))
console.log('1-1:', findSum(input, 2020))

function findThreeSum (numbers, target) {
  for (const m of numbers) {
    const product = findSum(numbers, target - m)
    if (product) {
      return m * product
    }
  }
}

console.log('1-2-test:', findThreeSum(test, 2020))
console.log('1-2:', findThreeSum(input, 2020))
