// Word banks for the Wordle-style game, tuned by age.
// Junior (age 6, Grade 1): short 3–4 letter, common, decodable words.
// Senior (age 10, Grade 5): classic 5-letter words.

export const JUNIOR_WORDS = [
  'cat', 'dog', 'sun', 'hat', 'bug', 'red', 'box', 'cup', 'pig', 'bed',
  'fox', 'top', 'bus', 'net', 'jam', 'leg', 'pen', 'map', 'fan', 'log',
  'fish', 'frog', 'star', 'moon', 'tree', 'cake', 'ball', 'bird', 'book', 'duck',
  'milk', 'rain', 'sock', 'jump', 'kite', 'lion', 'nest', 'ship', 'goat', 'hand',
]

export const SENIOR_WORDS = [
  'globe', 'ocean', 'plant', 'brave', 'sport', 'chess', 'flute', 'grape',
  'house', 'juice', 'lemon', 'mango', 'noble', 'piano', 'queen', 'river',
  'stone', 'tiger', 'unity', 'vivid', 'whale', 'zebra', 'peace', 'earth',
  'coral', 'delta', 'eagle', 'frost', 'grain', 'honor', 'ivory', 'jewel',
  'medal', 'north', 'orbit', 'proud', 'realm', 'solar', 'trade', 'voice',
]

export function wordsForLevel(level) {
  return level === 'junior' ? JUNIOR_WORDS : SENIOR_WORDS
}

// Pick a word deterministically from a seed so a given day = a given word.
export function pickWord(level, seed) {
  const list = wordsForLevel(level)
  return list[Math.abs(seed) % list.length]
}
