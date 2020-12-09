const fs = require('fs')

function parse (file) {
  return file.trim().split('\n').map(JSON.parse)
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`)

function canBeSummed (number, numbers) {
  for (const a of numbers) {
    const b = number - a
    if (a !== b && numbers.has(b)) { return true }
  }
  return false
}

function findInvalid (numbers, preambleSize) {
  for (let i = preambleSize; i < numbers.length; i++) {
    const preamble = new Set(numbers.slice(i - preambleSize, i))
    if (!canBeSummed(numbers[i], preamble)) {
      return numbers[i]
    }
  }
}

console.log('9-1-test:', findInvalid(test, 5))
console.log('9-1:', findInvalid(input, 25))

function findSummingNumbers (number, numbers) {
  for (let i = 0; i < numbers.length; i++) {
    let sum = numbers[i]

    let j = 1
    do {
      sum += numbers[i + j++]
    } while (sum < number && i + j < numbers.length)

    if (sum === number) {
      const summingNumbers = numbers.slice(i, i + j)
      return Math.min(...summingNumbers) + Math.max(...summingNumbers)
    }
  }
}

console.log('9-2-test:', findSummingNumbers(findInvalid(test, 5), test))
console.log('9-2:', findSummingNumbers(findInvalid(input, 25), input))
