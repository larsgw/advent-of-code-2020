const fs = require('fs')

function parse (file) {
  return file
    .trim()
    .split('\n')
    .map(line => line.match(/[ns]?[we]/g))
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`)

function isBlack (flips) {
  return flips % 2 === 1
}

function countStrings (strings, defaults = {}) {
  return strings.reduce((counts, string) => {
    if (string in counts) {
      counts[string]++
    } else {
      counts[string] = 1
    }
    return counts
  }, defaults)
}

function normalizeTile (tile) {
  const c = countStrings(tile, { e: 0, se: 0, sw: 0, w: 0, nw: 0, ne: 0 })
  return [
    2 * c.e - 2 * c.w + c.se + c.ne - c.sw - c.nw,
    c.nw + c.ne - c.sw - c.se
  ]
}

function countBlackTiles (flips) {
  const tiles = countStrings(flips.map(flip => normalizeTile(flip).join()))
  return Object.values(tiles).filter(isBlack).length
}

console.log('24-1-test:', countBlackTiles(test))
console.log('24-1:', countBlackTiles(input))

const dCoords = ['e', 'se', 'sw', 'w', 'nw', 'ne'].map(d => normalizeTile([d]))

function parseCoords (string) {
  return string.split(',').map(JSON.parse)
}

function getTileCounts (tiles) {
  const checking = Object.keys(tiles)
  const counts = {}

  while (checking.length) {
    const tile = checking.shift()
    const [x, y] = parseCoords(tile)
    counts[tile] = 0

    for (const [dx, dy] of dCoords) {
      const neighbour = [x + dx, y + dy].join()
      if (neighbour in tiles) {
        counts[tile] += isBlack(tiles[neighbour])
      } else if (isBlack(tiles[tile])) {
        tiles[neighbour] = 0
        checking.push(neighbour)
      }
    }
  }

  return counts
}

function playGame (flips, days) {
  const tiles = countStrings(flips.map(flip => normalizeTile(flip).join()))

  while (days--) {
    const counts = getTileCounts(tiles)
    for (const tile in counts) {
      const black = isBlack(tiles[tile])
      const count = counts[tile]
      if ((black && (count === 0 || count > 2)) || (!black && count === 2)) {
        tiles[tile]++
      }
    }
  }

  return Object.values(tiles).filter(isBlack).length
}

console.log('24-2-test:', playGame(test, 100))
console.log('24-2:', playGame(input, 100))
