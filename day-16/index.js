const fs = require('fs')

function parse (file) {
  const [fields, ticket, tickets] = file.trim().split('\n\n')
  return {
    fields: Object.fromEntries(fields.split('\n').map(line => {
      const [field, range] = line.split(': ')
      return [field, range.split(' or ').map(part => part.split('-').map(JSON.parse))]
    })),
    ticket: ticket.split('\n')[1].split(',').map(JSON.parse),
    tickets: tickets
      .split('\n')
      .slice(1)
      .map(line => line.split(',').map(JSON.parse))
  }
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`)

const test2 = parse(`class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`)


function inRange (value, range) {
  for (const [low, high] of range) {
    if (value >= low && value <= high) {
      return true
    }
  }
  return false
}

function getTicketErrorRate (ticket, fields) {
  let rate = null
  for (const value of ticket) {
    if (!Object.values(fields).some(field => inRange(value, field))) {
      rate += value
    }
  }
  return rate
}

function getErrorRate({ tickets, fields }) {
  let rate = 0

  for (const ticket of tickets) {
    rate += getTicketErrorRate(ticket, fields)
  }

  return rate
}

console.log('16-1-test:', getErrorRate(test))
console.log('16-1:', getErrorRate(input))

function deriveFields ({ tickets, fields }) {
  const possibilities = tickets[0].map(() => new Set(Object.keys(fields)))

  for (const ticket of tickets) {
    if (getTicketErrorRate(ticket, fields) !== null) { continue }

    for (let i = 0; i < ticket.length; i++) {
      for (const field of possibilities[i]) {
        if (!inRange(ticket[i], fields[field])) {
          possibilities[i].delete(field)
        }
      }
    }
  }

  const had = new Set()

  while (had.size < tickets[0].length) {
    let removed = 0

    for (const set of possibilities) {
      if (set.size === 1) {
        had.add([...set][0])
        continue
      }

      for (const field of had) {
        if (set.has(field)) {
          set.delete(field)
          removed++
        }
      }
    }
  }

  return possibilities.map(set => [...set][0])
}

function getDepartureValues ({ ticket, ...context }) {
  const fields = deriveFields(context)

  let values = 1
  for (let i = 0; i < ticket.length; i++) {
    if (fields[i].startsWith('departure ')) {
      values *= ticket[i]
    }
  }
  return values
}

console.log('16-2-test:', getDepartureValues(test2))
console.log('16-2:', getDepartureValues(input))
