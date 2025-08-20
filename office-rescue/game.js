// ゲームの状態
const gameState = {
  mode: 'salaryman', // 'salaryman' または 'hero'
  playerPosition: { x: 1, y: 1 },
  npcPosition: { x: 8, y: 8 },
  enemyPosition: { x: 5, y: 5 },
  enemyDirection: 1,
  gridSize: 10,
  tileSize: 40,
  isGameOver: false,
  isGameWon: false,
  canTransform: true,
  transformCooldown: 0,
  isNpcRescued: false
};

// マップデータ (0: 床, 1: 壁, 2: 出口)
const mapData = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
];

// DOM要素
let gameBoard;
let currentModeElement;
let transformButton;
let restartButton;
let playerElement;
let npcElement;
let enemyElement;
let mobileControls;
let upButton;
let leftButton;
let rightButton;
let downButton;

// ゲームの初期化
function initGame() {
  gameBoard = document.getElementById('game-board');
  currentModeElement = document.getElementById('current-mode');
  transformButton = document.getElementById('transform-btn');
  restartButton = document.getElementById('restart-btn');
  
  // モバイルコントロールの要素を取得
  upButton = document.getElementById('btn-up');
  leftButton = document.getElementById('btn-left');
  rightButton = document.getElementById('btn-right');
  downButton = document.getElementById('btn-down');
  
  // イベントリスナーの設定
  transformButton.addEventListener('click', transformPlayer);
  restartButton.addEventListener('click', restartGame);
  document.addEventListener('keydown', handleKeyPress);
  
  // モバイルコントロールのイベントリスナー
  if (upButton) {
    upButton.addEventListener('click', () => movePlayer(0, -1));
    leftButton.addEventListener('click', () => movePlayer(-1, 0));
    rightButton.addEventListener('click', () => movePlayer(1, 0));
    downButton.addEventListener('click', () => movePlayer(0, 1));
    
    // タッチイベントのサポート
    upButton.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(0, -1); });
    leftButton.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(-1, 0); });
    rightButton.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(1, 0); });
    downButton.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(0, 1); });
  }
  
  // モバイルデバイスの検出と調整
  adjustForMobileDevice();
  
  // ゲームボードの初期化
  createGameBoard();
  
  // ゲームループの開始
  gameLoop();
}

// モバイルデバイスの検出と調整
function adjustForMobileDevice() {
  // タッチデバイスかどうかを検出
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  
  if (isTouchDevice) {
    // モバイルデバイス向けの調整
    gameState.tileSize = 30; // タイルサイズを小さく
    
    // ゲームボードのサイズ調整
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
      gameBoard.style.width = `${gameState.gridSize * gameState.tileSize}px`;
      gameBoard.style.height = `${gameState.gridSize * gameState.tileSize}px`;
    }
    
    // モバイルコントロールを表示
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
      mobileControls.style.display = 'block';
    }
  }
}

// ゲームボードの作成
function createGameBoard() {
  gameBoard.innerHTML = '';
  gameBoard.style.width = `${gameState.gridSize * gameState.tileSize}px`;
  gameBoard.style.height = `${gameState.gridSize * gameState.tileSize}px`;
  
  // マップの描画
  for (let y = 0; y < gameState.gridSize; y++) {
    for (let x = 0; x < gameState.gridSize; x++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      
      if (mapData[y][x] === 1) {
        tile.classList.add('wall');
      } else if (mapData[y][x] === 0) {
        tile.classList.add('floor');
      } else if (mapData[y][x] === 2) {
        tile.classList.add('exit');
      }
      
      tile.style.left = `${x * gameState.tileSize}px`;
      tile.style.top = `${y * gameState.tileSize}px`;
      tile.style.width = `${gameState.tileSize}px`;
      tile.style.height = `${gameState.tileSize}px`;
      
      gameBoard.appendChild(tile);
    }
  }
  
  // プレイヤーの作成
  playerElement = document.createElement('div');
  playerElement.className = `player ${gameState.mode}`;
  updatePlayerPosition();
  gameBoard.appendChild(playerElement);
  
  // NPCの作成
  npcElement = document.createElement('div');
  npcElement.className = 'npc';
  npcElement.style.left = `${gameState.npcPosition.x * gameState.tileSize + 5}px`;
  npcElement.style.top = `${gameState.npcPosition.y * gameState.tileSize + 5}px`;
  gameBoard.appendChild(npcElement);
  
  // 敵の作成
  enemyElement = document.createElement('div');
  enemyElement.className = 'enemy';
  enemyElement.style.left = `${gameState.enemyPosition.x * gameState.tileSize + 5}px`;
  enemyElement.style.top = `${gameState.enemyPosition.y * gameState.tileSize + 5}px`;
  gameBoard.appendChild(enemyElement);
}

