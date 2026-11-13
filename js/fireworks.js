/**
 * Ultra-Spectacular Canvas Fireworks System (60 FPS GPU-Composited)
 * - Multi-Shell Types: Chrysanthemum, Golden Willow, Double Rings, Heart Burst, Strobe Glitter, Crackling Micro-Pops
 * - Shockwave Hào Quang & Sparkling Comet Trails
 * - Multi-Wave Mega Frenzy (Đại Tiệc Pháo Hoa Giao Thừa)
 * - Dynamic Intensity & Density Controls (Thưa - Chuẩn - Đại Tiệc)
 */
class FireworksSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.fireworks = [];
        this.particles = [];
        this.shockwaves = [];
        this.rocketSparks = [];

        // Density level from localStorage: 'low' | 'medium' | 'high'
        this.density = localStorage.getItem('tet-firework-density') || 'high';
        this.updateDensityLimits();

        this.autoLaunchTimer = null;
        this.isRunning = false;
        this.loopActive = false;
        this.idleFrames = 0;
        this.autoFireEnabled = true;
        this.animFrameId = null;
        this.isFrenzyRunning = false;
        this.resizeTimer = null;

        this.colorPalettes = [
            ['#FFD700', '#FF3366', '#FF9900', '#FFF176', '#FFFFFF'], // Imperial Red & Gold
            ['#FF0055', '#FF9900', '#FFEA00', '#00E676', '#00E5FF', '#D500F9'], // Ngũ Sắc Rực Rỡ
            ['#00F5FF', '#00E676', '#76FF03', '#FFFFFF', '#18FFFF'], // Neon Emerald & Cyan
            ['#E040FB', '#7C4DFF', '#536DFE', '#FF4081', '#FFFFFF'], // Tím Hoàng Cung
            ['#FFE082', '#FFD54F', '#FFCA28', '#FFB300', '#FFF9C4', '#FFFFFF'], // Liễu Rủ Hoàng Kim
            ['#FF1744', '#FF5252', '#FF80AB', '#FF4081', '#FFFFFF']  // Hồng Đào Ruby
        ];

        this.resize();
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.resize(), 120);
        }, { passive: true });

        // Auto pause on tab switch to preserve battery & GPU
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    updateDensityLimits() {
        if (this.density === 'low') {
            this.maxParticles = 650;
            this.autoDelayBase = 3200;
            this.autoDelayRandom = 2200;
        } else if (this.density === 'medium') {
            this.maxParticles = 1300;
            this.autoDelayBase = 1800;
            this.autoDelayRandom = 1500;
        } else { // high (Đại tiệc rực rỡ)
            this.maxParticles = 2400;
            this.autoDelayBase = 900;
            this.autoDelayRandom = 1000;
        }
    }

    setDensity(newDensity) {
        this.density = newDensity;
        localStorage.setItem('tet-firework-density', newDensity);
        this.updateDensityLimits();
        if (this.autoLaunchTimer) {
            clearTimeout(this.autoLaunchTimer);
            this.scheduleNextAutoFire();
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.wakeLoop();
        this.scheduleNextAutoFire(1200);
    }

    wakeLoop() {
        this.idleFrames = 0;
        if (this.isRunning && !this.loopActive) {
            this.loopActive = true;
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
        this.loopActive = false;
        if (this.autoLaunchTimer) {
            clearTimeout(this.autoLaunchTimer);
            this.autoLaunchTimer = null;
        }
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    scheduleNextAutoFire(minInitialDelay = 0) {
        if (!this.autoFireEnabled) return;
        const delay = Math.max(minInitialDelay, this.autoDelayBase + Math.random() * this.autoDelayRandom);
        this.autoLaunchTimer = setTimeout(() => {
            if (this.isRunning && this.autoFireEnabled) {
                // If high density, occasionally launch pairs or triplets
                const multiLaunch = this.density === 'high' && Math.random() > 0.45;
                this.launchRandomShell();
                if (multiLaunch) {
                    setTimeout(() => this.launchRandomShell(), 180);
                }
                this.scheduleNextAutoFire();
            }
        }, delay);
    }

    launchRandomShell() {
        const types = ['chrysanthemum', 'willow', 'ring', 'strobe', 'heart'];
        const type = types[Math.floor(Math.random() * types.length)];
        const startX = Math.random() * (this.width - 240) + 120;
        const startY = this.height + 20;
        const destX = startX + (Math.random() * 160 - 80);
        const destY = Math.random() * (this.height * 0.45) + 60;
        const palette = this.colorPalettes[Math.floor(Math.random() * this.colorPalettes.length)];

        this.launchRocket(startX, startY, destX, destY, palette, type);
    }

    launchRocket(startX, startY, destX, destY, palette = null, shellType = 'chrysanthemum', speedBoost = 1) {
        if (this.fireworks.length > 25) return;

        const pal = palette || this.colorPalettes[Math.floor(Math.random() * this.colorPalettes.length)];
        this.fireworks.push(new AdvancedRocket(startX, startY, destX, destY, pal, shellType, speedBoost));
        this.wakeLoop();

        if (window.tetAudio) {
            window.tetAudio.playFireworkLaunch();
        }
    }

    explodeAt(x, y, forcedPalette = null, shellType = 'chrysanthemum', countMultiplier = 1) {
        this.wakeLoop();
        const palette = forcedPalette || this.colorPalettes[Math.floor(Math.random() * this.colorPalettes.length)];
        const availableSlots = this.maxParticles - this.particles.length;
        if (availableSlots < 10) return;

        // Add soft shockwave halo
        this.shockwaves.push(new ShockwaveHalo(x, y, palette[0]));

        let baseCount = 75;
        if (this.density === 'low') baseCount = 45;
        else if (this.density === 'high') baseCount = 110;

        const count = Math.min(availableSlots, Math.floor(baseCount * countMultiplier));

        if (shellType === 'heart') {
            // Heart-shaped parametric burst
            for (let i = 0; i < count; i++) {
                const t = (Math.PI * 2 * i) / count;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                const speed = 0.22 + Math.random() * 0.05;
                this.particles.push(new RichParticle(x, y, palette, hx * speed, hy * speed, 'heart'));
            }
        } else if (shellType === 'ring') {
            // Concentric rings
            const outerCount = Math.floor(count * 0.65);
            const innerCount = count - outerCount;
            for (let i = 0; i < outerCount; i++) {
                const angle = (Math.PI * 2 * i) / outerCount;
                const speed = 4.2 + Math.random() * 0.3;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'ring'));
            }
            const innerPalette = [palette[palette.length - 1], '#FFFFFF'];
            for (let i = 0; i < innerCount; i++) {
                const angle = (Math.PI * 2 * i) / innerCount;
                const speed = 2.1 + Math.random() * 0.3;
                this.particles.push(new RichParticle(x, y, innerPalette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'ring'));
            }
        } else if (shellType === 'willow') {
            // Golden brocade willow with heavy cascading trails
            const willowPalette = ['#FFE082', '#FFD54F', '#FFCA28', '#FFB300', '#FFFFFF'];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5.2 + 1.2;
                this.particles.push(new RichParticle(x, y, willowPalette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'willow'));
            }
        } else if (shellType === 'strobe') {
            // Glitter strobe flashers
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4.6 + 1.4;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'strobe'));
            }
        } else {
            // Classic Chrysanthemum with sparkling tail and cracklers
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.18 - 0.09);
                const speed = Math.random() * 5.0 + 1.6;
                const isCrackler = Math.random() > 0.8;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, isCrackler ? 'crackler' : 'standard'));
            }
        }

        if (window.tetAudio) {
            window.tetAudio.playFireworkExplode();
        }
    }

    /**
     * Choreographed Multi-Wave Mega Frenzy (Đại Tiệc Pháo Hoa Giao Thừa Cực Hoành Tráng)
     * Launches 28-35 shells in timed artistic waves!
     */
    triggerMegaFrenzy() {
        if (this.isFrenzyRunning) return;
        this.isFrenzyRunning = true;

        const frenzyBtn = document.getElementById('btn-fireworks-frenzy');
        if (frenzyBtn) {
            frenzyBtn.classList.add('frenzy-active');
            frenzyBtn.setAttribute('title', 'Đang bắn đại tiệc pháo hoa rực rỡ!');
        }

        const W = this.width;
        const H = this.height;

        // Wave 1 (t = 0): 5 Fan-out barrage across the horizon
        const fanAngles = [-0.32, -0.16, 0, 0.16, 0.32];
        fanAngles.forEach((angle, idx) => {
            const startX = W * 0.5 + (idx - 2) * 50;
            const destX = W * 0.5 + Math.sin(angle) * (W * 0.42);
            const destY = H * 0.32 + Math.cos(angle) * 30;
            const pal = this.colorPalettes[idx % this.colorPalettes.length];
            setTimeout(() => {
                this.launchRocket(startX, H + 10, destX, destY, pal, 'chrysanthemum', 1.15);
            }, idx * 70);
        });

        // Wave 2 (t = 450ms): Criss-cross rockets from left & right sides
        setTimeout(() => {
            // Left to right
            this.launchRocket(80, H + 10, W * 0.42, H * 0.28, this.colorPalettes[0], 'willow');
            this.launchRocket(160, H + 10, W * 0.55, H * 0.22, this.colorPalettes[1], 'ring');
            // Right to left
            this.launchRocket(W - 80, H + 10, W * 0.58, H * 0.28, this.colorPalettes[4], 'willow');
            this.launchRocket(W - 160, H + 10, W * 0.45, H * 0.22, this.colorPalettes[2], 'ring');
        }, 450);

        // Wave 3 (t = 850ms - 2100ms): Rapid-fire volley of high comets & hearts
        let fired = 0;
        const volleyTimer = setInterval(() => {
            const x = Math.random() * (W - 200) + 100;
            const y = Math.random() * (H * 0.4) + 60;
            const types = ['heart', 'strobe', 'willow', 'chrysanthemum', 'ring'];
            const t = types[fired % types.length];
            const p = this.colorPalettes[fired % this.colorPalettes.length];
            this.launchRocket(x + (Math.random() * 80 - 40), H + 10, x, y, p, t, 1.2);
            fired++;
            if (fired >= 14) {
                clearInterval(volleyTimer);
            }
        }, 90);

        // Wave 4 (t = 2400ms): Grand Finale Salvo - 6 giant simultaneous bursts!
        setTimeout(() => {
            const finalePoints = [
                { x: W * 0.16, y: H * 0.32, type: 'willow' },
                { x: W * 0.32, y: H * 0.22, type: 'heart' },
                { x: W * 0.50, y: H * 0.18, type: 'chrysanthemum' },
                { x: W * 0.68, y: H * 0.22, type: 'strobe' },
                { x: W * 0.84, y: H * 0.32, type: 'willow' }
            ];

            finalePoints.forEach(pt => {
                this.launchRocket(pt.x, H + 10, pt.x, pt.y, this.colorPalettes[4], pt.type, 1.35);
            });
        }, 2350);

        // Reset Frenzy state after 4.5 seconds
        setTimeout(() => {
            this.isFrenzyRunning = false;
            if (frenzyBtn) {
                frenzyBtn.classList.remove('frenzy-active');
                frenzyBtn.setAttribute('title', 'Bắn pháo hoa liên hoàn cực đã mắt');
            }
        }, 4500);
    }

    // Backward compatibility with previous triggerFrenzy(count)
    triggerFrenzy(count = 10) {
        this.triggerMegaFrenzy();
    }

    animate() {
        if (!this.isRunning || !this.loopActive) return;

        const hasWork = this.fireworks.length > 0 || this.particles.length > 0 || this.shockwaves.length > 0 || this.rocketSparks.length > 0;
        if (!hasWork) {
            this.idleFrames++;
            if (this.idleFrames > 20) {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.loopActive = false;
                this.animFrameId = null;
                return;
            }
        } else {
            this.idleFrames = 0;
        }

        // Clear canvas with trail fade
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.globalCompositeOperation = 'lighter';

        // 1. Draw Shockwave Halos
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.update();
            sw.draw(this.ctx);
            if (sw.isDead()) {
                this.shockwaves.splice(i, 1);
            }
        }

        // 2. Draw Rocket Sparks (Comet Trail)
        for (let i = this.rocketSparks.length - 1; i >= 0; i--) {
            const sp = this.rocketSparks[i];
            sp.update();
            sp.draw(this.ctx);
            if (sp.isDead()) {
                this.rocketSparks.splice(i, 1);
            }
        }

        // 3. Update & Draw Rockets
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const rocket = this.fireworks[i];
            rocket.update();
            rocket.draw(this.ctx);

            // Spawn sparks behind rocket
            if (Math.random() > 0.3 && this.rocketSparks.length < 200) {
                this.rocketSparks.push(new RocketSpark(rocket.x, rocket.y, rocket.palette[0]));
            }

            if (rocket.hasReached()) {
                this.explodeAt(rocket.x, rocket.y, rocket.palette, rocket.shellType);
                this.fireworks.splice(i, 1);
            }
        }

        // 4. Update & Draw Particles (Batch render)
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw(this.ctx);

            // Handle micro-cracklers popping
            if (p.shouldCrackle && !p.hasCrackled) {
                p.hasCrackled = true;
                if (this.particles.length < this.maxParticles - 10) {
                    for (let c = 0; c < 4; c++) {
                        const ca = Math.random() * Math.PI * 2;
                        const cs = Math.random() * 2.2 + 0.8;
                        this.particles.push(new RichParticle(p.x, p.y, ['#FFF9C4', '#FFFFFF'], Math.cos(ca) * cs, Math.sin(ca) * cs, 'pop'));
                    }
                }
            }

            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }

        this.animFrameId = requestAnimationFrame(() => this.animate());
    }
}

