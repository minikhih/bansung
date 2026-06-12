export class Game {
    constructor(mode, roomCode = null) {
        this.mode = mode; // 'solo' hoặc 'online'
        this.roomCode = roomCode;
        this.isRunning = false;
        this.isPaused = false;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.players = [];
        this.bots = [];
        this.bullets = [];
        this.effects = [];
        
        this.score = 0;
        this.kills = 0;
        this.deaths = 0;
        
        this.clock = new THREE.Clock();
        
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupMap();
        
        if (this.mode === 'solo') {
            this.createPlayer();
            this.createBots(10);
        } else {
            this.setupNetworking();
        }
        
        this.isRunning = true;
        this.animate();
        
        // Hiển thị HUD
        this.updateHUD();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    }

    setupLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x404060);
        this.scene.add(ambient);
        
        // Directional light (mặt trời)
        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(50, 100, 50);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        this.scene.add(sun);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);
    }

    setupControls() {
        // Keyboard
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
        // Mouse
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Click to shoot
        window.addEventListener('click', () => {
            if (this.isRunning && this.player) {
                this.shoot();
            }
        });
        
        // Mobile controls
        this.setupMobileControls();
    }

    setupMobileControls() {
        // Joystick move
        const joystickMove = document.getElementById('joystickMove');
        const moveKnob = document.getElementById('joystickMoveKnob');
        
        // ... Setup joystick events
        
        // Shoot button
        document.getElementById('shootBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.shoot();
        });
        
        // Reload
        document.getElementById('reloadBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.player.reload();
        });
    }

    setupMap() {
        // Sử dụng Map class
        this.map = new Map3D(this.scene);
        this.map.createCityMap();
    }

    createPlayer() {
        this.player = new Player3D(this.scene, this.camera);
        this.players.push(this.player);
        
        // Set weapon
        const weaponType = localStorage.getItem('selectedWeapon') || 'rifle';
        this.player.setWeapon(weaponType);
    }

    createBots(count) {
        for (let i = 0; i < count; i++) {
            const bot = new Bot3D(
                this.scene,
                Math.random() * 80 - 40,
                0,
                Math.random() * 80 - 40
            );
            bot.setAI(this);
            this.bots.push(bot);
        }
    }

    setupNetworking() {
        // WebRTC implementation
        this.peer = new SimplePeer({
            initiator: !this.roomCode,
            trickle: false
        });
        
        // Socket.io for signaling
        this.socket = io('https://your-server.com');
        
        // ... Networking setup
    }

    shoot() {
        if (!this.player || !this.player.canShoot()) return;
        
        const bullet = this.player.shoot();
        if (bullet) {
            this.bullets.push(bullet);
            this.createShootEffect(bullet.position);
        }
    }

    createShootEffect(position) {
        // Muzzle flash
        const flash = new THREE.PointLight(0xffaa00, 2, 5);
        flash.position.copy(position);
        this.scene.add(flash);
        
        setTimeout(() => {
            this.scene.remove(flash);
        }, 50);
        
        // Particle effect
        const particles = new THREE.Group();
        for (let i = 0; i < 10; i++) {
            const geometry = new THREE.SphereGeometry(0.05);
            const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            particles.add(particle);
        }
        this.scene.add(particles);
        this.effects.push({ object: particles, life: 30 });
    }

    createExplosion(position, color = 0xff4400) {
        // Vụ nổ 3D
        const explosionGeometry = new THREE.SphereGeometry(2, 32, 32);
        const explosionMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
        explosion.position.copy(position);
        this.scene.add(explosion);
        
        this.effects.push({
            object: explosion,
            life: 20,
            update: (obj) => {
                obj.scale.multiplyScalar(1.1);
                obj.material.opacity -= 0.04;
            }
        });
    }

    checkCollisions() {
        // Bullet collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            let hit = false;
            
            // Check against bots
            if (bullet.owner === 'player') {
                for (const bot of this.bots) {
                    if (bot.isAlive && this.checkHit(bullet, bot)) {
                        bot.takeDamage(bullet.damage);
                        this.createHitEffect(bullet.position);
                        
                        if (!bot.isAlive) {
                            this.score += 100;
                            this.kills++;
                            this.createExplosion(bot.position);
                            this.addKillMessage('Bạn', bot.name);
                        }
                        
                        hit = true;
                        break;
                    }
                }
            }
            
            // Check against player
            if (bullet.owner === 'bot') {
                if (this.player.isAlive && this.checkHit(bullet, this.player)) {
                    this.player.takeDamage(bullet.damage);
                    this.createHitEffect(bullet.position);
                    
                    if (!this.player.isAlive) {
                        this.deaths++;
                        this.gameOver();
                    }
                    
                    hit = true;
                }
            }
            
            if (hit) {
                this.scene.remove(bullet.mesh);
                this.bullets.splice(i, 1);
            }
        }
    }

    checkHit(bullet, target) {
        const distance = bullet.mesh.position.distanceTo(target.mesh.position);
        return distance < 1.5;
    }

    createHitEffect(position) {
        // Máu particle
        const particles = new THREE.Group();
        for (let i = 0; i < 15; i++) {
            const geometry = new THREE.SphereGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                Math.random() * 5,
                (Math.random() - 0.5) * 5
            );
            particles.add(particle);
        }
        this.scene.add(particles);
        this.effects.push({ object: particles, life: 20 });
    }

    addKillMessage(killer, victim) {
        const feed = document.getElementById('killFeed');
        const message = document.createElement('div');
        message.className = 'kill-message';
        message.textContent = `${killer} 💀 ${victim}`;
        feed.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    animate() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update player
        if (this.player) {
            this.player.update(this.keys, this.mouse, delta);
        }
        
        // Update bots
        this.bots.forEach(bot => bot.update(delta));
        
        // Update bullets
        this.bullets.forEach(bullet => bullet.update(delta));
        
        // Update effects
        this.effects = this.effects.filter(effect => {
            effect.life--;
            if (effect.update) {
                effect.update(effect.object);
            }
            if (effect.life <= 0) {
                this.scene.remove(effect.object);
                return false;
            }
            return true;
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Update HUD
        this.updateHUD();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }

    updateHUD() {
        if (this.player) {
            document.getElementById('healthText').textContent = this.player.health;
            document.getElementById('healthFill').style.width = `${this.player.health}%`;
            document.getElementById('shieldText').textContent = this.player.shield;
            document.getElementById('shieldFill').style.width = `${this.player.shield}%`;
            
            if (this.player.currentWeapon) {
                document.getElementById('currentAmmo').textContent = this.player.currentWeapon.ammo;
                document.getElementById('maxAmmo').textContent = this.player.currentWeapon.maxAmmo;
                document.getElementById('weaponIcon').textContent = this.player.currentWeapon.icon;
                document.getElementById('weaponName').textContent = this.player.currentWeapon.name;
            }
        }
        
        document.getElementById('scoreText').textContent = this.score;
        document.getElementById('killsText').textContent = this.kills;
    }

    gameOver() {
        this.isRunning = false;
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalKills').textContent = this.kills;
        document.getElementById('finalDeaths').textContent = this.deaths;
        document.getElementById('finalAccuracy').textContent = 
            Math.round((this.kills / Math.max(1, this.bullets.length)) * 100) + '%';
        
        document.getElementById('gameOverTitle').textContent = 
            this.player.isAlive ? '🏆 CHIẾN THẮNG!' : '💀 GAME OVER';
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('gameOver').classList.add('active');
    }

    pause() {
        this.isPaused = !this.isPaused;
    }

    destroy() {
        this.isRunning = false;
        this.scene = null;
        this.players = [];
        this.bots = [];
        this.bullets = [];
        this.effects = [];
        
        const container = document.getElementById('gameContainer');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    onResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}
