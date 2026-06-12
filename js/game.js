class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.players = [];
        this.bots = [];
        this.bullets = [];
        this.currentMap = null;
        this.gameTime = 180; // 3 phút
        this.score = 0;
        this.kills = 0;
        this.isRunning = false;
        this.gameLoop = null;
        
        this.setupCanvas();
        this.setupMobileControls();
        this.init();
    }

    init() {
        window.addEventListener('resize', () => this.setupCanvas());
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    showMapSelection() {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('mapSelection').classList.add('active');
    }

    selectMap(mapType) {
        this.currentMap = new Map(mapType);
        this.startGame();
    }

    startGame() {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('gameScreen').classList.add('active');
        
        // Tạo người chơi
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        
        // Tạo bot
        this.bots = [];
        for (let i = 0; i < 10; i++) {
            this.bots.push(new Bot(Math.random() * this.canvas.width, Math.random() * this.canvas.height));
        }
        
        this.bullets = [];
        this.score = 0;
        this.kills = 0;
        this.gameTime = 180;
        this.isRunning = true;
        
        this.updateUI();
        this.gameLoop = requestAnimationFrame(() => this.update());
        this.startTimer();
    }

    update() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Vẽ map
        if (this.currentMap) {
            this.currentMap.draw(this.ctx);
        }
        
        // Cập nhật và vẽ người chơi
        if (this.player) {
            this.player.update();
            this.player.draw(this.ctx);
        }
        
        // Cập nhật và vẽ bot
        this.bots = this.bots.filter(bot => bot.isAlive);
        this.bots.forEach(bot => {
            bot.update(this.player);
            bot.draw(this.ctx);
        });
        
        // Cập nhật đạn
        this.bullets = this.bullets.filter(bullet => bullet.isActive);
        this.bullets.forEach(bullet => {
            bullet.update();
            bullet.draw(this.ctx);
        });
        
        // Kiểm tra va chạm
        this.checkCollisions();
        
        this.gameLoop = requestAnimationFrame(() => this.update());
    }

    shoot(x, y, angle) {
        if (this.bullets.length < 20) { // Giới hạn đạn
            this.bullets.push(new Bullet(x, y, angle));
        }
    }

    checkCollisions() {
        // Kiểm tra đạn của người chơi va chạm với bot
        this.bullets.forEach(bullet => {
            if (bullet.owner === 'player') {
                this.bots.forEach(bot => {
                    if (this.checkBulletHit(bullet, bot)) {
                        bot.takeDamage(25);
                        bullet.isActive = false;
                        if (!bot.isAlive) {
                            this.score += 100;
                            this.kills++;
                            this.updateUI();
                        }
                    }
                });
            }
        });
        
        // Kiểm tra đạn của bot va chạm với người chơi
        this.bullets.forEach(bullet => {
            if (bullet.owner === 'bot' && this.player) {
                if (this.checkBulletHit(bullet, this.player)) {
                    this.player.takeDamage(10);
                    bullet.isActive = false;
                    this.updateUI();
                    if (!this.player.isAlive) {
                        this.gameOver();
                    }
                }
            }
        });
    }

    checkBulletHit(bullet, target) {
        const dx = bullet.x - target.x;
        const dy = bullet.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < target.radius + bullet.radius;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.gameTime--;
            document.getElementById('timerText').textContent = `${Math.floor(this.gameTime / 60)}:${(this.gameTime % 60).toString().padStart(2, '0')}`;
            
            if (this.gameTime <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    updateUI() {
        if (this.player) {
            document.getElementById('healthText').textContent = this.player.health;
            document.getElementById('healthFill').style.width = `${this.player.health}%`;
        }
        document.getElementById('scoreText').textContent = this.score;
        document.getElementById('killsText').textContent = this.kills;
    }

    gameOver() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        cancelAnimationFrame(this.gameLoop);
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalKills').textContent = this.kills;
        document.getElementById('finalTime').textContent = `${Math.floor((180 - this.gameTime) / 60)}:${((180 - this.gameTime) % 60).toString().padStart(2, '0')}`;
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('gameOver').classList.add('active');
    }

    restartGame() {
        this.startGame();
    }

    backToMenu() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        if (this.gameLoop) cancelAnimationFrame(this.gameLoop);
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('mainMenu').classList.add('active');
    }

    setupMobileControls() {
        // Joystick
        const joystick = document.getElementById('joystick');
        const knob = document.getElementById('joystickKnob');
        let joystickActive = false;
        
        joystick.addEventListener('touchstart', (e) => {
            joystickActive = true;
            this.handleJoystick(e, knob, joystick);
        });
        
        joystick.addEventListener('touchmove', (e) => {
            if (joystickActive) this.handleJoystick(e, knob, joystick);
        });
        
        joystick.addEventListener('touchend', () => {
            joystickActive = false;
            knob.style.transform = 'translate(-50%, -50%)';
            if (this.player) {
                this.player.moveDirection = { x: 0, y: 0 };
            }
        });
        
        // Shoot button
        document.getElementById('shootButton').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.player && this.isRunning) {
                const angle = Math.atan2(
                    this.player.y - this.canvas.height/2,
                    this.player.x - this.canvas.width/2
                );
                this.shoot(this.player.x, this.player.y, angle);
            }
        });
        
        // Special button
        document.getElementById('specialButton').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.player && this.isRunning) {
                // Tạo vụ nổ ong nham
                this.createExplosion();
            }
        });
    }

    handleJoystick(e, knob, joystick) {
        const touch = e.touches[0];
        const rect = joystick.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = rect.width / 2 - 25;
        
        if (distance > maxDistance) {
            dx = (dx / distance) * maxDistance;
            dy = (dy / distance) * maxDistance;
        }
        
        knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        
        if (this.player) {
            this.player.moveDirection = {
                x: dx / maxDistance,
                y: dy / maxDistance
            };
        }
    }

    createExplosion() {
        // Tạo hiệu ứng ong nham (nổ lan)
        const explosionRadius = 150;
        this.bots.forEach(bot => {
            const dx = bot.x - this.player.x;
            const dy = bot.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < explosionRadius) {
                bot.takeDamage(50);
                if (!bot.isAlive) {
                    this.score += 150;
                    this.kills++;
                }
            }
        });
        
        // Hiệu ứng hình ảnh
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, explosionRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
        this.ctx.fill();
        
        this.updateUI();
    }
}

// Khởi tạo game
const game = new Game();
