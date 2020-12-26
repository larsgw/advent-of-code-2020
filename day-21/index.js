const fs = require('fs')

function parse (file) {
  return file
    .trim()
    .split('\n')
    .map(line => {
      const [ingredients, allergens] = line.split(' (contains ')
      return [
        ingredients.split(' '),
        allergens.slice(0, -1).split(', ')
      ]
    })
}

const input = parse(fs.readFileSync('input.txt', 'utf8'))
const test = parse(`mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`)

function narrowAllergenSearch (ingredients, allergens, allAllergens) {
  for (const allergen of allergens) {
    if (allergen in allAllergens) {
      const allergenIngredients = new Set(ingredients)
      for (const ingredient of allAllergens[allergen]) {
        if (!allergenIngredients.has(ingredient)) {
          allAllergens[allergen].delete(ingredient)
        }
      }
    } else {
      allAllergens[allergen] = new Set(ingredients)
    }
  }
}

function countUnallergenicIngredients (products) {
  const allAllergens = {}
  const allIngredients = {}
  let count = 0

  for (const [ingredients, allergens] of products) {
    narrowAllergenSearch(ingredients, allergens, allAllergens)

    for (const ingredient of ingredients) {
      count++
      if (ingredient in allIngredients) {
        allIngredients[ingredient]++
      } else {
        allIngredients[ingredient] = 1
      }
    }
  }

  for (const allergen in allAllergens) {
    for (const ingredient of allAllergens[allergen]) {
      if (ingredient in allIngredients) {
        count -= allIngredients[ingredient]
      }
      delete allIngredients[ingredient]
    }
  }

  return count
}

console.log('21-1-test:', countUnallergenicIngredients(test))
console.log('21-1:', countUnallergenicIngredients(input))

function listAllergenicIngredients (products) {
  const allergens = {}
  for (const product of products) {
    narrowAllergenSearch(...product, allergens)
  }

  const listSize = Object.keys(allergens).length
  const settled = new Set()
  while (settled.size < listSize) {
    for (const allergen in allergens) {
      const ingredients = allergens[allergen]
      if (ingredients.size === 1) {
        settled.add([...ingredients][0])
      } else {
        for (const ingredient of settled) {
          allergens[allergen].delete(ingredient)
        }
      }
    }
  }

  return Object
    .entries(allergens)
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([allergen, ingredient]) => [...ingredient][0])
    .join(',')
}

console.log('21-2-test:', listAllergenicIngredients(test))
console.log('21-2:', listAllergenicIngredients(input))
