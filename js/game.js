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
        this.renderer