class AdvancedRocket {
    constructor(startX, startY, destX, destY, palette, shellType = 'chrysanthemum', speedBoost = 1) {
        this.x = startX;
        this.y = startY;
        this.prevX = startX;
        this.prevY = startY;
        this.destX = destX;
        this.destY = destY;
        this.palette = palette;
        this.shellType = shellType;
        this.angle = Math.atan2(destY - startY, destX - startX);
        this.speed = (14.5 + Math.random() * 3.5) * speedBoost;
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.speed *= 0.982;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.palette[0] || '#FFE082';
        ctx.lineWidth = 3.2;
        ctx.stroke();

        // Bright rocket head
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
    }

    hasReached() {
        return Math.hypot(this.destX - this.x, this.destY - this.y) <= 20 || this.speed < 2.8 || this.y <= this.destY;
    }
}

class RocketSpark {
    constructor(x, y, color) {
        this.x = x + (Math.random() * 6 - 3);
        this.y = y + (Math.random() * 6 - 3);
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = Math.random() * 2 + 1;
        this.color = color;
        this.alpha = 0.85;
        this.decay = Math.random() * 0.05 + 0.04;
        this.size = Math.random() * 2 + 1.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    isDead() {
        return this.alpha <= 0;
    }
}

class ShockwaveHalo {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 6;
        this.maxRadius = 65 + Math.random() * 30;
        this.alpha = 0.65;
        this.decay = 0.045;
    }

