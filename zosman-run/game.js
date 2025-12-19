class ZosmanRun {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        
        // ゲーム設定
        this.tileSize = 20;
        this.cols = this.canvas.width / this.tileSize;
        this.rows = this.canvas.height / this.tileSize;
        
        // プレイヤー
        this.player = {
            x: 1,
            y: 1,
            direction: 'right'
        };
        
        // ゲーム状態
        this.score = 0;
        this.dots = [];
        this.enemies = [];
        this.gameRunning = true;
        
        this.initializeGame();
        this.setupControls();
        this.gameLoop();
    }
    
    initializeGame() {
        // 迷路の作成
        this.maze = this.createMaze();
        
        // ドットの配置
        this.placeDots();
        
        // 敵の配置
        this.placeEnemies();
        
        this.gameRunning = true;
    }
    
    createMaze() {
        const maze = [];
        for (let y = 0; y < this.rows; y++) {
            maze[y] = [];
            for (let x = 0; x < this.cols; x++) {
                // 外壁
                if (x === 0 || x === this.cols - 1 || y === 0 || y === this.rows - 1) {
                    maze[y][x] = 1;
                }
                // 内部の壁（より複雑なパターン）
                else if ((x % 6 === 0 && y % 4 === 0) || 
                         (x % 8 === 4 && y % 6 === 3) ||
                         (x % 10 === 2 && y % 8 === 5)) {
                    maze[y][x] = 1;
                } else {
                    maze[y][x] = 0;
                }
            }
        }
        
        // プレイヤーの開始位置を確保
        maze[1][1] = 0;
        maze[1][2] = 0;
        maze[2][1] = 0;
        
        return maze;
    }
    
    placeDots() {
        this.dots = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.maze[y][x] === 0 && !(x === 1 && y === 1)) {
                    // 特別なドット（大きなドット）をランダムに配置
                    const isSpecial = Math.random() < 0.05;
                    this.dots.push({ x, y, special: isSpecial });
                }
            }
        }
    }
    
    placeEnemies() {
        this.enemies = [];
        const enemyPositions = [
            { x: this.cols - 2, y: this.rows - 2 },
            { x: this.cols - 2, y: 2 },
            { x: 2, y: this.rows - 2 },
            { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) }
        ];
        
        enemyPositions.forEach((pos, index) => {
            if (this.maze[pos.y] && this.maze[pos.y][pos.x] === 0) {
                this.enemies.push({
                    x: pos.x,
                    y: pos.y,
                    direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)],
                    color: ['#ff0000', '#ff8800', '#ff00ff', '#00ffff'][index % 4]
                });
            }
        });
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.movePlayer(0, -1, 'up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.movePlayer(0, 1, 'down');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.movePlayer(-1, 0, 'left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.movePlayer(1, 0, 'right');
                    break;
                case ' ':
                    e.preventDefault();
                    if (!this.gameRunning) {
                        this.resetGame();
                    }
                    break;
            }
        });
    }
    
    movePlayer(dx, dy, direction) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        if (this.isValidMove(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
            this.player.direction = direction;
            
            // ドットの収集
            this.collectDot();
            
            // 敵との衝突チェック
            this.checkEnemyCollision();
        }
    }
    
    isValidMove(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows && this.maze[y][x] === 0;
    }
    
    collectDot() {
        const dotIndex = this.dots.findIndex(dot => 
            dot.x === this.player.x && dot.y === this.player.y
        );
        
        if (dotIndex !== -1) {
            const dot = this.dots[dotIndex];
            this.dots.splice(dotIndex, 1);
            
            // 特別なドットは50点、通常は10点
            const points = dot.special ? 50 : 10;
            this.score += points;
            this.scoreElement.textContent = this.score;
            
            // 全てのドットを収集したらゲームクリア
            if (this.dots.length === 0) {
                this.gameRunning = false;
                setTimeout(() => {
                    alert('🎉 ゲームクリア！スコア: ' + this.score + '\nスペースキーでリスタート');
                }, 100);
            }
        }
    }
    
    checkEnemyCollision() {
        const collision = this.enemies.some(enemy => 
            enemy.x === this.player.x && enemy.y === this.player.y
        );
        
        if (collision) {
            this.gameRunning = false;
            setTimeout(() => {
                alert('💀 ゲームオーバー！スコア: ' + this.score + '\nスペースキーでリスタート');
            }, 100);
        }
    }
    
    moveEnemies() {
        if (!this.gameRunning) return;
        
        this.enemies.forEach(enemy => {
            const directions = ['up', 'down', 'left', 'right'];
            const moves = {
                up: { dx: 0, dy: -1 },
                down: { dx: 0, dy: 1 },
                left: { dx: -1, dy: 0 },
                right: { dx: 1, dy: 0 }
            };
            
            // プレイヤーに向かう簡単なAI
            const playerDx = this.player.x - enemy.x;
            const playerDy = this.player.y - enemy.y;
            
            if (Math.random() < 0.3) { // 30%の確率でプレイヤーを追跡
                if (Math.abs(playerDx) > Math.abs(playerDy)) {
                    enemy.direction = playerDx > 0 ? 'right' : 'left';
                } else {
                    enemy.direction = playerDy > 0 ? 'down' : 'up';
                }
            } else if (Math.random() < 0.1) { // 10%の確率でランダム方向転換
                enemy.direction = directions[Math.floor(Math.random() * directions.length)];
            }
            
            const move = moves[enemy.direction];
            const newX = enemy.x + move.dx;
            const newY = enemy.y + move.dy;
            
            if (this.isValidMove(newX, newY)) {
                enemy.x = newX;
                enemy.y = newY;
            } else {
                // 壁にぶつかったら方向転換
                enemy.direction = directions[Math.floor(Math.random() * directions.length)];
            }
        });
    }
    
    resetGame() {
        this.player.x = 1;
        this.player.y = 1;
        this.player.direction = 'right';
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.initializeGame();
    }
    
    draw() {
        // 画面をクリア
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 迷路を描画
        this.ctx.fillStyle = '#0066ff';
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.maze[y][x] === 1) {
                    this.ctx.fillRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }
        
        // ドットを描画
        this.dots.forEach(dot => {
            if (dot.special) {
                // 特別なドット（大きくて光る）
                this.ctx.fillStyle = '#ffff00';
                this.ctx.beginPath();
                this.ctx.arc(
                    dot.x * this.tileSize + this.tileSize / 2,
                    dot.y * this.tileSize + this.tileSize / 2,
                    6,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
                
                // 光る効果
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(
                    dot.x * this.tileSize + this.tileSize / 2,
                    dot.y * this.tileSize + this.tileSize / 2,
                    3,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            } else {
                // 通常のドット
                this.ctx.fillStyle = '#ffff00';
                this.ctx.beginPath();
                this.ctx.arc(
                    dot.x * this.tileSize + this.tileSize / 2,
                    dot.y * this.tileSize + this.tileSize / 2,
                    3,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        });
        
        // プレイヤーを描画（パックマン風）
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        
        const centerX = this.player.x * this.tileSize + this.tileSize / 2;
        const centerY = this.player.y * this.tileSize + this.tileSize / 2;
        const radius = this.tileSize / 2 - 2;
        
        // 口の方向を設定
        let startAngle = 0;
        let endAngle = Math.PI * 2;
        
        switch(this.player.direction) {
            case 'right':
                startAngle = 0.2 * Math.PI;
                endAngle = 1.8 * Math.PI;
                break;
            case 'left':
                startAngle = 1.2 * Math.PI;
                endAngle = 0.8 * Math.PI;
                break;
            case 'up':
                startAngle = 1.7 * Math.PI;
                endAngle = 1.3 * Math.PI;
                break;
            case 'down':
                startAngle = 0.7 * Math.PI;
                endAngle = 0.3 * Math.PI;
                break;
        }
        
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.lineTo(centerX, centerY);
        this.ctx.fill();
        
        // 敵を描画
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.beginPath();
            this.ctx.arc(
                enemy.x * this.tileSize + this.tileSize / 2,
                enemy.y * this.tileSize + this.tileSize / 2,
                this.tileSize / 2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // 敵の目を描画
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(
                enemy.x * this.tileSize + 6,
                enemy.y * this.tileSize + 6,
                3, 3
            );
            this.ctx.fillRect(
                enemy.x * this.tileSize + 11,
                enemy.y * this.tileSize + 6,
                3, 3
            );
        });
        
        // ゲームオーバー時の表示
        if (!this.gameRunning) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '36px Arial';
            this.ctx.textAlign = 'center';
            
            if (this.dots.length === 0) {
                this.ctx.fillText('ゲームクリア！', this.canvas.width / 2, this.canvas.height / 2 - 20);
            } else {
                this.ctx.fillText('ゲームオーバー', this.canvas.width / 2, this.canvas.height / 2 - 20);
            }
            
            this.ctx.font = '18px Arial';
            this.ctx.fillText('スペースキーでリスタート', this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
    }
    
    gameLoop() {
        this.moveEnemies();
        this.draw();
        setTimeout(() => this.gameLoop(), 150);
    }
}

// ゲーム開始
window.addEventListener('load', () => {
    new ZosmanRun();
});