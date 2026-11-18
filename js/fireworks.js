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

        // Density level from localStorage: auto ('low'|'medium'|'high'), manual ('low'|'medium'|'high'|'ultra'), and frenzy wave count (2..20)
        this.density = localStorage.getItem('tet-firework-density') || 'medium';
        this.manualDensity = localStorage.getItem('tet-firework-manual-density') || 'ultra';
        const savedWaves = parseInt(localStorage.getItem('tet-firework-frenzy-waves') || '8', 10);
        this.frenzyWaves = Number.isFinite(savedWaves) ? Math.max(2, Math.min(20, savedWaves)) : 8;
        this.updateDensityLimits();

        this.autoLaunchTimer = null;
        this.isRunning = false;
        this.loopActive = false;
        this.idleFrames = 0;
        this.autoFireEnabled = true;
        this.animFrameId = null;
        this.isFrenzyRunning = false;
        this.frenzyTimers = [];
        this.frenzyIntervals = [];
        this.dpr = 1;
        this.lastFrameTime = 0;
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

        const manualPresets = {
            low: {
                maxParticles: 1600,
                baseCount: 64,
                clickScale: 0.9,
                frenzy: { fanCount: 3, crossPairs: 1, volleyCount: 8, volleyDelay: 120, finaleCount: 3, burstScale: 1.0, durationMs: 3200 }
            },
            medium: {
                maxParticles: 2800,
                baseCount: 98,
                clickScale: 1.2,
                frenzy: { fanCount: 5, crossPairs: 2, volleyCount: 15, volleyDelay: 95, finaleCount: 5, burstScale: 1.2, durationMs: 4000 }
            },
            high: {
                maxParticles: 4500,
                baseCount: 135,
                clickScale: 1.5,
                frenzy: { fanCount: 7, crossPairs: 3, volleyCount: 22, volleyDelay: 82, finaleCount: 7, burstScale: 1.38, durationMs: 4800 }
            },
            ultra: {
                maxParticles: 6500,
                baseCount: 168,
                clickScale: 1.85,
                frenzy: { fanCount: 9, crossPairs: 4, volleyCount: 34, volleyDelay: 62, finaleCount: 9, burstScale: 1.55, durationMs: 5400 }
            }
        };

        this.manualConfig = manualPresets[this.manualDensity] || manualPresets.high;
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

    setManualDensity(newDensity) {
        this.manualDensity = newDensity;
        localStorage.setItem('tet-firework-manual-density', newDensity);
        this.updateDensityLimits();
    }

    setFrenzyWaves(waves) {
        const parsed = parseInt(waves, 10);
        if (!Number.isFinite(parsed)) return;
        this.frenzyWaves = Math.max(2, Math.min(20, parsed));
        localStorage.setItem('tet-firework-frenzy-waves', String(this.frenzyWaves));
    }

    getEstimatedFrenzySeconds(waves = this.frenzyWaves) {
        const w = Math.max(2, Math.min(20, parseInt(waves, 10) || 8));
        return Math.round(w * 2.25 + 2);
    }

    getClickBurstMultiplier() {
        return this.manualConfig ? this.manualConfig.clickScale : 1.5;
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.canvas && this.ctx) {
            // Render full-screen additive fireworks at 1x CSS pixels to avoid 4x alpha-blend fillrate overhead on HiDPI displays
            this.dpr = 1;
            this.canvas.width = Math.max(1, Math.round(this.width));
            this.canvas.height = Math.max(1, Math.round(this.height));
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    cancelFrenzy() {
        if (this.frenzyTimers && this.frenzyTimers.length) {
            this.frenzyTimers.forEach(t => clearTimeout(t));
            this.frenzyTimers = [];
        }
        if (this.frenzyIntervals && this.frenzyIntervals.length) {
            this.frenzyIntervals.forEach(iv => clearInterval(iv));
            this.frenzyIntervals = [];
        }
        this.isFrenzyRunning = false;
        const frenzyBtn = document.getElementById('btn-fireworks-frenzy');
        if (frenzyBtn) {
            frenzyBtn.classList.remove('frenzy-active');
            frenzyBtn.innerHTML = '<span>🎆</span> Pháo Hoa';
            frenzyBtn.setAttribute('title', 'Bắn pháo hoa liên hoàn cực đã mắt');
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.wakeLoop();
        // Immediate opening salvo so the sky feels alive right away
        setTimeout(() => {
            if (this.isRunning && this.autoFireEnabled && !document.hidden) {
                this.launchRandomShell();
                if (this.density !== 'low') {
                    setTimeout(() => this.isRunning && !document.hidden && this.launchRandomShell(), 220);
                }
            }
        }, 280);
        this.scheduleNextAutoFire(1100);
    }

    wakeLoop() {
        this.idleFrames = 0;
        if (this.isRunning && !this.loopActive) {
            this.loopActive = true;
            this.lastFrameTime = 0;
            this.animFrameId = requestAnimationFrame((t) => this.animate(t));
        }
    }

    stop() {
        this.isRunning = false;
        this.loopActive = false;
        this.lastFrameTime = 0;
        this.cancelFrenzy();
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
            if (!this.isRunning || !this.autoFireEnabled) return;
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

    launchRocket(startX, startY, destX, destY, palette = null, shellType = 'chrysanthemum', speedBoost = 1, isManualBurst = false) {
        const rocketCap = (this.isFrenzyRunning && this.manualDensity === 'ultra') ? 68 : 42;
        if (this.fireworks.length > rocketCap) return;

        const pal = palette || this.pickPalette();
        const rocket = new AdvancedRocket(startX, startY, destX, destY, pal, shellType, speedBoost);
        rocket.isManualBurst = Boolean(isManualBurst);
        this.fireworks.push(rocket);
        this.wakeLoop();

        if (window.tetAudio) {
            window.tetAudio.playFireworkLaunch();
        }
    }

    explodeAt(x, y, forcedPalette = null, shellType = 'chrysanthemum', countMultiplier = 1, isManual = false) {
        this.wakeLoop();
        const palette = forcedPalette || this.pickPalette();
        const useManualLimits = isManual || this.isFrenzyRunning;
        const effectiveMax = useManualLimits
            ? Math.max(this.maxParticles, (this.manualConfig && this.manualConfig.maxParticles) || 4500)
            : this.maxParticles;
        const availableSlots = effectiveMax - this.particles.length;
        if (availableSlots < 12) return;

        const isLight = this.isLightMode();

        // Luminous flash + expanding shockwave ring
        this.flashes.push(new ExplosionFlash(x, y, palette[0], isLight));
        this.shockwaves.push(new ShockwaveHalo(x, y, palette[0]));
        if (countMultiplier >= 1.2) {
            this.shockwaves.push(new ShockwaveHalo(x, y, palette[1] || '#FFFFFF', 1.45));
        }

        let baseCount = 92;
        if (useManualLimits && this.manualConfig) {
            baseCount = this.manualConfig.baseCount;
        } else if (this.density === 'low') {
            baseCount = 58;
        } else if (this.density === 'high') {
            baseCount = 135;
        }

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
     * Launches customizable 2..20 grand waves across the sky with distinct formations & a massive finale!
     */
    triggerMegaFrenzy(customWaves = null) {
        if (this.isFrenzyRunning) {
            this.cancelFrenzy();
            return;
        }
        if (!this.isRunning) {
            this.start();
        }
        this.isFrenzyRunning = true;
        this.frenzyTimers = [];
        this.frenzyIntervals = [];

        const totalWaves = Math.max(2, Math.min(20, parseInt(customWaves, 10) || this.frenzyWaves || 8));
        const waveStepMs = 2250;

        const frenzyBtn = document.getElementById('btn-fireworks-frenzy');
        if (frenzyBtn) {
            frenzyBtn.classList.add('frenzy-active');
            frenzyBtn.innerHTML = `<span>🎆</span> Đợt 1/${totalWaves}`;
            frenzyBtn.setAttribute('title', `Đang bắn đại tiệc pháo hoa (${totalWaves} đợt) — bấm lại để dừng`);
        }

        const cfg = (this.manualConfig && this.manualConfig.frenzy) || {
            fanCount: 7, crossPairs: 3, volleyCount: 22, volleyDelay: 82, finaleCount: 7, burstScale: 1.38, durationMs: 4800
        };
        const types = ['heart', 'flower', 'strobe', 'willow', 'double_burst', 'starburst', 'ring', 'chrysanthemum'];
        const safeTimeout = (fn, ms) => {
            const id = setTimeout(() => {
                if (!this.isRunning || !this.isFrenzyRunning || document.hidden) return;
                fn();
            }, ms);
            this.frenzyTimers.push(id);
        };

        for (let w = 0; w < totalWaves; w++) {
            const waveStartMs = w * waveStepMs;
            const isFinalWave = w === totalWaves - 1;
            const paletteSeed = w * 2;

            safeTimeout(() => {
                if (frenzyBtn && this.isFrenzyRunning) {
                    frenzyBtn.innerHTML = `<span>🎆</span> Đợt ${w + 1}/${totalWaves}`;
                }

                const W = this.width;
                const H = this.height;

                if (isFinalWave) {
                    // Final Wave: Ascending Prelude Fan + Giant Double-Tier Grand Finale Salvo!
                    const preCount = Math.max(4, cfg.fanCount - 2);
                    const preHalf = (preCount - 1) / 2;
                    for (let idx = 0; idx < preCount; idx++) {
                        const norm = preHalf > 0 ? (idx - preHalf) / preHalf : 0;
                        const sx = W * 0.5 + norm * 90;
                        const dx = W * (0.5 + norm * 0.36);
                        const dy = H * 0.28 + Math.abs(norm) * 28;
                        safeTimeout(() => {
                            this.launchRocket(sx, H + 10, dx, dy, this.pickPalette(paletteSeed + idx), types[idx % types.length], 1.2, true);
                        }, idx * 55);
                    }

                    safeTimeout(() => {
                        const fCount = cfg.finaleCount + 2;
                        for (let i = 0; i < fCount; i++) {
                            const ratio = fCount > 1 ? 0.10 + (i / (fCount - 1)) * 0.80 : 0.5;
                            const yRatio = i % 2 === 0 ? 0.32 : 0.18;
                            const ptType = types[(i + paletteSeed + 2) % types.length];
                            this.launchRocket(
                                W * ratio,
                                H + 10,
                                W * ratio,
                                H * yRatio,
                                this.pickPalette(paletteSeed + i),
                                ptType,
                                cfg.burstScale * 1.08,
                                true
                            );
                        }
                    }, 560);
                    return;
                }

                const pattern = w % 5;

                if (pattern === 0) {
                    // Pattern A: Đại Khai Màn Rẻ Quạt Hoàng Kim (Wide Symmetrical Fan Barrage)
                    const fanHalf = (cfg.fanCount - 1) / 2;
                    for (let idx = 0; idx < cfg.fanCount; idx++) {
                        const norm = fanHalf > 0 ? (idx - fanHalf) / fanHalf : 0;
                        const angle = norm * 0.44;
                        const startX = W * 0.5 + (idx - fanHalf) * 42;
                        const destX = W * 0.5 + Math.sin(angle) * (W * 0.44);
                        const destY = H * 0.23 + Math.abs(idx - fanHalf) * 24;
                        const pal = this.pickPalette(paletteSeed + idx);
                        const type = idx === Math.floor(fanHalf) ? 'flower' : idx % 2 === 0 ? 'chrysanthemum' : 'double_burst';
                        safeTimeout(() => {
                            this.launchRocket(startX, H + 10, destX, destY, pal, type, 1.18, true);
                        }, idx * 52);
                    }
                } else if (pattern === 1) {
                    // Pattern B: Song Long Giao Chéo & Liễu Rủ (Twin Corner Criss-Crossing Salvos)
                    const pairs = cfg.crossPairs + 1;
                    for (let pair = 0; pair < pairs; pair++) {
                        safeTimeout(() => {
                            const offsetX = 55 + pair * 68;
                            const targetLX = W * Math.min(0.84, 0.34 + pair * 0.12);
                            const targetRX = W * Math.max(0.16, 0.66 - pair * 0.12);
                            const targetY = H * (pair % 2 === 0 ? 0.27 : 0.19);
                            this.launchRocket(offsetX, H + 10, Math.min(W - 70, targetLX), targetY, this.pickPalette(paletteSeed + pair), pair % 2 === 0 ? 'willow' : 'ring', 1.18, true);
                            this.launchRocket(W - offsetX, H + 10, Math.max(70, targetRX), targetY, this.pickPalette(paletteSeed + pair + 3), pair % 2 === 0 ? 'starburst' : 'flower', 1.18, true);
                        }, pair * 115);
                    }
                } else if (pattern === 2) {
                    // Pattern C: Mưa Sao Băng Liên Thanh Toàn Bầu Trời (Rolling Rapid-Fire Horizon Sweep)
                    const shots = Math.max(7, Math.round(cfg.volleyCount * 0.45));
                    const sweepRight = (w % 2 === 0);
                    let fired = 0;
                    const volleyTimer = setInterval(() => {
                        if (!this.isRunning || !this.isFrenzyRunning || document.hidden) {
                            clearInterval(volleyTimer);
                            return;
                        }
                        const progress = shots > 1 ? fired / (shots - 1) : 0.5;
                        const baseRatio = sweepRight ? (0.12 + progress * 0.76) : (0.88 - progress * 0.76);
                        const x = Math.max(70, Math.min(W - 70, W * baseRatio + (Math.random() * 60 - 30)));
                        const y = H * (0.17 + (fired % 3) * 0.08) + Math.random() * 24;
                        const t = types[(fired + paletteSeed) % types.length];
                        this.launchRocket(x + (Math.random() * 70 - 35), H + 10, x, y, this.pickPalette(paletteSeed + fired), t, 1.22, true);
                        fired++;
                        if (fired >= shots) {
                            clearInterval(volleyTimer);
                        }
                    }, Math.max(75, Math.min(115, cfg.volleyDelay + 22)));
                    this.frenzyIntervals.push(volleyTimer);
                } else if (pattern === 3) {
                    // Pattern D: Hoa Đào & Trái Tim Ngũ Sắc 2 Nhịp (Two-Beat Heart & Blossom Crown)
                    const countA = Math.max(3, Math.ceil(cfg.fanCount * 0.6));
                    for (let i = 0; i < countA; i++) {
                        const r = countA > 1 ? 0.20 + (i / (countA - 1)) * 0.60 : 0.5;
                        const y = H * (i % 2 === 0 ? 0.20 : 0.27);
                        this.launchRocket(W * 0.5 + (r - 0.5) * 140, H + 10, W * r, y, this.pickPalette(paletteSeed + i), i % 2 === 0 ? 'heart' : 'flower', 1.2, true);
                    }
                    safeTimeout(() => {
                        const countB = Math.max(4, Math.ceil(cfg.fanCount * 0.65));
                        for (let j = 0; j < countB; j++) {
                            const r = countB > 1 ? 0.14 + (j / (countB - 1)) * 0.72 : 0.5;
                            const y = H * (j % 2 === 0 ? 0.31 : 0.22);
                            this.launchRocket(W * r, H + 10, W * r, y, this.pickPalette(paletteSeed + j + 2), j % 2 === 0 ? 'willow' : 'double_burst', 1.22, true);
                        }
                    }, 560);
                } else {
                    // Pattern E: Đại Pháo Thăng Thiên Đối Xứng 2 Tầng (Two-Tier Symmetrical Pillars)
                    const pairs = Math.max(2, Math.ceil(cfg.fanCount / 2));
                    for (let p = 0; p < pairs; p++) {
                        safeTimeout(() => {
                            const spread = (p + 0.5) / pairs * 0.40;
                            const leftX = W * (0.5 - spread);
                            const rightX = W * (0.5 + spread);
                            const highY = H * (p % 2 === 0 ? 0.19 : 0.31);
                            const shellA = types[(paletteSeed + p) % types.length];
                            const shellB = types[(paletteSeed + p + 4) % types.length];
                            this.launchRocket(leftX, H + 10, leftX, highY, this.pickPalette(paletteSeed + p), shellA, 1.24, true);
                            if (Math.abs(rightX - leftX) > 35) {
                                this.launchRocket(rightX, H + 10, rightX, highY, this.pickPalette(paletteSeed + p + 1), shellB, 1.24, true);
                            }
                        }, p * 85);
                    }
                }
            }, waveStartMs);
        }

        // Reset Frenzy state smoothly after final wave blooms & settles
        const totalDurationMs = (totalWaves - 1) * waveStepMs + 2650;
        const endId = setTimeout(() => {
            this.cancelFrenzy();
        }, totalDurationMs);
        this.frenzyTimers.push(endId);
    }

    // Backward compatibility with previous triggerFrenzy(count)
    triggerFrenzy(count = 10) {
        if (!this.isFrenzyRunning) {
            this.triggerMegaFrenzy();
        }
    }

    animate(now = performance.now()) {
        if (!this.isRunning || !this.loopActive) return;

        // Interleave frames during active scroll (Slot 1, or full 60fps during manual Frenzy) with delta-time compensation
        const canDraw = this.isFrenzyRunning
            ? (!this.lastFrameTime || (now - this.lastFrameTime) >= 15.2)
            : (typeof window.shouldDrawCanvasFrame === 'function'
                ? window.shouldDrawCanvasFrame(now, this.lastFrameTime, 1)
                : (!this.lastFrameTime || (now - this.lastFrameTime) >= 15.2));

        if (!canDraw) {
            this.animFrameId = requestAnimationFrame((t) => this.animate(t));
            return;
        }

        const elapsed = this.lastFrameTime ? (now - this.lastFrameTime) : 16.667;
        this.lastFrameTime = now;
        const dt = Math.min(2.4, elapsed / 16.667);

        const hasWork =
            this.fireworks.length > 0 ||
            this.particles.length > 0 ||
            this.shockwaves.length > 0 ||
            this.flashes.length > 0 ||
            this.rocketSparks.length > 0;

        if (!hasWork) {
            this.idleFrames++;
            if (this.idleFrames > 16) {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.loopActive = false;
                this.animFrameId = null;
                return;
            }
        } else {
            this.idleFrames = 0;
        }

        const isLight = this.isLightMode();

        // Clear canvas with delta-time compensated trail fade so trail length stays identical at any FPS
        const baseFade = isLight ? 0.32 : 0.22;
        const fadeAlpha = dt === 1 ? baseFade : Math.min(0.65, 1 - Math.pow(1 - baseFade, dt));
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha.toFixed(3)})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Dark mode glows richly with additive blending; Light mode uses crisp alpha compositing so colors stay vibrant over light cards
        this.ctx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

        // 0. Draw Explosion Flashes
        for (let i = this.flashes.length - 1; i >= 0; i--) {
            const fl = this.flashes[i];
            fl.update(dt);
            fl.draw(this.ctx);
            if (fl.isDead()) {
                this.flashes.splice(i, 1);
            }
        }

        // 1. Draw Shockwave Halos
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.update(dt);
            sw.draw(this.ctx);
            if (sw.isDead()) {
                this.shockwaves.splice(i, 1);
            }
        }

        // 2. Draw Rocket Sparks (Comet Trail) - O(1) swap-pop removal
        for (let i = this.rocketSparks.length - 1; i >= 0; i--) {
            const sp = this.rocketSparks[i];
            sp.update(dt);
            sp.draw(this.ctx);
            if (sp.isDead()) {
                const last = this.rocketSparks.length - 1;
                if (i !== last) this.rocketSparks[i] = this.rocketSparks[last];
                this.rocketSparks.pop();
            }
        }

        // 3. Update & Draw Rockets
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const rocket = this.fireworks[i];
            rocket.update(dt);
            rocket.draw(this.ctx, isLight);

            // Spawn richer sparks behind rocket
            if (Math.random() > 0.15 && this.rocketSparks.length < 320) {
                this.rocketSparks.push(new RocketSpark(rocket.x, rocket.y, rocket.palette[0]));
            }

            if (rocket.hasReached()) {
                const burstScale = rocket.speedBoost > 1.25 ? 1.35 : 1.08;
                this.explodeAt(rocket.x, rocket.y, rocket.palette, rocket.shellType, burstScale, rocket.isManualBurst);
                this.fireworks.splice(i, 1);
            }
        }

        // 4. Update & Draw Particles (Batch render + O(1) swap-pop removal)
        const activeMaxParticles = this.isFrenzyRunning
            ? Math.max(this.maxParticles, (this.manualConfig && this.manualConfig.maxParticles) || 4500)
            : this.maxParticles;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(dt);
            p.draw(this.ctx, isLight);

            // Handle micro-cracklers popping mid-air
            if (p.readyToCrackle && !p.hasCrackled) {
                p.hasCrackled = true;
                if (this.particles.length < activeMaxParticles - 8) {
                    const crackleColors = isLight ? ['#F59E0B', '#DC2626', '#FFFBEB'] : ['#FFF9C4', '#FFD700', '#FFFFFF'];
                    for (let c = 0; c < 5; c++) {
                        const ca = Math.random() * Math.PI * 2;
                        const cs = Math.random() * 2.5 + 0.9;
                        this.particles.push(new RichParticle(p.x, p.y, crackleColors, Math.cos(ca) * cs, Math.sin(ca) * cs, 'pop'));
                    }
                }
            }

            if (p.isDead()) {
                const last = this.particles.length - 1;
                if (i !== last) this.particles[i] = this.particles[last];
                this.particles.pop();
            }
        }

        this.ctx.globalAlpha = 1;
        this.animFrameId = requestAnimationFrame((t) => this.animate(t));
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

    update(dt = 1) {
        this.radius *= Math.pow(1.06, dt);
        this.alpha -= this.decay * dt;
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

    update(dt = 1) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.speed *= Math.pow(0.982, dt);
        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y += Math.sin(this.angle) * this.speed * dt;
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

    update(dt = 1) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.alpha -= this.decay * dt;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        const d = this.size * 1.8;
        ctx.fillRect(this.x - d * 0.5, this.y - d * 0.5, d, d);
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

    update(dt = 1) {
        this.radius += (this.maxRadius - this.radius) * (1 - Math.pow(0.78, dt));
        this.alpha -= this.decay * dt;
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

    update(dt = 1) {
        this.prevX = this.x;
        this.prevY = this.y;

        const f = dt === 1 ? this.friction : Math.pow(this.friction, dt);
        this.vx *= f;
        this.vy = this.vy * f + this.gravity * dt;

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.alpha -= this.decay * dt;
        this.lifeTime += dt;
        this.tick += 0.38 * dt;

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

        // Sparkle tip head (fast GPU rect blit instead of per-particle arc rasterization)
        if (this.type === 'willow' || this.type === 'strobe' || this.type === 'heart') {
            const tip = this.size * 1.25;
            ctx.fillStyle = isLight ? '#FEF08A' : '#FFFFFF';
            ctx.fillRect(this.x - tip * 0.5, this.y - tip * 0.5, tip, tip);
        }
    }

    isDead() {
        return this.alpha <= 0;
    }
}

window.FireworksSystem = FireworksSystem;
