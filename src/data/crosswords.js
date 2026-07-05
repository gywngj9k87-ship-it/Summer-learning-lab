// Hand-authored mini crosswords. Each entry is placed on a grid with a
// starting cell, direction, answer, and clue. The renderer builds the grid,
// numbering, and input cells from these. (Bank is small but easily expanded —
// add more objects to grow variety.)
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
  ],
}
