// Sudoku generator that produces a solved grid then removes cells to make a
// puzzle. Supports 4x4 (2x2 boxes) for the junior player and 9x9 (3x3 boxes)
// for the senior player.

function boxDims(n) {
  // returns [boxRows, boxCols] for an n x n grid
  if (n === 4) return [2, 2]
  if (n === 6) return [2, 3]
  return [3, 3] // 9
}

function shuffle(arr, rand) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Simple seeded RNG (mulberry32) so a given seed makes a reproducible puzzle.
export function makeRng(seed) {
  let t = seed >>> 0
  return function () {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function isValid(grid, n, row, col, val) {
  for (let i = 0; i < n; i++) {
    if (grid[row][i] === val) return false
    if (grid[i][col] === val) return false
  }
  const [br, bc] = boxDims(n)
  const r0 = row - (row % br)
  const c0 = col - (col % bc)
  for (let r = 0; r < br; r++) {
    for (let c = 0; c < bc; c++) {
      if (grid[r0 + r][c0 + c] === val) return false
    }
  }
  return true
}

function solveFill(grid, n, rand) {
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (grid[row][col] === 0) {
        const nums = shuffle(
          Array.from({ length: n }, (_, i) => i + 1),
          rand,
        )
        for (const val of nums) {
          if (isValid(grid, n, row, col, val)) {
            grid[row][col] = val
            if (solveFill(grid, n, rand)) return true
            grid[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

// clues = how many cells to keep filled. Fewer clues = harder.
export function generateSudoku(n, clues, seed) {
  const rand = makeRng(seed)
  const solution = Array.from({ length: n }, () => Array(n).fill(0))
  solveFill(solution, n, rand)

  const puzzle = solution.map((r) => r.slice())
  const cells = shuffle(
    Array.from({ length: n * n }, (_, i) => i),
    rand,
  )
  let filled = n * n
  for (const idx of cells) {
    if (filled <= clues) break
    const r = Math.floor(idx / n)
    const c = idx % n
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0
      filled--
    }
  }
  return { puzzle, solution, n, box: boxDims(n) }
}

// Difficulty presets per age level.
export function sudokuForLevel(level, seed) {
  if (level === 'junior') {
    // 4x4, keep ~8 of 16 clues — approachable for a 6-year-old.
    return generateSudoku(4, 8, seed)
  }
  // 9x9, keep ~36 of 81 clues — a solid but fair challenge for a 10-year-old.
  return generateSudoku(9, 36, seed)
}
