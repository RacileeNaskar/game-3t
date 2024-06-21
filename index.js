const board = document.querySelector('.board');
const undoButton = document.getElementById('undoButton');
const startButton = document.getElementById('startButton');
const singlePlayerModeCheckbox = document.getElementById('singlePlayerMode');
const playerXNameInput = document.getElementById('playerXName');
const playerONameInput = document.getElementById('playerOName');
const statusDisplay = document.querySelector('.status');

let currentPlayer = 'X';
let playerXName = 'Player X';
let playerOName = 'Player O';
let winner = null;
let cells = [];
const history = [];
let singlePlayerMode = false;
let boardSize = 3; // Default to 3x3

function checkWinner() {
  const winningConditions = getWinningConditions();

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      highlightWinningCells(condition);
      return cells[a];
    }
  }

  return null;
}

function getWinningConditions() {
  let conditions = [];

  // Rows
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(i * boardSize + j);
    }
    conditions.push(row);
  }

  // Columns
  for (let i = 0; i < boardSize; i++) {
    let col = [];
    for (let j = 0; j < boardSize; j++) {
      col.push(j * boardSize + i);
    }
    conditions.push(col);
  }

  // Diagonals
  let diag1 = [];
  let diag2 = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
    diag2.push(i * boardSize + (boardSize - 1 - i));
  }
  conditions.push(diag1, diag2);

  return conditions;
}

function handleCellClick(index) {
  if (winner || cells[index]) return;

  history.push({ index, player: currentPlayer });
  cells[index] = currentPlayer;
  render();

  winner = checkWinner();

  if (winner) {
    setTimeout(() => {
      alert(`Player ${winner === 'X' ? playerXName : playerOName} wins!`);
      resetGame();
    }, 100);
  } else if (!cells.includes(null)) {
    setTimeout(() => {
      alert("It's a tie!");
      resetGame();
    }, 100);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

    if (singlePlayerMode && currentPlayer === 'O') {
      setTimeout(makeAIMove, 500);
    }
  }
}

function makeAIMove() {
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i]) {
      handleCellClick(i);
      break;
    }
  }
}

function undoMove() {
  if (history.length === 0) return;

  const lastMove = history.pop();
  cells[lastMove.index] = null;
  currentPlayer = lastMove.player;
  winner = null;
  render();
  updateStatus();
}

function updateStatus() {
  statusDisplay.textContent = `Current Player: ${currentPlayer === 'X' ? playerXName : playerOName}`;
}

function render() {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
  cells.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = value || '';
    if (value) cell.classList.add(value.toLowerCase());
    cell.addEventListener('click', () => handleCellClick(index));
    board.appendChild(cell);
  });
}

function resetGame() {
  cells = Array.from({ length: boardSize * boardSize }).fill(null);
  currentPlayer = 'X';
  winner = null;
  history.length = 0;
  render();
  updateStatus();
}

function highlightWinningCells(condition) {
  condition.forEach(index => {
    board.children[index].classList.add('win');
  });
}

startButton.addEventListener('click', () => {
  playerXName = playerXNameInput.value || 'Player X';
  playerOName = singlePlayerMode ? 'Computer' : (playerONameInput.value || 'Player O');
  playerONameInput.disabled = singlePlayerMode;
  resetGame();
});

singlePlayerModeCheckbox.addEventListener('change', (event) => {
  singlePlayerMode = event.target.checked;
  playerONameInput.disabled = singlePlayerMode;
});

undoButton.addEventListener('click', undoMove);

resetGame();