    update() {
        this.radius += (this.maxRadius - this.radius) * 0.22;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    isDead() {
        return this.alpha <= 0 || this.radius >= this.maxRadius - 2;
    }
}

class RichParticle {
    constructor(x, y, palette, vx, vy, type = 'standard') {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.alpha = 1;
        this.tick = Math.random() * Math.PI * 2;

        if (type === 'willow') {
            this.friction = 0.955;
            this.gravity = 0.085;
            this.decay = Math.random() * 0.012 + 0.008; // very long golden trail
            this.size = 2.4;
        } else if (type === 'heart') {
            this.friction = 0.94;
            this.gravity = 0.04;
            this.decay = Math.random() * 0.016 + 0.012;
            this.size = 2.6;
        } else if (type === 'ring') {
            this.friction = 0.95;
            this.gravity = 0.05;
            this.decay = Math.random() * 0.018 + 0.012;
            this.size = 2.5;
        } else if (type === 'strobe') {
            this.friction = 0.94;
            this.gravity = 0.07;
            this.decay = Math.random() * 0.018 + 0.012;
            this.size = 2.8;
        } else if (type === 'pop') {
            this.friction = 0.92;
            this.gravity = 0.08;
            this.decay = 0.04;
            this.size = 1.6;
        } else { // standard / crackler
            this.friction = 0.945;
            this.gravity = 0.075;
            this.decay = Math.random() * 0.02 + 0.013;
            this.size = 2.5;
        }

        this.shouldCrackle = type === 'crackler';
        this.hasCrackled = false;
        this.lifeTime = 0;
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;

        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.lifeTime++;
        this.tick += 0.35;

        if (this.shouldCrackle && !this.hasCrackled && this.lifeTime > 22) {
            this.shouldCrackle = true;
        } else {
            this.shouldCrackle = false;
        }
    }

    draw(ctx) {
        if (this.alpha <= 0) return;

        let renderAlpha = this.alpha;
        if (this.type === 'strobe') {
            renderAlpha = Math.sin(this.tick) > 0 ? this.alpha : this.alpha * 0.2;
        }

        ctx.globalAlpha = renderAlpha;
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.stroke();

        // Sparkle head
        if (this.type === 'willow' || this.type === 'strobe') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }
    }

    isDead() {
        return this.alpha <= 0;
    }
}

window.FireworksSystem = FireworksSystem;
