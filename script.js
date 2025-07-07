const board = [];
let currentPlayer = 'black';

function initBoard() {
  const game = document.getElementById('game');
  game.innerHTML = '';
  for (let y = 0; y < 8; y++) {
    board[y] = [];
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', handleClick);
      game.appendChild(cell);
      board[y][x] = null;
    }
  }
  board[3][3] = 'white';
  board[4][4] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  renderBoard();
}

function renderBoard() {
  document.querySelectorAll('.cell').forEach(cell => {
    const x = cell.dataset.x;
    const y = cell.dataset.y;
    cell.innerHTML = '';
    const piece = board[y][x];
    if (piece) {
      const disc = document.createElement('div');
      disc.className = piece;
      cell.appendChild(disc);
    }
  });
  document.getElementById('turn').textContent = `現在の手番: ${currentPlayer === 'black' ? '黒' : '白'}`;
}

function handleClick(e) {
  const x = +e.currentTarget.dataset.x;
  const y = +e.currentTarget.dataset.y;
  if (isValidMove(x, y, currentPlayer)) {
    makeMove(x, y, currentPlayer);
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    renderBoard();
  }
}

function isValidMove(x, y, player) {
  if (board[y][x]) return false;
  const opponent = player === 'black' ? 'white' : 'black';
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      let nx = x + dx;
      let ny = y + dy;
      let hasOpponentBetween = false;
      while (nx >= 0 && ny >= 0 && nx < 8 && ny < 8 && board[ny][nx] === opponent) {
        nx += dx;
        ny += dy;
        hasOpponentBetween = true;
      }
      if (hasOpponentBetween && nx >= 0 && ny >= 0 && nx < 8 && ny < 8 && board[ny][nx] === player) {
        return true;
      }
    }
  }
  return false;
}

function makeMove(x, y, player) {
  const opponent = player === 'black' ? 'white' : 'black';
  board[y][x] = player;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      let nx = x + dx;
      let ny = y + dy;
      const toFlip = [];
      while (nx >= 0 && ny >= 0 && nx < 8 && ny < 8 && board[ny][nx] === opponent) {
        toFlip.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
      if (toFlip.length && nx >= 0 && ny >= 0 && nx < 8 && ny < 8 && board[ny][nx] === player) {
        toFlip.forEach(([fx, fy]) => {
          board[fy][fx] = player;
        });
      }
    }
  }
}

initBoard();
