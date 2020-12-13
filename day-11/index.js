const fs = require('fs')

function parse (file) {
  return file.trim().split('\n').map(line => line.split(''))
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`)

const directions = [
  [-1, -1],
  [-1,  0],
  [-1,  1],
  [ 0, -1],
  [ 0,  1],
  [ 1, -1],
  [ 1,  0],
  [ 1,  1]
]

function countNeighbours (x, y, map) {
  let count = 0
  const height = map.length
  const width = map[0].length

  for (const [dy, dx] of directions) {
    if (y + dy < 0 || y + dy >= height || x + dx < 0 || x + dx >= width) { continue }
    count += map[y + dy][x + dx] === '#'
  }

  return count
}

function countLinesOfSight (x, y, map) {
  let count = 0
  const height = map.length
  const width = map[0].length

  for (const [dy, dx] of directions) {
    for (let step = 1; ; step++) {
      const py = y + step * dy
      const px = x + step * dx

      if (py < 0 || py >= height || px < 0 || px >= width) { break }
      if (map[py][px] === '.') { continue }

      count += map[py][px] === '#'
      break
    }
  }

  return count
}

function stepTime (map, method, max) {
  return map.map((line, y) =>
    line.map((seat, x) =>
      seat === 'L' && method(x, y, map) === 0
        ? '#' :
      seat === '#' && method(x, y, map) >= max
        ? 'L' : seat
    )
  )
}

function formatMap (map, reset) {
  let string = ''
  if (reset) {
    string += '\r' + '\033[A'.repeat(map.length)
  }
  string += map.map(line => line.join('')).join('\n')
  return string
}

function getEquilibriumChecksum (map, ...args) {
  let old = map.join()
  let equilibrium = map

  do {
    [old, equilibrium] = [equilibrium.join(), stepTime(equilibrium, ...args)]
  } while (old !== equilibrium.join())

  return equilibrium
    .flat()
    .filter(seat => seat === '#')
    .length
}

console.log('11-1-test:', getEquilibriumChecksum(test, countNeighbours, 4))
console.log('11-1:', getEquilibriumChecksum(input, countNeighbours, 4))

console.log('11-2-test:', getEquilibriumChecksum(test, countLinesOfSight, 5))
console.log('11-2:', getEquilibriumChecksum(input, countLinesOfSight, 5))
