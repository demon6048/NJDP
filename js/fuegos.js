window.onload = function () {
    const canvas = document.getElementById('fuegos-artificiales');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    let particles = [];
    let fireworks = [];
    const colors = ['255, 215, 0', '255, 140, 0', '255, 255, 255', '218, 165, 32', '255, 69, 0'];

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = canvas.height * (Math.random() * 0.4 + 0.1); 
            this.speed = Math.random() * 4 + 6; 
            this.angle = Math.atan2(this.targetY - this.y, (this.x + (Math.random() * 150 - 75)) - this.x);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.trail = [];
        }
        update() {
            this.trail.push({x: this.x, y: this.y});
            if(this.trail.length > 5) this.trail.shift();
            this.x += this.vx;
            this.y += this.vy;
            if (this.vy >= 0 || this.y <= this.targetY) {
                createParticles(this.x, this.y, this.color);
                return false; 
            }
            return true; 
        }
        draw() {
            ctx.beginPath();
            if(this.trail.length > 0) {
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                ctx.lineTo(this.x, this.y);
            }
            ctx.strokeStyle = `rgba(${this.color}, 1)`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 18 + 4; 
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.friction = 0.93; 
            this.gravity = 0.07;  
            this.alpha = 1;
            this.decay = Math.random() * 0.012 + 0.008;
            this.trail = [];
        }
        update() {
            this.trail.push({x: this.x, y: this.y});
            if(this.trail.length > 8) this.trail.shift();
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            return this.alpha > 0;
        }
        draw() {
            ctx.beginPath();
            if (this.trail.length > 0) {
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                ctx.lineTo(this.x, this.y);
            }
            ctx.strokeStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.lineWidth = Math.random() * 2 + 0.8;
            ctx.stroke();
        }
    }

    function createParticles(x, y, color) {
        let particleCount = Math.floor(Math.random() * 100 + 120); 
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalCompositeOperation = 'lighter';
        
        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }

        fireworks = fireworks.filter(fw => fw.update());
        fireworks.forEach(fw => fw.draw());

        particles = particles.filter(p => p.update());
        particles.forEach(p => p.draw());

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    animate();
};