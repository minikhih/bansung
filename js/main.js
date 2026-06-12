import { Game } from './game.js';
import { UI } from './ui.js';

class Main {
    constructor() {
        this.game = null;
        this.ui = new UI();
        this.init();
    }

    init() {
        // Hiển thị loading
        setTimeout(() => {
            document.getElementById('loading').classList.remove('active');
            document.getElementById('mainMenu').classList.add('active');
        }, 2000);

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Xử lý phím ESC để quay lại menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.game && this.game.isRunning) {
                this.game.pause();
            }
        });

        // Xử lý resize
        window.addEventListener('resize', () => {
            if (this.game) {
                this.game.onResize();
            }
        });
    }

    startSoloMode() {
        this.game = new Game('solo');
        this.game.init();
        this.showScreen('gameScreen');
    }

    showOnlineMenu() {
        this.showScreen('onlineMenu');
    }

    showWeaponSelect() {
        this.showScreen('weaponSelect');
    }

    selectWeapon(weaponType) {
        // Xóa selected class
        document.querySelectorAll('.weapon-card').forEach(card => {
            card.classList.remove('selected');
        });
        // Thêm selected class
        event.currentTarget.classList.add('selected');
        
        // Lưu lựa chọn
        localStorage.setItem('selectedWeapon', weaponType);
        
        // Hiệu ứng âm thanh (nếu có)
        this.playSound('select');
    }

    createRoom() {
        const playerName = document.getElementById('playerName').value || 'Player';
        const mapType = document.getElementById('mapSelect').value;
        
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        document.getElementById('roomCodeDisplay').textContent = roomCode;
        document.getElementById('roomInfo').style.display = 'block';
        
        // Lưu thông tin phòng
        this.roomCode = roomCode;
        this.playerName = playerName;
        this.mapType = mapType;
    }

    joinRoom() {
        const roomCode = document.getElementById('roomCode').value.toUpperCase();
        if (roomCode) {
            // Tham gia phòng qua WebRTC
            this.game = new Game('online', roomCode);
            this.game.init();
            this.showScreen('gameScreen');
        }
    }

    startOnlineGame() {
        if (this.roomCode) {
            this.game = new Game('online', this.roomCode);
            this.game.init();
            this.showScreen('gameScreen');
        }
    }

    showSettings() {
        // Hiển thị cài đặt
        alert('Cài đặt đang phát triển!');
    }

    backToMenu() {
        if (this.game) {
            this.game.destroy();
            this.game = null;
        }
        this.showScreen('mainMenu');
    }

    restartGame() {
        if (this.game) {
            this.game.destroy();
        }
        this.startSoloMode();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    playSound(type) {
        // Implement sound effects
        console.log('Playing sound:', type);
    }
}

// Khởi tạo game
window.game = new Main();
