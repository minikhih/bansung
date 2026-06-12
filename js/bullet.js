class Bullet {
    constructor(x, y, angle, owner = 'player') {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 8;
        this.radius = 4;
        this.isActive = true;
        this.owner = owner;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Hủy đạn nếu ra khỏi canvas
        if (this.x < 0 || this.x > game.canvas.width || 
            this.y < 0 || this.y > game.canvas.height) {
            this.isActive = false;
        }
    }

    draw(ctx) {
        // Vẽ trail
        this.trail.forEach((pos, index) => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.radius * (index / this.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = this.owner === 'player' ? 
                `rgba(0, 255, 255, ${0.3 * (index / this.trail.length)})` : 
                `rgba(255, 0, 0, ${0.3 * (index / this.trail.length)})`;
            ctx.fill();
        });
        
        // Vẽ đạn chính
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        
        if (this.owner === 'player') {
            gradient.addColorStop(0, '#00ffff');
            gradient.addColorStop(1, '#0088ff');
        } else {
            gradient.addColorStop(0, '#ff4444');
            gradient.addColorStop(1, '#ff0000');
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
