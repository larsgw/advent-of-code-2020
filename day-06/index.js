const fs = require('fs')

function parse (file) {
  return file
    .trim()
    .split('\n\n')
    .map(group => group
      .split('\n')
      .map(person => new Set([...person]))
    )
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`abc

a
b
c

ab
ac

a
a
a
a

b`)

function intersection (a, b) {
  const c = new Set(a)
  for (const i of a) {
    if (!b.has(i)) { c.delete(i) }
  }
  return c
}

function union (a, b) {
  const c = new Set(a)
  for (const i of b) {
    c.add(i)
  }
  return c
}

function getAnswer (group, operator) {
  return group.reduce(operator).size
}

function getAnswerSum (groups, operator) {
  return groups.reduce((count, group) => count + getAnswer(group, operator), 0)
}

console.log('6-1-test:', getAnswerSum(test, union))
console.log('6-1:', getAnswerSum(input, union))

console.log('6-1-test:', getAnswerSum(test, intersection))
console.log('6-1:', getAnswerSum(input, intersection))
