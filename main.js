// main.js

// Import minimax.js (directly included in HTML)
let title = document.querySelector(".title");
let turn = ""; // Will be set when game starts
let squares = Array(9).fill(""); // 0-based index, 9 elements

let xWins = parseInt(localStorage.getItem("xWins")) || 0;
let oWins = parseInt(localStorage.getItem("oWins")) || 0;
let draws = parseInt(localStorage.getItem("draws")) || 0;

document.getElementById("x-wins").innerText = xWins;
document.getElementById("o-wins").innerText = oWins;
document.getElementById("draws").innerText = draws;

function winner(num1, num2, num3) {
  title.innerHTML = `Winner is ${squares[num1]}`;
  [num1, num2, num3].forEach((num) => {
    document.getElementById("item" + (num + 1)).style.background = "black";
  });

  if (squares[num1] === "X") {
    xWins++;
    localStorage.setItem("xWins", xWins);
  } else {
    oWins++;
    localStorage.setItem("oWins", oWins);
  }

  document.getElementById("x-wins").innerText = xWins;
  document.getElementById("o-wins").innerText = oWins;

  setInterval(() => (title.innerHTML += "."), 1000);
  setTimeout(() => location.reload(), 3000);
}

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function win() {
  for (const [num1, num2, num3] of winningCombinations) {
    if (
      squares[num1] === squares[num2] &&
      squares[num2] === squares[num3] &&
      squares[num1] !== ""
    ) {
      winner(num1, num2, num3);
      return;
    }
  }

  if (squares.every((s) => s !== "")) {
    title.innerHTML = "It's a draw!";
    draws++;
    localStorage.setItem("draws", draws);
    document.getElementById("draws").innerText = draws;
    setTimeout(() => location.reload(), 3000);
  }
}

function game(id) {
  let index = parseInt(id.replace("item", "")) - 1;
  let elm = document.getElementById(id);

  if (turn === "X" && elm.innerHTML === "") {
    elm.innerHTML = "X";
    squares[index] = "X";
    turn = "O";
    title.innerHTML = "O's turn";

    win(); // Check if X has won

    if (turn === "O" && !squares.every((s) => s !== "")) {
      // Ensure game isn't over
      setTimeout(() => {
        let bestMove = minimax(squares, "O").index;
        if (bestMove !== undefined) {
          squares[bestMove] = "O";
          document.getElementById("item" + (bestMove + 1)).innerHTML = "O";
          turn = "X";
          title.innerHTML = "X's turn";
          win(); // Check if O has won
        }
      }, 500); // AI moves after a short delay
    }
  }
}

function randomMove() {
  let availableMoves = squares
    .map((s, i) => (s === "" ? i : null))
    .filter((s) => s !== null);
  if (availableMoves.length > 0) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  return null;
}

function startGame(startingPlayer) {
  turn = startingPlayer;
  if (startingPlayer === "O") {
    let randomFirstMove = randomMove();
    if (randomFirstMove !== null) {
      squares[randomFirstMove] = "O";
      document.getElementById("item" + (randomFirstMove + 1)).innerHTML = "O";
      turn = "X";
      title.innerHTML = "X's turn";
    }
  } else {
    title.innerHTML = "X's turn";
  }
  document.querySelector(".start-options").style.display = "none"; // Hide start options
  document.querySelector(".board").style.display = "grid"; // Show game board
}

// Show start options and hide the game board initially
window.onload = function () {
  document.querySelector(".board").style.display = "none"; // Hide game board initially
};
