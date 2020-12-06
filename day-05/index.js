const fs = require('fs')

const chars = {
  F: 0, // front → lower rows
  B: 1, // back → upper rows
  L: 0, // left → left columns
  R: 1 // right → right columns
}

function parse (file) {
  return file.trim().split('\n').map(pass => {
    const dirs = pass.split('').map(char => chars[char])
    return {
      pass,
      rowDirs: dirs.slice(0, 7),
      colDirs: dirs.slice(7, 10)
    }
  })
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`FBFBBFFRLR
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL`)

function calculateSeatId (row, col) {
  return row * 8 + col
}

function followDirections ([dir, ...dirs], start, length) {
  // console.log(' '.repeat(start) + '='.repeat(length))
  if (length <= 1) { return start }
  const choice = [start, start + length / 2]
  return followDirections(dirs, choice[dir], length / 2)
}

function getSeatId (pass) {
  const row = followDirections(pass.rowDirs, 0, 128)
  const col = followDirections(pass.colDirs, 0, 8)
  return calculateSeatId(row, col)
}

function getSeatIds (passes) {
  return passes.map(pass => getSeatId(pass))
}

function getHighestSeatId (passes) {
  return getSeatIds(passes).reduce((max, value) => value > max ? value : max, 0)
}

console.log('5-1-test:', getSeatIds(test))
console.log('5-1:', getHighestSeatId(input))

function getMissingSeatId (passes) {
  const seatIds = new Set(getSeatIds(passes))
  for (const seatId of seatIds) {
    if (!seatIds.has(seatId + 1) && seatIds.has(seatId + 2)) {
      return seatId + 1
    }
  }
}

console.log('5-1:', getMissingSeatId(input))
