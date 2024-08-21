function minimax(newBoard, player, alpha = -Infinity, beta = Infinity) {
  let availSpots = emptySquares(newBoard);

  // Base cases for terminal states
  if (checkWin(newBoard, "X")) {
    return { score: -10 };
  } else if (checkWin(newBoard, "O")) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  // Prioritize center, then corners, then edges
  if (player === "O") {
    availSpots = availSpots.sort((a, b) => {
      return prioritizeMove(a) - prioritizeMove(b);
    });
  }

  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];

    // Make the move
    newBoard[availSpots[i]] = player;

    // Recursively get the score for this move
    let result;
    if (player === "O") {
      result = minimax(newBoard, "X", alpha, beta);
      move.score = result.score;
      alpha = Math.max(alpha, result.score);
    } else {
      result = minimax(newBoard, "O", alpha, beta);
      move.score = result.score;
      beta = Math.min(beta, result.score);
    }

    // Undo the move
    newBoard[availSpots[i]] = "";

    // Store the move
    moves.push(move);

    // Alpha-Beta Pruning
    if (beta <= alpha) {
      break;
    }
  }

  // Choose the best move for the AI
  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }

  return bestMove;
}

// Function to prioritize center > corners > edges
function prioritizeMove(index) {
  // Center has the highest priority
  if (index === 4) return 1;
  // Corners have the next priority
  if (index === 0 || index === 2 || index === 6 || index === 8) return 2;
  // Edges have the lowest priority
  return 3;
}

function emptySquares(board) {
  return board.map((s, i) => (s === "" ? i : null)).filter((s) => s !== null);
}

function checkWin(board, player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winPatterns.some((pattern) =>
    pattern.every((index) => board[index] === player)
  );
}
