// Hand-authored mini crosswords. Each entry is placed on a grid with a
// starting cell, direction, answer, and clue. The renderer builds the grid,
// numbering, and input cells from these. Every crossing letter is shared by an
// across and a down entry.
export const crosswords = {
  junior: [
    {
      id: 'cw-j1',
      size: { rows: 3, cols: 3 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'CAT', clue: 'A furry pet that says “meow”' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'CUP', clue: 'You drink from this' },
        { num: 2, row: 0, col: 2, dir: 'down', answer: 'TOP', clue: 'The opposite of bottom' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'PUP', clue: 'A baby dog' },
      ],
    },
    {
      id: 'cw-j2',
      size: { rows: 3, cols: 3 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'SUN', clue: 'It shines in the day sky' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'SEA', clue: 'A big body of salty water' },
        { num: 2, row: 0, col: 2, dir: 'down', answer: 'NET', clue: 'You score a goal or catch fish with this' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'ANT', clue: 'A tiny insect that lives in a hill' },
      ],
    },
    {
      id: 'cw-j3',
      size: { rows: 3, cols: 3 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'BAT', clue: 'You swing it in baseball' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'BUS', clue: 'A big vehicle that carries many people' },
        { num: 2, row: 0, col: 2, dir: 'down', answer: 'TOP', clue: 'The opposite of bottom' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'SIP', clue: 'To drink just a little bit' },
      ],
    },
    {
      id: 'cw-j4',
      size: { rows: 3, cols: 3 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'COT', clue: 'A small bed for a baby' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'CUP', clue: 'You drink from this' },
        { num: 2, row: 0, col: 2, dir: 'down', answer: 'TEN', clue: 'The number after nine' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'PEN', clue: 'You write with this' },
      ],
    },
    {
      id: 'cw-j5',
      size: { rows: 3, cols: 3 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'HEN', clue: 'A female chicken' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'HAT', clue: 'You wear it on your head' },
        { num: 2, row: 0, col: 2, dir: 'down', answer: 'NET', clue: 'You catch fish or score a goal with this' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'TOT', clue: 'A very young child' },
      ],
    },
  ],
  senior: [
    {
      id: 'cw-s1',
      size: { rows: 5, cols: 5 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'OCEAN', clue: 'A vast body of salt water' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'OASIS', clue: 'A green, watery spot in a desert' },
        { num: 2, row: 0, col: 4, dir: 'down', answer: 'NORTH', clue: 'The direction a compass needle points' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'SOLAR', clue: 'Relating to the sun, as in ___ power' },
        { num: 4, row: 4, col: 0, dir: 'across', answer: 'SLOTH', clue: 'A very slow-moving rainforest animal' },
      ],
    },
    {
      id: 'cw-s2',
      size: { rows: 5, cols: 5 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'PLANT', clue: 'A living thing that grows in soil' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'PEACE', clue: 'The opposite of war' },
        { num: 2, row: 0, col: 4, dir: 'down', answer: 'TIGER', clue: 'A large striped big cat' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'ALONG', clue: 'Moving ___ the path (in the same direction)' },
        { num: 4, row: 4, col: 0, dir: 'across', answer: 'EAGER', clue: 'Very keen and excited to do something' },
      ],
    },
    {
      id: 'cw-s3',
      size: { rows: 5, cols: 5 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'ATLAS', clue: 'A book of maps' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'APPLE', clue: 'A red or green fruit said to keep the doctor away' },
        { num: 2, row: 0, col: 4, dir: 'down', answer: 'SUGAR', clue: 'Sweet white stuff you add to tea' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'PRONG', clue: 'One of the pointed parts of a fork' },
        { num: 4, row: 4, col: 0, dir: 'across', answer: 'ELDER', clue: 'An older, respected person' },
      ],
    },
    {
      id: 'cw-s4',
      size: { rows: 5, cols: 5 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'GHOST', clue: 'A spooky Halloween spirit' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'GRAPE', clue: 'A small round fruit that grows in bunches' },
        { num: 2, row: 0, col: 4, dir: 'down', answer: 'TEACH', clue: 'What a teacher does' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'ARENA', clue: 'A big stadium where sports are played' },
        { num: 4, row: 4, col: 0, dir: 'across', answer: 'EARTH', clue: 'The planet we live on' },
      ],
    },
    {
      id: 'cw-s5',
      size: { rows: 5, cols: 5 },
      entries: [
        { num: 1, row: 0, col: 0, dir: 'across', answer: 'SPOON', clue: 'You eat soup with this' },
        { num: 1, row: 0, col: 0, dir: 'down', answer: 'SMILE', clue: 'What you do when you’re happy' },
        { num: 2, row: 0, col: 4, dir: 'down', answer: 'NURSE', clue: 'A person who helps care for sick people' },
        { num: 3, row: 2, col: 0, dir: 'across', answer: 'INNER', clue: 'The opposite of outer' },
        { num: 4, row: 4, col: 0, dir: 'across', answer: 'EAGLE', clue: 'A large bird of prey, a national symbol of the USA' },
      ],
    },
  ],
}
