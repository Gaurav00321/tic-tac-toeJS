// Game state variables
const PLAYER = "X";
const AI = "O";
let board = Array(9).fill(null);
let currentPlayer = PLAYER;
let gameOver = false;
let isMultiplayer = false;

// Counters for wins, losses, and draws
let playerWins = 0;
let aiWins = 0;
let draws = 0;

// DOM Elements
const modeSelection = document.getElementById("mode-selection");
const gameBoard = document.getElementById("game-board");
const cells = document.querySelectorAll(".cell");
const statusMessage = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");
const newGameBtn = document.getElementById("new-game-btn"); // New Game button
const playerWinsCounter = document.getElementById("player-wins");
const aiWinsCounter = document.getElementById("ai-wins");
const drawsCounter = document.getElementById("draws");

// Initialize the board
function initBoard() {
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = PLAYER;
  statusMessage.textContent = isMultiplayer
    ? "Player 1's turn (X)"
    : "Your turn (X)";
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.removeEventListener("click", handlePlayerMove); // Remove event listeners before re-adding
    cell.addEventListener("click", handlePlayerMove);
  });
  gameBoard.style.display = "block";
  modeSelection.style.display = "none";
}

// Handle player move
function handlePlayerMove(event) {
  const index = event.target.id.split("-")[1];
  if (board[index] || gameOver) return;

  // Mark the cell with the player's symbol
  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  // Check for winner or game over
  if (checkWinner(currentPlayer)) {
    if (currentPlayer === PLAYER) {
      statusMessage.textContent = "Player 1 Won 🎉!!";
      playerWins++;
    } else {
      statusMessage.textContent = "AI wins! 😔";
      aiWins++;
    }
    updateCounters();
    gameOver = true;
    return;
  } else if (!board.includes(null)) {
    statusMessage.textContent = "It's a draw! 🤝";
    draws++;
    updateCounters();
    gameOver = true;
    return;
  }

  // Switch player turns
  currentPlayer = currentPlayer === PLAYER ? AI : PLAYER;
  if (!isMultiplayer && currentPlayer === AI && !gameOver) {
    statusMessage.textContent = "AI's turn (O)";
    setTimeout(handleAIMove, 500); // AI plays after a small delay
  } else {
    statusMessage.textContent = isMultiplayer
      ? currentPlayer === PLAYER
        ? "Player 1's turn (X)"
        : "Player 2's turn (O)"
      : `Your turn (${currentPlayer})`;
  }
}

// AI makes its move using Minimax Algorithm
function handleAIMove() {
  const bestMove = getBestMove();
  board[bestMove] = AI;
  document.getElementById(`cell-${bestMove}`).textContent = AI;

  // Check for winner or game over
  if (checkWinner(AI)) {
    statusMessage.textContent = "AI wins! 😔";
    aiWins++;
    updateCounters();
    gameOver = true;
    return;
  } else if (!board.includes(null)) {
    statusMessage.textContent = "It's a draw! 🤝";
    draws++;
    updateCounters();
    gameOver = true;
    return;
  }

  // Switch back to player's turn
  currentPlayer = PLAYER;
  statusMessage.textContent = "Your turn (X)";
}

// Update the win/loss/draw counters
function updateCounters() {
  playerWinsCounter.textContent = `Player Wins: ${playerWins}`;
  aiWinsCounter.textContent = `AI Wins: ${aiWins}`;
  drawsCounter.textContent = `Draws: ${draws}`;
}

// Check for a winner
function checkWinner(player) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];
  return winCombos.some((combo) => {
    return combo.every((index) => board[index] === player);
  });
}

// Get the best move for AI using Minimax Algorithm
function getBestMove() {
  let bestMove = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = AI;
      let score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

// Minimax Algorithm
function minimax(board, isMaximizing) {
  const winner = checkWinner(PLAYER) ? -1 : checkWinner(AI) ? 1 : 0;
  if (winner !== 0) return winner;

  if (board.every((cell) => cell !== null)) return 0; // Draw

  let bestScore = isMaximizing ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = isMaximizing ? AI : PLAYER;
      let score = minimax(board, !isMaximizing);
      board[i] = null;
      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }
  return bestScore;
}

// Restart the game
restartBtn.addEventListener("click", initBoard);

// New game button functionality
newGameBtn.addEventListener("click", () => {
  // Reset everything and show mode selection
  gameOver = false;
  currentPlayer = PLAYER;
  board = Array(9).fill(null);
  statusMessage.textContent = "Choose your game mode";
  modeSelection.style.display = "block";
  gameBoard.style.display = "none";
  playerWins = aiWins = draws = 0; // Reset counters
  updateCounters();
});

// Mode selection
document.getElementById("single-player-btn").addEventListener("click", () => {
  isMultiplayer = false;
  initBoard();
});

document.getElementById("multiplayer-btn").addEventListener("click", () => {
  isMultiplayer = true;
  initBoard();
});
