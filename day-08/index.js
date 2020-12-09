const fs = require('fs')

function parse (file) {
  return file.trim().split('\n').map(line => {
    const [operation, argument] = line.trim().split(' ')
    return { operation, argument: +argument }
  })
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`)

function runProgram (instructions) {
  const seen = new Set()
  let accumulator = 0
  let cursor = 0

  while (cursor < instructions.length) {
    if (seen.has(cursor)) {
      return { loop: true, accumulator }
    }
    seen.add(cursor)
    const { operation, argument } = instructions[cursor]
    switch (operation) {
      case 'acc':
        accumulator += argument
        cursor++
        break

      case 'jmp':
        cursor += argument
      	break

      case 'nop':
        cursor++
      	break

      default:
        console.log('Unknown operator')
      	break
    }
  }

  return { loop: false, accumulator }
}

console.log('8-1-test:', runProgram(test))
console.log('8-1:', runProgram(input))

const operationMap = {
  nop: 'jmp',
  jmp: 'nop'
}

function changeOperation (operation, i, instructions) {
  const changed = instructions.slice()
  changed[i] = { ...instructions[i], operation }
  return changed
}

function fixProgram (instructions) {
  const changes = instructions
    .map(({ operation }, i) => operation in operationMap ? [operation, i] : null)
    .filter(Boolean)
  for (const [operation, i] of changes) {
    const changed = changeOperation(operationMap[operation], i, instructions)
    const { loop, accumulator } = runProgram(changed)
    if (!loop) { return accumulator }
  }
}

console.log('8-2-test:', fixProgram(test))
console.log('8-2:', fixProgram(input))
