/**
 * Ultra-Optimized Petals Physics Engine
 * Uses pre-rendered offscreen sprite canvases and GPU-accelerated drawImage()
 * Zero garbage collection, zero runtime gradients, zero shadowBlur.
 */
class PetalsSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.petals = [];
        this.maxPetals = parseInt(localStorage.getItem('tet-petal-density') || '35', 10);
        this.mode = 'all'; // 'mai', 'dao', 'all'
        this.isRunning = false;
        this.wind = 0.3;
        this.targetWind = 0.3;
        this.animFrameId = null;

        // Pre-render sprite textures
        this.sprites = this.createPetalSprites();

        this.resize();
        this.resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.resize(), 120);
        }, { passive: true });

        // Throttle mousemove for wind
        let lastMove = 0;
        window.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - lastMove > 40) {
                lastMove = now;
                const centerX = window.innerWidth / 2;
                this.targetWind = ((e.clientX - centerX) / centerX) * 1.2;
            }
        }, { passive: true });

        // Pause when tab is inactive to save 100% CPU/GPU
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    createPetalSprites() {
        const sprites = { mai: [], dao: [] };
        const sizes = [16, 22, 28]; // 3 scale sizes

        sizes.forEach(size => {
            // Hoa Mai Vàng
            const canvasMai = document.createElement('canvas');
            canvasMai.width = size * 2;
            canvasMai.height = size * 2;
            const ctxM = canvasMai.getContext('2d');
            this.drawSinglePetalShape(ctxM, size, size, size, '#FF8C00', '#FFD700', '#FFFDE7');
            sprites.mai.push({ canvas: canvasMai, size: size });

            // Hoa Đào Hồng
            const canvasDao = document.createElement('canvas');
            canvasDao.width = size * 2;
            canvasDao.height = size * 2;
            const ctxD = canvasDao.getContext('2d');
            this.drawSinglePetalShape(ctxD, size, size, size, '#C2185B', '#FF80AB', '#FFF0F5');
            sprites.dao.push({ canvas: canvasDao, size: size });
        });

        return sprites;
    }

    drawSinglePetalShape(ctx, cx, cy, size, colCenter, colMain, colEdge) {
        ctx.save();
        ctx.translate(cx, cy);

        // Curved petal
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-size * 0.45, -size * 0.4, -size * 0.4, -size, 0, -size);
        ctx.bezierCurveTo(size * 0.4, -size, size * 0.45, -size * 0.4, 0, 0);

        const grad = ctx.createLinearGradient(0, 0, 0, -size);
        grad.addColorStop(0, colCenter);
        grad.addColorStop(0.35, colMain);
        grad.addColorStop(1, colEdge);

        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle vein
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(0, -size * 0.5, 0, -size * 0.85);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    setMode(mode) {
        this.mode = mode;
        if (mode === 'none') {
            this.stop();
            if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
            return;
        }
        if (!this.isRunning) this.start();
        this.petals.forEach(p => p.reset(this.width, this.height, this.mode, true));
    }

    setFilter(mode) {
        this.setMode(mode);
    }

    setDensity(count) {
        this.maxPetals = Math.max(12, Math.min(80, parseInt(count, 10)));
        localStorage.setItem('tet-petal-density', this.maxPetals);
        if (this.isRunning && this.mode !== 'none') {
            while (this.petals.length < this.maxPetals) {
                this.petals.push(new OptimizedPetal(this.width, this.height, this.mode, this.sprites));
            }
            if (this.petals.length > this.maxPetals) {
                this.petals.length = this.maxPetals;
            }
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        if (this.petals.length === 0) {
            for (let i = 0; i < this.maxPetals; i++) {
                this.petals.push(new OptimizedPetal(this.width, this.height, this.mode, this.sprites));
            }
        }
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    animate() {
        if (!this.isRunning) return;

        // Smooth wind interpolation
        this.wind += (this.targetWind - this.wind) * 0.05;

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.petals.length; i++) {
            const petal = this.petals[i];
            petal.update(this.width, this.height, this.wind);
            petal.draw(this.ctx);
        }

        this.animFrameId = requestAnimationFrame(() => this.animate());
    }
}

class OptimizedPetal {
    constructor(width, height, mode, sprites) {
        this.sprites = sprites;
        this.reset(width, height, mode, true);
    }

    reset(width, height, mode, randomizeY = false) {
        this.x = Math.random() * width;
        this.y = randomizeY ? Math.random() * height : -30;
        this.speedY = 1.0 + Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = 0.02 + Math.random() * 0.025;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = 0.015 + Math.random() * 0.015;

        // Type
        if (mode === 'mai') this.type = 'mai';
        else if (mode === 'dao') this.type = 'dao';
        else this.type = Math.random() > 0.5 ? 'mai' : 'dao';

        // Pick pre-rendered sprite
        const spriteList = this.sprites[this.type];
        const spriteObj = spriteList[Math.floor(Math.random() * spriteList.length)];
        this.spriteCanvas = spriteObj.canvas;
        this.size = spriteObj.size;
    }

    update(width, height, wind) {
        this.swing += this.swingSpeed;
        this.flip += this.flipSpeed;
        this.rotation += this.rotationSpeed;

        this.x += Math.sin(this.swing) * 1.2 + wind + this.speedX;
        this.y += this.speedY;

        if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
            this.reset(width, height, this.type, false);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        const scaleX = Math.cos(this.flip);
        ctx.scale(scaleX, 1);

        // Blazing-fast GPU drawImage
        ctx.drawImage(this.spriteCanvas, -this.size, -this.size);
        ctx.restore();
    }
}

window.PetalsSystem = PetalsSystem;
