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
        if (!Number.isFinite(this.maxPetals)) this.maxPetals = 35;
        this.maxPetals = Math.max(12, Math.min(80, this.maxPetals));
        const savedMode = localStorage.getItem('tet-petal-mode');
        this.mode = ['all', 'mai', 'dao', 'none'].includes(savedMode) ? savedMode : 'all';
        this.isRunning = false;
        this.wind = 0.3;
        this.targetWind = 0.3;
        this.animFrameId = null;
        this.lastFrameTime = 0;

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
        if (!this.canvas || !this.ctx) return;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        // 1x CSS resolution cuts HiDPI full-screen alpha fillrate by up to 75%
        this.canvas.width = Math.max(1, Math.round(this.width));
        this.canvas.height = Math.max(1, Math.round(this.height));
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    syncPetalPool() {
        const activeMode = this.mode === 'none' ? 'all' : this.mode;
        while (this.petals.length < this.maxPetals) {
            this.petals.push(new OptimizedPetal(this.width, this.height, activeMode, this.sprites));
        }
        if (this.petals.length > this.maxPetals) {
            this.petals.length = this.maxPetals;
        }
    }

    setMode(mode) {
        const validMode = ['all', 'mai', 'dao', 'none'].includes(mode) ? mode : 'all';
        this.mode = validMode;
        try {
            localStorage.setItem('tet-petal-mode', validMode);
        } catch {}
        if (validMode === 'none') {
            this.stop();
            if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
            return;
        }
        this.syncPetalPool();
        this.petals.forEach(p => p.reset(this.width, this.height, this.mode, true));
        if (!this.isRunning && !document.hidden) this.start();
    }

    setFilter(mode) {
        this.setMode(mode);
    }

    setDensity(count) {
        const parsed = parseInt(count, 10);
        if (!Number.isFinite(parsed)) return;
        this.maxPetals = Math.max(12, Math.min(80, parsed));
        try {
            localStorage.setItem('tet-petal-density', String(this.maxPetals));
        } catch {}
        this.syncPetalPool();
    }

    start() {
        if (this.isRunning || this.mode === 'none') return;
        this.isRunning = true;
        this.lastFrameTime = 0;
        this.syncPetalPool();
        this.animFrameId = requestAnimationFrame((t) => this.animate(t));
    }

    stop() {
        this.isRunning = false;
        this.lastFrameTime = 0;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    animate(now = performance.now()) {
        if (!this.isRunning) return;

        this.animFrameId = requestAnimationFrame((t) => this.animate(t));

        // Interleave frames during active scroll (Slot 1) + cap at ~60 FPS with delta-time compensation so petals never freeze
        const canDraw = typeof window.shouldDrawCanvasFrame === 'function'
            ? window.shouldDrawCanvasFrame(now, this.lastFrameTime, 1)
            : (!this.lastFrameTime || (now - this.lastFrameTime) >= 15.2);
        if (!canDraw) return;

        const elapsed = this.lastFrameTime ? (now - this.lastFrameTime) : 16.667;
        this.lastFrameTime = now;
        const dt = Math.min(2.6, elapsed / 16.667);

        // Smooth wind interpolation
        this.wind += (this.targetWind - this.wind) * (0.05 * dt);

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.petals.length; i++) {
            const petal = this.petals[i];
            petal.update(this.width, this.height, this.wind, dt);
            petal.draw(this.ctx);
        }

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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

    update(width, height, wind, dt = 1) {
        this.swing += this.swingSpeed * dt;
        this.flip += this.flipSpeed * dt;
        this.rotation += this.rotationSpeed * dt;

        this.x += (Math.sin(this.swing) * 1.2 + wind + this.speedX) * dt;
        this.y += this.speedY * dt;

        if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
            this.reset(width, height, this.type, false);
        }
    }

    draw(ctx) {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        const scaleX = Math.cos(this.flip);
        ctx.setTransform(cos * scaleX, sin * scaleX, -sin, cos, this.x, this.y);
        ctx.drawImage(this.spriteCanvas, -this.size, -this.size);
    }
}

window.PetalsSystem = PetalsSystem;
