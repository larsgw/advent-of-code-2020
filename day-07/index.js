const fs = require('fs')

function parse (file) {
  const parents = {}
  for (const line of file.trim().split('\n')) {
    const [parent, children] = line.split(' bags contain ')
    parents[parent] = children
      .slice(0, -1)
      .split(', ')
      .map(child => {
        const [amount, type] = child.replace(/ bags?$/, '').split(/ (.+)/)
        return { amount: +amount, child: type }
      })
  }
  return parents
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`)

function reverse (bags) {
  const children = {}
  for (const parent in bags) {
    for (const { amount, child } of bags[parent]) {
      if (!children[child]) { children[child] = [] }
      children[child].push({ amount, parent })
    }
  }
  return children
}

function findParents (color, bags) {
  const parents = new Set()
  for (const { parent } of bags[color] || []) {
    parents.add(parent)
    for (const grandparent of findParents(parent, bags)) {
      parents.add(grandparent)
    }
  }
  return parents
}

function countParents (color, bags) {
  return findParents(color, reverse(bags)).size
}

console.log('7-1-test:', countParents('shiny gold', test))
console.log('7-1:', countParents('shiny gold', input))

function countChildren (color, bags) {
  let count = 0
  for (const { amount, child } of bags[color]) {
    if (isNaN(amount)) { continue }
    count += amount * (1 + countChildren(child, bags))
  }
  return count
}

console.log('8-1-test:', countChildren('shiny gold', test))
console.log('8-1:', countChildren('shiny gold', input))
