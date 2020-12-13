const fs = require('fs')

function parse (file) {
  return file.trim().split('\n').map(line => ({
    instruction: line[0],
    argument: +line.slice(1)
  }))
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`F10
N3
F7
R90
F11`)

function getMovement (instructions) {
  let x = 0
  let y = 0
  let dir = 0

  for (const { instruction, argument } of instructions) {
    switch (instruction) {
      case 'N': y += argument; break
      case 'S': y -= argument; break
      case 'E': x += argument; break
      case 'W': x -= argument; break
      case 'F':
        if (dir % 2 === 0) {
          x += argument * (dir === 0 ? 1 : -1)
        } else {
          y += argument * (dir === 1 ? -1 : 1)
        }
        break
      case 'L': dir = (4 + dir - argument / 90) % 4; break
      case 'R': dir = (dir + argument / 90) % 4; break
    }
  }

  return [x, y]
}

function getManhattanDistance ([x, y]) {
  return Math.abs(x) + Math.abs(y)
}

console.log('12-1-test:', getManhattanDistance(getMovement(test)))
console.log('12-1:', getManhattanDistance(getMovement(input)))

function getMovement2 (instructions) {
  let waypoint = [10, 1]
  let x = 0
  let y = 0

  for (const { instruction, argument } of instructions) {
    switch (instruction) {
      case 'F':
        x += argument * waypoint[0]
        y += argument * waypoint[1]
        break
      case 'N': waypoint[1] += argument; break
      case 'S': waypoint[1] -= argument; break
      case 'E': waypoint[0] += argument; break
      case 'W': waypoint[0] -= argument; break
      case 'L':
        for (let _ = 0; _ < argument / 90; _++) {
          const [x, y] = waypoint
          waypoint = [-y, x]
        }
        break
      case 'R':
        for (let _ = 0; _ < argument / 90; _++) {
          const [x, y] = waypoint
          waypoint = [y, -x]
        }
        break
    }
  }

  return [x, y]
}

console.log('12-2-test:', getManhattanDistance(getMovement2(test)))
console.log('12-2:', getManhattanDistance(getMovement2(input)))
