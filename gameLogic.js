export const checkWinner = (board) => {
  const lines = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // rows
      lines.push([[i, j, 0], [i, j, 1], [i, j, 2], [i, j, 3]]);
      lines.push([[i, 0, j], [i, 1, j], [i, 2, j], [i, 3, j]]);
      lines.push([[0, i, j], [1, i, j], [2, i, j], [3, i, j]]);
      
      // columns
      lines.push([[j, i, 0], [j, i, 1], [j, i, 2], [j, i, 3]]);
      lines.push([[0, j, i], [1, j, i], [2, j, i], [3, j, i]]);
      lines.push([[j, 0, i], [j, 1, i], [j, 2, i], [j, 3, i]]);
      
      // diagonals in layers
      lines.push([[i, 0, 0], [i, 1, 1], [i, 2, 2], [i, 3, 3]]);
      lines.push([[i, 0, 3], [i, 1, 2], [i, 2, 1], [i, 3, 0]]);
      lines.push([[0, i, 0], [1, i, 1], [2, i, 2], [3, i, 3]]);
      lines.push([[0, i, 3], [1, i, 2], [2, i, 1], [3, i, 0]]);
      lines.push([[0, 0, i], [1, 1, i], [2, 2, i], [3, 3, i]]);
      lines.push([[0, 3, i], [1, 2, i], [2, 1, i], [3, 0, i]]);
    }
  }

  // Add main diagonals across all layers
  lines.push([[0, 0, 0], [1, 1, 1], [2, 2, 2], [3, 3, 3]]);
  lines.push([[0, 0, 3], [1, 1, 2], [2, 2, 1], [3, 3, 0]]);
  lines.push([[0, 3, 0], [1, 2, 1], [2, 1, 2], [3, 0, 3]]);
  lines.push([[0, 3, 3], [1, 2, 2], [2, 1, 1], [3, 0, 0]]);

  for (let line of lines) {
    const [a, b, c, d] = line;
    if (
      board[a[0]][a[1]][a[2]] &&
      board[a[0]][a[1]][a[2]] === board[b[0]][b[1]][b[2]] &&
      board[a[0]][a[1]][a[2]] === board[c[0]][c[1]][c[2]] &&
      board[a[0]][a[1]][a[2]] === board[d[0]][d[1]][d[2]]
    ) {
      return board[a[0]][a[1]][a[2]];
    }
  }
  return null;
};


const getMainDiagonalLines = () => {
  const diagonals = [];
  for (let i = 0; i < 4; i++) {
    // Diagonals in each layer
    diagonals.push([[i, 0, 0], [i, 1, 1], [i, 2, 2], [i, 3, 3]]);
    diagonals.push([[i, 0, 3], [i, 1, 2], [i, 2, 1], [i, 3, 0]]);
    diagonals.push([[0, i, 0], [1, i, 1], [2, i, 2], [3, i, 3]]);
    diagonals.push([[0, i, 3], [1, i, 2], [2, i, 1], [3, i, 0]]);
    diagonals.push([[0, 0, i], [1, 1, i], [2, 2, i], [3, 3, i]]);
    diagonals.push([[0, 3, i], [1, 2, i], [2, 1, i], [3, 0, i]]);
  }

  // Main diagonals across layers
  diagonals.push([[0, 0, 0], [1, 1, 1], [2, 2, 2], [3, 3, 3]]);
  diagonals.push([[0, 0, 3], [1, 1, 2], [2, 2, 1], [3, 3, 0]]);
  diagonals.push([[0, 3, 0], [1, 2, 1], [2, 1, 2], [3, 0, 3]]);
  diagonals.push([[0, 3, 3], [1, 2, 2], [2, 1, 1], [3, 0, 0]]);
  
  return diagonals;
};

// Check if a move completes any of the main diagonals
const isWinningMove = (board, l, r, c, player) => {
  const diagonals = getMainDiagonalLines();
  for (let diag of diagonals) {
    if (diag.some(([x, y, z]) => x === l && y === r && z === c)) {
      // Check if placing a mark at (l, r, c) completes this diagonal
      const line = diag.map(([x, y, z]) => board[x][y][z]);
      if (line.filter(cell => cell === player).length === 3 && line.includes(null)) {
        return true;
      }
    }
  }
  return false;
};

export const getBestMove = (board) => {
  const checkAndReturnMove = (player) => {
    for (let l = 0; l < 4; l++) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (!board[l][r][c]) {
            board[l][r][c] = player;
            if (isWinningMove(board, l, r, c, player)) {
              board[l][r][c] = null;
              return { layer: l, row: r, col: c };
            }
            board[l][r][c] = null;
          }
        }
      }
    }
    return null;
  };

  // Check for AI winning move
  const aiMove = checkAndReturnMove('O');
  if (aiMove) return aiMove;

  // Check for blocking opponent's winning move
  const blockMove = checkAndReturnMove('X');
  if (blockMove) return blockMove;

  // If no immediate win or block, choose a random empty cell
  const emptyCells = [];
  for (let l = 0; l < 4; l++) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!board[l][r][c]) {
          emptyCells.push({ layer: l, row: r, col: c });
        }
      }
    }
  }
  if (emptyCells.length > 0) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  return null;
};
