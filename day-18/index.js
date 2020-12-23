const fs = require('fs')

function parse (file) {
  return file.trim().split('\n')
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2')

function evaluate (expression) {
  while (/\(|\)/.test(expression)) {
    expression = expression.replace(/\([^()]+\)/g, m => evaluate(m.slice(1, -1)))
  }
  while (!/^\d+$/.test(expression)) {
    expression = expression.replace(
      /(\d+) ([+*]) (\d+)/,
      (_, a, op, b) => op === '+' ? (+a) + (+b) : a * b
    )
  }
  return +expression
}

function sum (a, b) {
  return a + b
}

console.log('18-1-test:', test.map(evaluate).reduce(sum))
console.log('18-1:', input.map(evaluate).reduce(sum))

function evaluate2 (expression) {
  while (/\(|\)/.test(expression)) {
    expression = expression.replace(/\([^()]+\)/g, m => evaluate2(m.slice(1, -1)))
  }
  while (/\+/.test(expression)) {
    expression = expression.replace(/(\d+) \+ (\d+)/, (_, a, b) => (+a) + (+b))
  }
  while (/\*/.test(expression)) {
    expression = expression.replace(/(\d+) \* (\d+)/, (_, a, b) => a * b)
  }
  return +expression
}

console.log('18-2-test:', test.map(evaluate2).reduce(sum))
console.log('18-2:', input.map(evaluate2).reduce(sum))
