class Map {
    constructor(type) {
        this.type = type;
        this.obstacles = [];
        this.generateMap();
    }

    generateMap() {
        switch(this.type) {
            case 'space':
                this.generateSpaceMap();
                break;
            case 'jungle':
                this.generateJungleMap();
                break;
            case 'city':
                this.generateCityMap();
                break;
            case 'desert':
                this.generateDesertMap();
                break;
        }
    }

    generateSpaceMap() {
        // Tạo các hành tinh và tiểu hành tinh
        for (let i = 0; i < 8; i++) {
            this.obstacles.push({
                x: Math.random() * game.canvas.width,
                y: Math.random() * game.canvas.height,
                radius: 30 + Math.random() * 50,
                color: `hsl(${Math.random() * 360}, 50%, 50%)`
            });
        }
    }

    generateJungleMap() {
        // Tạo cây và bụi rậm
        for (let i = 0; i < 15; i++) {
            this.obstacles.push({
                x: Math.random() * game.canvas.width,
                y: Math.random() * game.canvas.height,
                radius: 20 + Math.random() * 30,
                color: '#2d5a27'
            });
        }
    }

    generateCityMap() {
        // Tạo các tòa nhà
        for (let i = 0; i < 10; i++) {
            this.obstacles.push({
                x: Math.random() * game.canvas.width,
                y: Math.random() * game.canvas.height,
                width: 40 + Math.random() * 60,
                height: 80 + Math.random() * 120,
                color: '#555'
            });
        }
    }

    generateDesertMap() {
        // Tạo đụn cát và xương rồng
        for (let i = 0; i < 12; i++) {
            this.obstacles.push({
                x: Math.random() * game.canvas.width,
                y: Math.random() * game.canvas.height,
                radius: 25 + Math.random() * 40,
                color: '#d4a574'
            });
        }
    }

    draw(ctx) {
        // Vẽ nền map
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
        
        // Vẽ chướng ngại vật
        this.obstacles.forEach(obstacle => {
            ctx.fillStyle = obstacle.color;
            ctx.beginPath();
            
            if (obstacle.radius) {
                ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
            } else {
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.stroke();
        });
    }

    getBackgroundColor() {
        switch(this.type) {
            case 'space': return '#0a0a2e';
            case 'jungle': return '#1a3a1a';
            case 'city': return '#2a2a2a';
            case 'desert': return '#3a2a1a';
            default: return '#000';
        }
    }
}
