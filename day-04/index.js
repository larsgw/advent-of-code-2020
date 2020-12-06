const fs = require('fs')

function parse (file) {
  return file.trim().split('\n\n').map(passport =>
    Object.fromEntries(
      passport.split(/\s+/g).map(field => field.split(':'))
    )
  )
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`)

const requirements = {
  byr: /^(19[2-9][0-9]|200[0-2])$/,
  iyr: /^(201[0-9]|2020)$/,
  eyr: /^(202[0-9]|2030)$/,
  hgt: /^((1[5-8][0-9]|19[0-3])cm|(59|6[0-9]|7[0-6])in)$/,
  hcl: /^#[0-9a-f]{6}$/,
  ecl: /^(amb|blu|brn|gry|grn|hzl|oth)$/,
  pid: /^\d{9}$/
}

function checkPassport (passport, requirements, checkContents) {
  for (const field in requirements) {
    if (!(field in passport)) { return false }
    if (checkContents && !requirements[field].test(passport[field])) { return false }
  }
  return true
}

function countCorrectPassports (passports, requirements, checkContents) {
  let correct = 0
  for (const passport of passports) {
    correct += checkPassport(passport, requirements, checkContents)
  }
  return correct
}

console.log('4-1-test:', countCorrectPassports(test, requirements, false))
console.log('4-1:', countCorrectPassports(input, requirements, false))

console.log('4-2-test:', countCorrectPassports(test, requirements, true))
console.log('4-2:', countCorrectPassports(input, requirements, true))
