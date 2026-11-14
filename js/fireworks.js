/**
 * Ultra-Spectacular Canvas Fireworks System (60 FPS GPU-Composited)
 * - Multi-Shell Types: Chrysanthemum, Golden Willow, Double Rings, Heart Burst,
 *   5-Petal Tết Flower, Starburst, Double Burst, Strobe Glitter, Crackling Micro-Pops
 * - Luminous Explosion Flash, Shockwave Hào Quang & Sparkling Comet Trails
 * - Light & Dark Mode Adaptive Palettes and Blend Modes (vibrant over both themes)
 * - Multi-Wave Mega Frenzy (Đại Tiệc Pháo Hoa Giao Thừa)
 */
class FireworksSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.fireworks = [];
        this.particles = [];
        this.shockwaves = [];
        this.flashes = [];
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

        this.darkPalettes = [
            ['#FFD700', '#FF3366', '#FF9900', '#FFF176', '#FFFFFF'], // Imperial Red & Gold
            ['#FF0055', '#FF9900', '#FFEA00', '#00E676', '#00E5FF', '#D500F9'], // Ngũ Sắc Rực Rỡ
            ['#00F5FF', '#00E676', '#76FF03', '#FFFFFF', '#18FFFF'], // Neon Emerald & Cyan
            ['#E040FB', '#7C4DFF', '#536DFE', '#FF4081', '#FFFFFF'], // Tím Hoàng Cung
            ['#FFE082', '#FFD54F', '#FFCA28', '#FFB300', '#FFF9C4', '#FFFFFF'], // Liễu Rủ Hoàng Kim
            ['#FF1744', '#FF5252', '#FF80AB', '#FF4081', '#FFFFFF']  // Hồng Đào Ruby
        ];

        // Saturated jewel-toned palettes so bursts stay crisp & vivid over Light Mode cards
        this.lightPalettes = [
            ['#DC2626', '#EA580C', '#D97706', '#F59E0B', '#B91C1C'], // Đỏ Son & Hoàng Kim
            ['#E11D48', '#F59E0B', '#059669', '#0284C7', '#7C3AED'], // Ngũ Sắc Rực Rỡ
            ['#0284C7', '#059669', '#0D9488', '#2563EB', '#D97706'], // Ngọc Bích & Thiên Thanh
            ['#9333EA', '#C026D3', '#E11D48', '#4F46E5', '#F59E0B'], // Tím Hoàng Cung
            ['#D97706', '#B45309', '#F59E0B', '#EA580C', '#DC2626'], // Liễu Rủ Hổ Phách
            ['#BE123C', '#E11D48', '#F43F5E', '#D97706', '#9F1239']  // Hồng Đào Đậm Sắc
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

    isLightMode() {
        return typeof document !== 'undefined' && document.body.classList.contains('light-mode');
    }

    getPalettes() {
        return this.isLightMode() ? this.lightPalettes : this.darkPalettes;
    }

    pickPalette(index = null) {
        const list = this.getPalettes();
        if (typeof index === 'number') {
            return list[Math.abs(index) % list.length];
        }
        return list[Math.floor(Math.random() * list.length)];
    }

    updateDensityLimits() {
        if (this.density === 'low') {
            this.maxParticles = 1000;
            this.autoDelayBase = 2100;
            this.autoDelayRandom = 1400;
        } else if (this.density === 'medium') {
            this.maxParticles = 2100;
            this.autoDelayBase = 1100;
            this.autoDelayRandom = 1000;
        } else { // high (Đại tiệc rực rỡ)
            this.maxParticles = 3800;
            this.autoDelayBase = 580;
            this.autoDelayRandom = 640;
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
        // Immediate opening salvo so the sky feels alive right away
        setTimeout(() => {
            if (this.isRunning && this.autoFireEnabled) {
                this.launchRandomShell();
                if (this.density !== 'low') {
                    setTimeout(() => this.launchRandomShell(), 220);
                }
            }
        }, 280);
        this.scheduleNextAutoFire(1100);
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
                this.launchRandomShell();
                if (this.density === 'high') {
                    if (Math.random() > 0.25) {
                        setTimeout(() => this.isRunning && this.launchRandomShell(), 140);
                    }
                    if (Math.random() > 0.55) {
                        setTimeout(() => this.isRunning && this.launchRandomShell(), 310);
                    }
                } else if (this.density === 'medium' && Math.random() > 0.5) {
                    setTimeout(() => this.isRunning && this.launchRandomShell(), 190);
                }
                this.scheduleNextAutoFire();
            }
        }, delay);
    }

    launchRandomShell() {
        const types = ['chrysanthemum', 'willow', 'ring', 'strobe', 'heart', 'flower', 'starburst', 'double_burst'];
        const type = types[Math.floor(Math.random() * types.length)];
        const margin = Math.min(120, this.width * 0.12);
        const startX = Math.random() * Math.max(80, this.width - margin * 2) + margin;
        const startY = this.height + 16;
        const destX = Math.max(60, Math.min(this.width - 60, startX + (Math.random() * 200 - 100)));
        const destY = Math.random() * (this.height * 0.54) + 55;
        const palette = this.pickPalette();

        this.launchRocket(startX, startY, destX, destY, palette, type);
    }

    launchRocket(startX, startY, destX, destY, palette = null, shellType = 'chrysanthemum', speedBoost = 1) {
        if (this.fireworks.length > 36) return;

        const pal = palette || this.pickPalette();
        this.fireworks.push(new AdvancedRocket(startX, startY, destX, destY, pal, shellType, speedBoost));
        this.wakeLoop();

        if (window.tetAudio) {
            window.tetAudio.playFireworkLaunch();
        }
    }

    explodeAt(x, y, forcedPalette = null, shellType = 'chrysanthemum', countMultiplier = 1) {
        this.wakeLoop();
        const palette = forcedPalette || this.pickPalette();
        const availableSlots = this.maxParticles - this.particles.length;
        if (availableSlots < 12) return;

        const isLight = this.isLightMode();

        // Luminous flash + expanding shockwave ring
        this.flashes.push(new ExplosionFlash(x, y, palette[0], isLight));
        this.shockwaves.push(new ShockwaveHalo(x, y, palette[0]));
        if (countMultiplier >= 1.2) {
            this.shockwaves.push(new ShockwaveHalo(x, y, palette[1] || '#FFFFFF', 1.45));
        }

        let baseCount = 92;
        if (this.density === 'low') baseCount = 58;
        else if (this.density === 'high') baseCount = 135;

        const count = Math.min(availableSlots, Math.floor(baseCount * countMultiplier));

        if (shellType === 'heart') {
            // Double-ring Heart parametric burst
            for (let i = 0; i < count; i++) {
                const t = (Math.PI * 2 * i) / count;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                const layer = i % 3 === 0 ? 0.16 : 0.25 + Math.random() * 0.045;
                this.particles.push(new RichParticle(x, y, palette, hx * layer, hy * layer, 'heart'));
            }
        } else if (shellType === 'flower') {
            // 5-petal Tết Peach/Apricot Blossom burst
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const petalFactor = 0.72 + 0.55 * Math.cos(5 * angle);
                const speed = (2.8 + Math.random() * 0.85) * petalFactor * Math.min(1.25, countMultiplier);
                const isCenter = i % 5 === 0;
                const pColors = isCenter ? ['#FFD700', '#F59E0B', '#FFFFFF'] : palette;
                const vScale = isCenter ? 0.42 : 1;
                this.particles.push(new RichParticle(
                    x, y, pColors,
                    Math.cos(angle) * speed * vScale,
                    Math.sin(angle) * speed * vScale,
                    isCenter ? 'strobe' : 'standard'
                ));
            }
        } else if (shellType === 'starburst') {
            // Multi-point sparkling star burst + inner glitter ring
            const points = 7;
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const spike = 0.58 + 0.65 * Math.pow(Math.abs(Math.cos((points * angle) / 2)), 2);
                const speed = (2.6 + Math.random() * 1.1) * spike;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'strobe'));
            }
        } else if (shellType === 'double_burst') {
            // Outer chrysanthemum + inner contrasting crown + cracklers
            const outerCount = Math.floor(count * 0.68);
            const innerCount = count - outerCount;
            const altPalette = this.pickPalette(Math.floor(Math.random() * 6) + 1);
            for (let i = 0; i < outerCount; i++) {
                const angle = (Math.PI * 2 * i) / outerCount + (Math.random() * 0.12 - 0.06);
                const speed = 4.5 + Math.random() * 1.4;
                const isCrackler = Math.random() > 0.72;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, isCrackler ? 'crackler' : 'standard'));
            }
            for (let i = 0; i < innerCount; i++) {
                const angle = (Math.PI * 2 * i) / innerCount;
                const speed = 2.0 + Math.random() * 0.6;
                this.particles.push(new RichParticle(x, y, altPalette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'strobe'));
            }
        } else if (shellType === 'ring') {
            // Triple concentric rings
            const outerCount = Math.floor(count * 0.56);
            const midCount = Math.floor(count * 0.28);
            const innerCount = count - outerCount - midCount;
            for (let i = 0; i < outerCount; i++) {
                const angle = (Math.PI * 2 * i) / outerCount;
                const speed = 4.6 + Math.random() * 0.35;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'ring'));
            }
            const midPalette = [palette[palette.length - 1], isLight ? '#F59E0B' : '#FFFFFF'];
            for (let i = 0; i < midCount; i++) {
                const angle = (Math.PI * 2 * i) / midCount;
                const speed = 2.8 + Math.random() * 0.25;
                this.particles.push(new RichParticle(x, y, midPalette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'strobe'));
            }
            for (let i = 0; i < innerCount; i++) {
                const angle = (Math.PI * 2 * i) / innerCount;
                const speed = 1.4 + Math.random() * 0.2;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'ring'));
            }
        } else if (shellType === 'willow') {
            // Golden brocade willow with heavy cascading trails
            const willowPalette = isLight
                ? ['#B45309', '#D97706', '#F59E0B', '#EA580C', '#DC2626']
                : ['#FFE082', '#FFD54F', '#FFCA28', '#FFB300', '#FFFFFF'];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5.8 + 1.1;
                this.particles.push(new RichParticle(x, y, willowPalette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'willow'));
            }
        } else if (shellType === 'strobe') {
            // Glitter strobe flashers
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5.2 + 1.4;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, 'strobe'));
            }
        } else {
            // Rich Chrysanthemum with shimmering tail and cracklers
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.16 - 0.08);
                const speed = Math.random() * 5.5 + 1.5;
                const isCrackler = Math.random() > 0.72;
                this.particles.push(new RichParticle(x, y, palette, Math.cos(angle) * speed, Math.sin(angle) * speed, isCrackler ? 'crackler' : 'standard'));
            }
        }

        if (window.tetAudio) {
            window.tetAudio.playFireworkExplode();
        }
    }

    /**
     * Choreographed Multi-Wave Mega Frenzy (Đại Tiệc Pháo Hoa Giao Thừa Cực Hoành Tráng)
     * Launches 40+ multi-type shells in timed artistic waves across the screen!
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

        // Wave 1 (t = 0): 7-shell symmetrical fan barrage across the sky
        const fanAngles = [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42];
        fanAngles.forEach((angle, idx) => {
            const startX = W * 0.5 + (idx - 3) * 44;
            const destX = W * 0.5 + Math.sin(angle) * (W * 0.46);
            const destY = H * 0.26 + Math.abs(idx - 3) * 28;
            const pal = this.pickPalette(idx);
            const type = idx === 3 ? 'flower' : idx % 2 === 0 ? 'chrysanthemum' : 'double_burst';
            setTimeout(() => {
                this.launchRocket(startX, H + 10, destX, destY, pal, type, 1.18);
            }, idx * 60);
        });

        // Wave 2 (t = 420ms): 6 criss-crossing comets from both corners
        setTimeout(() => {
            this.launchRocket(60, H + 10, W * 0.36, H * 0.26, this.pickPalette(0), 'willow', 1.15);
            this.launchRocket(140, H + 10, W * 0.52, H * 0.20, this.pickPalette(1), 'ring', 1.2);
            this.launchRocket(220, H + 10, W * 0.65, H * 0.32, this.pickPalette(3), 'flower', 1.1);
            this.launchRocket(W - 60, H + 10, W * 0.64, H * 0.26, this.pickPalette(4), 'willow', 1.15);
            this.launchRocket(W - 140, H + 10, W * 0.48, H * 0.20, this.pickPalette(2), 'ring', 1.2);
            this.launchRocket(W - 220, H + 10, W * 0.35, H * 0.32, this.pickPalette(5), 'starburst', 1.1);
        }, 420);

        // Wave 3 (t = 820ms - 2600ms): Rapid-fire volley of 22 comets across full height & width
        let fired = 0;
        const types = ['heart', 'flower', 'strobe', 'willow', 'double_burst', 'starburst', 'ring', 'chrysanthemum'];
        const volleyTimer = setInterval(() => {
            const x = Math.random() * (W - 160) + 80;
            const y = Math.random() * (H * 0.5) + 55;
            const t = types[fired % types.length];
            const p = this.pickPalette(fired);
            this.launchRocket(x + (Math.random() * 90 - 45), H + 10, x, y, p, t, 1.22);
            fired++;
            if (fired >= 22) {
                clearInterval(volleyTimer);
            }
        }, 82);

        // Wave 4 (t = 2750ms): Grand Finale Salvo - 7 giant simultaneous mega bursts!
        setTimeout(() => {
            const finalePoints = [
                { x: W * 0.12, y: H * 0.34, type: 'willow', pal: 4 },
                { x: W * 0.25, y: H * 0.22, type: 'flower', pal: 5 },
                { x: W * 0.38, y: H * 0.40, type: 'double_burst', pal: 1 },
                { x: W * 0.50, y: H * 0.18, type: 'starburst', pal: 0 },
                { x: W * 0.62, y: H * 0.40, type: 'double_burst', pal: 2 },
                { x: W * 0.75, y: H * 0.22, type: 'heart', pal: 3 },
                { x: W * 0.88, y: H * 0.34, type: 'willow', pal: 4 }
            ];

            finalePoints.forEach(pt => {
                this.launchRocket(pt.x, H + 10, pt.x, pt.y, this.pickPalette(pt.pal), pt.type, 1.38);
            });
        }, 2750);

        // Reset Frenzy state after 4.8 seconds
        setTimeout(() => {
            this.isFrenzyRunning = false;
            if (frenzyBtn) {
                frenzyBtn.classList.remove('frenzy-active');
                frenzyBtn.setAttribute('title', 'Bắn pháo hoa liên hoàn cực đã mắt');
            }
        }, 4800);
    }

    // Backward compatibility with previous triggerFrenzy(count)
    triggerFrenzy(count = 10) {
        this.triggerMegaFrenzy();
    }

    animate() {
        if (!this.isRunning || !this.loopActive) return;

        const hasWork =
            this.fireworks.length > 0 ||
            this.particles.length > 0 ||
            this.shockwaves.length > 0 ||
            this.flashes.length > 0 ||
            this.rocketSparks.length > 0;

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

        const isLight = this.isLightMode();

        // Clear canvas with graceful trail fade
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.28)' : 'rgba(0, 0, 0, 0.19)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Dark mode glows richly with additive blending; Light mode uses crisp alpha compositing so colors stay vibrant over light cards
        this.ctx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

        // 0. Draw Explosion Flashes
        for (let i = this.flashes.length - 1; i >= 0; i--) {
            const fl = this.flashes[i];
            fl.update();
            fl.draw(this.ctx);
            if (fl.isDead()) {
                this.flashes.splice(i, 1);
            }
        }

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
            rocket.draw(this.ctx, isLight);

            // Spawn richer sparks behind rocket
            if (Math.random() > 0.15 && this.rocketSparks.length < 320) {
                this.rocketSparks.push(new RocketSpark(rocket.x, rocket.y, rocket.palette[0]));
            }

            if (rocket.hasReached()) {
                const burstScale = rocket.speedBoost > 1.25 ? 1.35 : 1.08;
                this.explodeAt(rocket.x, rocket.y, rocket.palette, rocket.shellType, burstScale);
                this.fireworks.splice(i, 1);
            }
        }

        // 4. Update & Draw Particles (Batch render)
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw(this.ctx, isLight);

            // Handle micro-cracklers popping mid-air
            if (p.readyToCrackle && !p.hasCrackled) {
                p.hasCrackled = true;
                if (this.particles.length < this.maxParticles - 8) {
                    const crackleColors = isLight ? ['#F59E0B', '#DC2626', '#FFFBEB'] : ['#FFF9C4', '#FFD700', '#FFFFFF'];
                    for (let c = 0; c < 5; c++) {
                        const ca = Math.random() * Math.PI * 2;
                        const cs = Math.random() * 2.5 + 0.9;
                        this.particles.push(new RichParticle(p.x, p.y, crackleColors, Math.cos(ca) * cs, Math.sin(ca) * cs, 'pop'));
                    }
                }
            }

            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }

        this.ctx.globalAlpha = 1;
        this.animFrameId = requestAnimationFrame(() => this.animate());
    }
}

class ExplosionFlash {
    constructor(x, y, color, isLight = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = isLight ? 44 : 62;
        this.alpha = isLight ? 0.42 : 0.72;
        this.decay = 0.075;
    }

    update() {
        this.radius *= 1.06;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.35, this.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.alpha <= 0;
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
        this.speedBoost = speedBoost;
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

    draw(ctx, isLight = false) {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.palette[0] || '#FFE082';
        ctx.lineWidth = 3.6;
        ctx.stroke();

        // Bright rocket head
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? '#FDE047' : '#FFFFFF';
        ctx.fill();
    }

    hasReached() {
        return Math.hypot(this.destX - this.x, this.destY - this.y) <= 22 || this.speed < 2.8 || this.y <= this.destY;
    }
}

class RocketSpark {
    constructor(x, y, color) {
        this.x = x + (Math.random() * 6 - 3);
        this.y = y + (Math.random() * 6 - 3);
        this.vx = (Math.random() - 0.5) * 1.8;
        this.vy = Math.random() * 2.2 + 0.9;
        this.color = color;
        this.alpha = 0.9;
        this.decay = Math.random() * 0.045 + 0.035;
        this.size = Math.random() * 2.2 + 1.3;
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
    constructor(x, y, color, radiusScale = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 6;
        this.maxRadius = (72 + Math.random() * 34) * radiusScale;
        this.alpha = 0.7;
        this.decay = 0.04;
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
        ctx.lineWidth = 2.6;
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
            this.friction = 0.956;
            this.gravity = 0.082;
            this.decay = Math.random() * 0.011 + 0.0075; // very long golden trail
            this.size = 2.8;
        } else if (type === 'heart') {
            this.friction = 0.942;
            this.gravity = 0.038;
            this.decay = Math.random() * 0.014 + 0.011;
            this.size = 3.0;
        } else if (type === 'ring') {
            this.friction = 0.95;
            this.gravity = 0.048;
            this.decay = Math.random() * 0.016 + 0.011;
            this.size = 2.9;
        } else if (type === 'strobe') {
            this.friction = 0.942;
            this.gravity = 0.065;
            this.decay = Math.random() * 0.015 + 0.011;
            this.size = 3.2;
        } else if (type === 'pop') {
            this.friction = 0.92;
            this.gravity = 0.08;
            this.decay = 0.036;
            this.size = 2.0;
        } else { // standard / crackler
            this.friction = 0.946;
            this.gravity = 0.072;
            this.decay = Math.random() * 0.017 + 0.012;
            this.size = 2.9;
        }

        this.isCrackler = type === 'crackler';
        this.readyToCrackle = false;
        this.hasCrackled = false;
        this.crackleAt = 16 + Math.floor(Math.random() * 14);
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
        this.tick += 0.38;

        this.readyToCrackle = this.isCrackler && !this.hasCrackled && this.lifeTime >= this.crackleAt;
    }

    draw(ctx, isLight = false) {
        if (this.alpha <= 0) return;

        let renderAlpha = this.alpha;
        if (this.type === 'strobe') {
            renderAlpha = Math.sin(this.tick) > 0 ? this.alpha : this.alpha * 0.22;
        }

        ctx.globalAlpha = renderAlpha;
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = isLight ? this.size * 1.15 : this.size;
        ctx.stroke();

        // Sparkle tip head
        if (this.type === 'willow' || this.type === 'strobe' || this.type === 'heart') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.65, 0, Math.PI * 2);
            ctx.fillStyle = isLight ? '#FEF08A' : '#FFFFFF';
            ctx.fill();
        }
    }

    isDead() {
        return this.alpha <= 0;
    }
}

window.FireworksSystem = FireworksSystem;
