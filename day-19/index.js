const fs = require('fs')


function parse (file) {
  const [defs, tests] = file.trim().split('\n\n')
  return {
    defs: Object.fromEntries(
      defs
        .split('\n')
        .map(line => line.split(': '))
    ),
    tests: tests.split('\n')
  }
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`)

function constructPattern (def, defs, complete) {
  if (defs[def] instanceof RegExp) {
    return defs[def]
  }

  let pattern = defs[def]
    .replace(/\d+/g, def => constructPattern(def, defs).source)
    .replace(/[" ]/g, '')

  if (complete) {
    pattern = `^${pattern}$`
  } else if (/\|/.test(pattern)) {
    pattern = `(?:${pattern})`
  }

  return defs[def] = new RegExp(pattern)
}

function countCorrect ({ defs, tests }) {
  const pattern = constructPattern(0, { ...defs }, true)
  return tests.filter(test => pattern.test(test)).length
}

console.log('19-1-test:', countCorrect(test))
console.log('19-1:', countCorrect(input))

const test2 = parse(`42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`)

function countCorrectFixed ({ defs, tests }) {
  return tests.filter(test => {
    let n = 1
    while (true) {
      const fixed = { ...defs }
      // 8 = '42 | 42 8'
      fixed[8] = new RegExp(constructPattern(42, fixed).source + '+')
      // 11 = '42 31 | 42 11 31'
      fixed[11] = new RegExp(`${constructPattern(42, fixed).source}{${n}}${constructPattern(31, fixed).source}{${n}}`)
      const pattern = constructPattern(0, fixed, true)
      if (pattern.test(test)) { break }
      if (++n > 10) { return false }
    }

    return true
  }).length
}

console.log('19-2-test:', countCorrectFixed(test2))
console.log('19-2:', countCorrectFixed(input))