// プレイヤーの位置更新
function updatePlayerPosition() {
  playerElement.style.left = `${gameState.playerPosition.x * gameState.tileSize + 5}px`;
  playerElement.style.top = `${gameState.playerPosition.y * gameState.tileSize + 5}px`;
}

// プレイヤーの移動
function movePlayer(dx, dy) {
  if (gameState.isGameOver) return;
  
  const newX = gameState.playerPosition.x + dx;
  const newY = gameState.playerPosition.y + dy;
  
  // 壁チェック
  if (mapData[newY][newX] === 1) return;
  
  // 移動
  gameState.playerPosition.x = newX;
  gameState.playerPosition.y = newY;
  updatePlayerPosition();
  
  // NPCとの距離チェック - 近くにいれば一緒に移動
  if (Math.abs(gameState.playerPosition.x - gameState.npcPosition.x) <= 1 && 
      Math.abs(gameState.playerPosition.y - gameState.npcPosition.y) <= 1) {
    // NPCを救出状態に
    gameState.isNpcRescued = true;
    
    // ステータスメッセージを更新
    const missionText = document.getElementById('mission-text');
    if (missionText) {
      missionText.textContent = '同僚を救出しました！出口に向かいましょう！';
      missionText.style.color = '#2ecc71';
    }
  }
  
  // NPCが救出されていれば、プレイヤーと一緒に移動
  if (gameState.isNpcRescued) {
    moveNpc();
  }
  
  // 出口チェック
  if (mapData[newY][newX] === 2 && gameState.isNpcRescued) {
    gameWin();
  }
  
  // 敵との接触チェック
  checkEnemyCollision();
}

// NPCの移動（プレイヤーについてくる）
function moveNpc() {
  // NPCの位置をプレイヤーの少し後ろに設定
  const dx = gameState.playerPosition.x - gameState.npcPosition.x;
  const dy = gameState.playerPosition.y - gameState.npcPosition.y;
  
  // NPCの新しい位置を計算（プレイヤーの方向に移動）
  if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
    // プレイヤーとの距離が離れすぎている場合は追いかける
    const moveX = dx !== 0 ? (dx > 0 ? 1 : -1) : 0;
    const moveY = dy !== 0 ? (dy > 0 ? 1 : -1) : 0;
    
    const newX = gameState.npcPosition.x + moveX;
    const newY = gameState.npcPosition.y + moveY;
    
    // 壁チェック
    if (newX >= 0 && newX < gameState.gridSize && 
        newY >= 0 && newY < gameState.gridSize && 
        mapData[newY][newX] !== 1) {
      gameState.npcPosition.x = newX;
      gameState.npcPosition.y = newY;
      
      // NPCの位置を更新
      npcElement.style.left = `${gameState.npcPosition.x * gameState.tileSize + 5}px`;
      npcElement.style.top = `${gameState.npcPosition.y * gameState.tileSize + 5}px`;
    }
  }
}

