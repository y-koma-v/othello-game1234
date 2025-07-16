const board = [];
let currentPlayer = 'black';
let isCpuMode = false;
let isGameActive = true;

function initBoard() {
  const game = document.getElementById('game');
  game.innerHTML = '';
  currentPlayer = 'black';
  isGameActive = true;
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
  if (!isGameActive) return;
  
  const x = +e.currentTarget.dataset.x;
  const y = +e.currentTarget.dataset.y;
  
  if (isValidMove(x, y, currentPlayer)) {
    makeMove(x, y, currentPlayer);
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    renderBoard();
    
    if (checkGameEnd()) return;
    
    // CPU対戦モードで白の番になったらCPUが打つ
    if (isCpuMode && currentPlayer === 'white') {
      setTimeout(cpuMove, 800); // 少し遅延を入れて自然に見せる
    }
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

function hasValidMoves(player) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (isValidMove(x, y, player)) return true;
    }
  }
  return false;
}

function countPieces() {
  let black = 0, white = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] === 'black') black++;
      if (board[y][x] === 'white') white++;
    }
  }
  return { black, white };
}

function checkGameEnd() {
  const hasCurrentPlayerMoves = hasValidMoves(currentPlayer);
  const hasOpponentMoves = hasValidMoves(currentPlayer === 'black' ? 'white' : 'black');
  
  if (!hasCurrentPlayerMoves) {
    if (!hasOpponentMoves) {
      showGameResult();
      return true;
    } else {
      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
      renderBoard();
      
      // パス後もCPUの番なら自動で打つ
      if (isCpuMode && currentPlayer === 'white') {
        setTimeout(cpuMove, 800);
      }
    }
  }
  return false;
}

function showGameResult() {
  const { black, white } = countPieces();
  isGameActive = false;
  let result;
  if (black > white) {
    result = `🎉 黒の勝利！ (黒: ${black}, 白: ${white})`;
  } else if (white > black) {
    result = `🎉 白の勝利！ (黒: ${black}, 白: ${white})`;
  } else {
    result = `🤝 引き分け！ (黒: ${black}, 白: ${white})`;
  }
  document.getElementById('turn').innerHTML = `<strong>${result}</strong>`;
}

// CPU機能
function getValidMoves(player) {
  const moves = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (isValidMove(x, y, player)) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}

function cpuMove() {
  if (!isGameActive || currentPlayer !== 'white') return;
  
  const validMoves = getValidMoves('white');
  if (validMoves.length === 0) return;
  
  // ランダムに手を選ぶ
  const randomIndex = Math.floor(Math.random() * validMoves.length);
  const [x, y] = validMoves[randomIndex];
  
  makeMove(x, y, 'white');
  currentPlayer = 'black';
  renderBoard();
  checkGameEnd();
}

function toggleCpuMode() {
  isCpuMode = !isCpuMode;
  const button = document.getElementById('cpu-toggle');
  button.textContent = isCpuMode ? 'CPU対戦: ON' : 'CPU対戦: OFF';
  button.style.backgroundColor = isCpuMode ? '#4CAF50' : '#f44336';
  initBoard(); // ゲームをリセット
}

initBoard();
