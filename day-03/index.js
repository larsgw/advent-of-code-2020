const fs = require('fs')

function parse (file) {
  return file.trim().split('\n').map(row => row.split(''))
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`)

function countTrees (map, slope) {
  let trees = 0
  let x = 0
  for (let y = 0; y < map.length; y += slope[1]) {
    trees += map[y][x % map[0].length] === '#'
    x += slope[0]
  }
  return trees
}

console.log('3-1-test:', countTrees(test, [3, 1]))
console.log('3-1:', countTrees(input, [3, 1]))

function checkSlopes (map, slopes) {
  let checksum = 1
  for (const slope of slopes) {
    checksum *= countTrees(map, slope)
  }
  return checksum
}

const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
]

console.log('3-1-test:', checkSlopes(test, slopes))
console.log('3-1:', checkSlopes(input, slopes))