// プレイヤーの変身
function transformPlayer() {
  if (!gameState.canTransform) return;
  
  if (gameState.mode === 'salaryman') {
    gameState.mode = 'hero';
    currentModeElement.textContent = 'ヒーロー';
    currentModeElement.style.color = '#ff3333';
    playerElement.className = 'player hero';
  } else {
    gameState.mode = 'salaryman';
    currentModeElement.textContent = 'サラリーマン';
    currentModeElement.style.color = '#fff';
    playerElement.className = 'player salaryman';
  }
  
  // クールダウン設定
  gameState.canTransform = false;
  gameState.transformCooldown = 30; // 30フレーム（約0.5秒）
}

// 敵の移動
function moveEnemy() {
  // 敵の移動ロジック（単純な往復）
  if (gameState.enemyPosition.x >= 8) {
    gameState.enemyDirection = -1;
  } else if (gameState.enemyPosition.x <= 2) {
    gameState.enemyDirection = 1;
  }
  
  gameState.enemyPosition.x += gameState.enemyDirection;
  
  enemyElement.style.left = `${gameState.enemyPosition.x * gameState.tileSize + 5}px`;
  enemyElement.style.top = `${gameState.enemyPosition.y * gameState.tileSize + 5}px`;
  
  // 敵との接触チェック
  checkEnemyCollision();
}

// 敵との接触チェック
function checkEnemyCollision() {
  if (gameState.playerPosition.x === gameState.enemyPosition.x && 
      gameState.playerPosition.y === gameState.enemyPosition.y) {
    
    if (gameState.mode === 'hero') {
      // ヒーローモードなら敵を倒す
      gameBoard.removeChild(enemyElement);
      gameState.enemyPosition = { x: -1, y: -1 }; // 画面外に移動
    } else {
      // サラリーマンモードならゲームオーバー
      gameOver();
    }
  }
}

// ゲームオーバー
function gameOver() {
  gameState.isGameOver = true;
  
  const message = document.createElement('div');
  message.className = 'message';
  message.textContent = 'ゲームオーバー！';
  gameBoard.appendChild(message);
}

// ゲームクリア
function gameWin() {
  gameState.isGameWon = true;
  gameState.isGameOver = true;
  
  const message = document.createElement('div');
  message.className = 'message';
  message.textContent = 'ミッション成功！同僚を救出しました！';
  gameBoard.appendChild(message);
}

// ゲームのリスタート
function restartGame() {
  gameState.mode = 'salaryman';
  gameState.playerPosition = { x: 1, y: 1 };
  gameState.npcPosition = { x: 8, y: 8 };
  gameState.enemyPosition = { x: 5, y: 5 };
  gameState.enemyDirection = 1;
  gameState.isGameOver = false;
  gameState.isGameWon = false;
  gameState.canTransform = true;
  gameState.transformCooldown = 0;
  gameState.isNpcRescued = false;
  
  currentModeElement.textContent = 'サラリーマン';
  currentModeElement.style.color = '#fff';
  
  // ミッションテキストをリセット
  const missionText = document.getElementById('mission-text');
  if (missionText) {
    missionText.textContent = '閉じ込められた同僚を救出せよ！';
    missionText.style.color = '#fff';
  }
  
  createGameBoard();
}

// キー入力の処理
function handleKeyPress(event) {
  if (gameState.isGameOver) return;
  
  switch (event.key) {
    case 'ArrowUp':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
      movePlayer(1, 0);
      break;
    case 't':
    case 'T':
      if (gameState.canTransform) {
        transformPlayer();
      }
      break;
  }
}

// ゲームループ
function gameLoop() {
  // 変身クールダウンの更新
  if (!gameState.canTransform) {
    gameState.transformCooldown--;
    if (gameState.transformCooldown <= 0) {
      gameState.canTransform = true;
    }
  }
  
  // 敵の移動（10フレームに1回）
  if (!gameState.isGameOver && frameCount % 10 === 0) {
    moveEnemy();
  }
  
  frameCount++;
  requestAnimationFrame(gameLoop);
}

let frameCount = 0;

// ページ読み込み時にゲームを初期化
window.addEventListener('load', initGame);