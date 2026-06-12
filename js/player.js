class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 25;
        this.health = 100;
        this.maxHealth = 100;
        this.isAlive = true;
        this.speed = 5;
        this.moveDirection = { x: 0, y: 0 };
        this.color = '#00ff88';
        this.name = 'Bạn';
    }

    update() {
        this.x += this.moveDirection.x * this.speed;
        this.y += this.moveDirection.y * this.speed;
        
        // Giới hạn trong canvas
        this.x = Math.max(this.radius, Math.min(game.canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(game.canvas.height - this.radius, this.y));
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
    }

    draw(ctx) {
        // Vẽ aura
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
        ctx.fill();
        
        // Vẽ thân
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Vẽ vũ khí
        ctx.beginPath();
        ctx.moveTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x + this.radius + 20, this.y);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Vẽ tên
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - this.radius - 15);
        
        // Vẽ thanh máu
        const barWidth = 50;
        const barHeight = 6;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - barWidth/2, this.y - this.radius - 25, barWidth, barHeight);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - barWidth/2, this.y - this.radius - 25, barWidth * (this.health / this.maxHealth), barHeight);
    }
}
