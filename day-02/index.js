const fs = require('fs')

function parse (file) {
  const passwords = []
  for (const line of file.trim().split('\n')) {
    const [policy, ...password] = line.split(': ')
    const [range, char] = policy.split(' ')
    passwords.push({
      password: password.join(': '),
      policy: { char, range: range.split('-').map(JSON.parse) }
    })
  }
  return passwords
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`)

function checkPassword (password, char, [min, max]) {
  const count = password.split(char).length - 1
  return count >= min && count <= max
}

function countCorrectPasswords (passwords, checkPassword) {
  let correct = 0
  for (const { password, policy } of passwords) {
    correct += +checkPassword(password, policy.char, policy.range)
  }
  return correct
}

console.log('2-1-test:', countCorrectPasswords(test, checkPassword))
console.log('2-1:', countCorrectPasswords(input, checkPassword))

function checkPassword2 (password, char, [a, b]) {
  return (password[a - 1] === char) !== (password[b - 1] === char)
}

console.log('2-2-test:', countCorrectPasswords(test, checkPassword2))
console.log('2-2:', countCorrectPasswords(input, checkPassword2))
