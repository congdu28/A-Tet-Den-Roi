/**
 * Grand Festive Ambient Background Effects Engine (60 FPS GPU Composited)
 * 1. Golden Stardust & Fireflies (Bụi sao vàng tinh tú lấp lánh)
 * 2. Floating Sky Lanterns (Thiên đăng bay bổng thả ước nguyện)
 * 3. Celebration Confetti (Pháo giấy kim tuyến đa sắc đón giao thừa)
 * 4. Lucky Coins & Mini Red Envelopes (Đồng xu cát tường & lì xì tài lộc rơi)
 * 5. Spring Drizzle (Mưa xuân lất phất ấm tình quê hương)
 */
class AmbientSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.isRunning = false;
        this.animFrameId = null;

        // Settings toggles (retrieved from localStorage)
        this.showStardust = localStorage.getItem('tet-ambient-stardust') !== 'false';
        this.showLanterns = localStorage.getItem('tet-ambient-lanterns') !== 'false';
        this.showConfetti = localStorage.getItem('tet-ambient-confetti') === 'true';
        this.showLuckyCoins = localStorage.getItem('tet-ambient-luckycoins') === 'true';
        this.showSpringRain = localStorage.getItem('tet-ambient-springrain') === 'true';

        // Density settings (retrieved from localStorage)
        this.maxStardust = parseInt(localStorage.getItem('tet-stardust-density') || '40', 10);
        this.maxLanterns = parseInt(localStorage.getItem('tet-lantern-count') || '6', 10);
        this.maxConfetti = parseInt(localStorage.getItem('tet-confetti-density') || '35', 10);
        this.maxLuckyCoins = parseInt(localStorage.getItem('tet-luckycoins-density') || '16', 10);

        this.stardust = [];
        this.lanterns = [];
        this.confetti = [];
        this.luckyCoins = [];
        this.springRain = [];

        this.initStardust();
        this.initLanterns();
        this.initConfetti();
        this.initLuckyCoins();
        this.initSpringRain();
        this.createSprites();

        this.resize();
        this.resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.resize(), 120);
        }, { passive: true });

        // Auto pause on tab switch to preserve 100% battery & GPU
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
    }

    // 1. Golden Stardust
    initStardust() {
        this.stardust = [];
        for (let i = 0; i < this.maxStardust; i++) {
            this.stardust.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2.2 + 0.8,
                baseAlpha: Math.random() * 0.45 + 0.35,
                pulseSpeed: Math.random() * 0.035 + 0.015,
                pulsePhase: Math.random() * Math.PI * 2,
                vx: (Math.random() - 0.5) * 0.35,
                vy: -(Math.random() * 0.45 + 0.2)
            });
        }
    }

    // 2. Sky Lanterns
    initLanterns() {
        this.lanterns = [];
        for (let i = 0; i < this.maxLanterns; i++) {
            this.lanterns.push({
                x: Math.random() * this.width,
                y: this.height + Math.random() * (this.height * 0.8),
                scale: Math.random() * 0.35 + 0.65, // 0.65 to 1.0
                vy: -(Math.random() * 0.45 + 0.3),
                swaySpeed: Math.random() * 0.02 + 0.01,
                swayAmplitude: Math.random() * 25 + 15,
                swayPhase: Math.random() * Math.PI * 2,
                flickerPhase: Math.random() * Math.PI * 2
            });
        }
    }

    // 3. Confetti Ribbons
    initConfetti() {
        this.confetti = [];
        const colors = ['#FFD700', '#FF1744', '#FF4081', '#00E676', '#00E5FF', '#FF9100', '#FFFFFF'];
        for (let i = 0; i < this.maxConfetti; i++) {
            this.confetti.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                w: Math.random() * 7 + 6,
                h: Math.random() * 12 + 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotationX: Math.random() * Math.PI * 2,
                rotationY: Math.random() * Math.PI * 2,
                rotationSpeedX: Math.random() * 0.06 + 0.02,
                rotationSpeedY: Math.random() * 0.08 + 0.03,
                vy: Math.random() * 1.5 + 1.0,
                vx: (Math.random() - 0.5) * 0.8,
                swayPhase: Math.random() * Math.PI * 2,
                swaySpeed: Math.random() * 0.03 + 0.015
            });
        }
    }

    // 4. Lucky Gold Coins & Mini Red Envelopes
    initLuckyCoins() {
        this.luckyCoins = [];
        for (let i = 0; i < this.maxLuckyCoins; i++) {
            this.luckyCoins.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                type: Math.random() > 0.4 ? 'coin' : 'envelope',
                size: Math.random() * 6 + 16,
                vy: Math.random() * 1.2 + 0.8,
                vx: (Math.random() - 0.5) * 0.6,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.04,
                wobblePhase: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.015
            });
        }
    }

    // 5. Spring Rain Drizzle
    initSpringRain() {
        this.springRain = [];
        const count = 45;
        for (let i = 0; i < count; i++) {
            this.springRain.push({
                x: Math.random() * (this.width + 100) - 50,
                y: Math.random() * this.height,
                length: Math.random() * 14 + 10,
                vy: Math.random() * 5 + 6,
                vx: -Math.random() * 1.2 - 0.6,
                alpha: Math.random() * 0.25 + 0.15
            });
        }
    }

    createSprites() {
        // 1. Pre-rendered Sky Lantern Sprite (eliminates 700+ gradient allocs/sec)
        const lSize = 104;
        const lCanvas = document.createElement('canvas');
        lCanvas.width = lSize;
        lCanvas.height = lSize;
        const lCtx = lCanvas.getContext('2d');
        lCtx.translate(lSize / 2, lSize / 2);

        const glowGrad = lCtx.createRadialGradient(0, 0, 8, 0, 0, 48);
        glowGrad.addColorStop(0, 'rgba(255, 183, 77, 0.42)');
        glowGrad.addColorStop(0.5, 'rgba(255, 87, 34, 0.16)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        lCtx.fillStyle = glowGrad;
        lCtx.beginPath();
        lCtx.arc(0, 0, 48, 0, Math.PI * 2);
        lCtx.fill();

        lCtx.beginPath();
        lCtx.moveTo(-13, 17);
        lCtx.bezierCurveTo(-22, -1, -20, -22, 0, -24);
        lCtx.bezierCurveTo(20, -22, 22, -1, 13, 17);
        lCtx.closePath();

        const bodyGrad = lCtx.createLinearGradient(0, -24, 0, 17);
        bodyGrad.addColorStop(0, '#ff9800');
        bodyGrad.addColorStop(0.5, '#f57c00');
        bodyGrad.addColorStop(1, '#d84315');
        lCtx.fillStyle = bodyGrad;
        lCtx.fill();

        lCtx.beginPath();
        lCtx.ellipse(0, 17, 13, 2.5, 0, 0, Math.PI * 2);
        lCtx.fillStyle = '#ffb300';
        lCtx.fill();
        this.lanternSprite = lCanvas;

        // 2. Pre-rendered Gold Coin Sprite
        const cSize = 40;
        const cCanvas = document.createElement('canvas');
        cCanvas.width = cSize;
        cCanvas.height = cSize;
        const cCtx = cCanvas.getContext('2d');
        cCtx.translate(cSize / 2, cSize / 2);
        const r = 16;
        cCtx.beginPath();
        cCtx.arc(0, 0, r, 0, Math.PI * 2);
        const cGrad = cCtx.createLinearGradient(-r, -r, r, r);
        cGrad.addColorStop(0, '#FFD700');
        cGrad.addColorStop(0.5, '#FFA000');
        cGrad.addColorStop(1, '#FF8F00');
        cCtx.fillStyle = cGrad;
        cCtx.fill();
        cCtx.strokeStyle = '#FFE082';
        cCtx.lineWidth = 2;
        cCtx.stroke();
        const hole = r * 0.56;
        cCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        cCtx.fillRect(-hole / 2, -hole / 2, hole, hole);
        cCtx.strokeStyle = '#FFE082';
        cCtx.lineWidth = 1.2;
        cCtx.strokeRect(-hole / 2, -hole / 2, hole, hole);
        this.coinSprite = cCanvas;

        // 3. Pre-rendered Mini Red Envelope Sprite
        const eW = 40;
        const eH = 54;
        const eCanvas = document.createElement('canvas');
        eCanvas.width = eW;
        eCanvas.height = eH;
        const eCtx = eCanvas.getContext('2d');
        eCtx.translate(eW / 2, eH / 2);
        const bw = 24;
        const bh = 36;
        eCtx.fillStyle = '#D32F2F';
        eCtx.fillRect(-bw / 2, -bh / 2, bw, bh);
        eCtx.strokeStyle = '#FFD700';
        eCtx.lineWidth = 1.5;
        eCtx.strokeRect(-bw / 2, -bh / 2, bw, bh);
        eCtx.beginPath();
        eCtx.arc(0, -bh * 0.15, bw * 0.2, 0, Math.PI * 2);
        eCtx.fillStyle = '#FFD700';
        eCtx.fill();
        this.envelopeSprite = eCanvas;
    }

    hasActiveEffects() {
        return this.showStardust || this.showLanterns || this.showConfetti || this.showLuckyCoins || this.showSpringRain;
    }

    start() {
        if (this.isRunning || !this.hasActiveEffects()) return;
        this.isRunning = true;
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
        if (!this.hasActiveEffects()) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.stop();
            return;
        }
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // 1. Draw Golden Stardust (Bụi sao vàng lấp lánh) - batched without per-particle strings
        if (this.showStardust) {
            ctx.fillStyle = '#FFDF4D';
            for (let i = 0; i < this.stardust.length; i++) {
                const s = this.stardust[i];
                s.x += s.vx;
                s.y += s.vy;
                s.pulsePhase += s.pulseSpeed;

                if (s.y < -10) {
                    s.y = this.height + 10;
                    s.x = Math.random() * this.width;
                }
                if (s.x < -10) s.x = this.width + 10;
                if (s.x > this.width + 10) s.x = -10;

                const alpha = s.baseAlpha + Math.sin(s.pulsePhase) * 0.25;
                if (alpha <= 0) continue;

                ctx.globalAlpha = Math.min(1, alpha);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();

                if (s.size > 1.8) {
                    ctx.globalAlpha = alpha * 0.32;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.size * 2.2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
        }

        // 2. Draw Spring Rain (Mưa xuân dịu dàng)
        if (this.showSpringRain) {
            ctx.strokeStyle = 'rgba(224, 242, 254, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            for (let i = 0; i < this.springRain.length; i++) {
                const r = this.springRain[i];
                r.y += r.vy;
                r.x += r.vx;

                if (r.y > this.height) {
                    r.y = -r.length;
                    r.x = Math.random() * (this.width + 100) - 50;
                }

                ctx.moveTo(r.x, r.y);
                ctx.lineTo(r.x + r.vx * 2, r.y + r.length);
            }
            ctx.stroke();
        }

        // 3. Draw Floating Sky Lanterns (Thiên đăng bay bổng)
        if (this.showLanterns) {
            for (let i = 0; i < this.lanterns.length; i++) {
                const l = this.lanterns[i];
                l.y += l.vy;
                l.swayPhase += l.swaySpeed;
                l.flickerPhase += 0.05;

                const currentX = l.x + Math.sin(l.swayPhase) * l.swayAmplitude;

                if (l.y < -90) {
                    l.y = this.height + 60;
                    l.x = Math.random() * this.width;
                    l.scale = Math.random() * 0.35 + 0.65;
                }

                this.drawSkyLantern(currentX, l.y, l.scale, l.flickerPhase);
            }
        }

        // 4. Draw Celebration Confetti (Pháo giấy kim tuyến)
        if (this.showConfetti) {
            for (let i = 0; i < this.confetti.length; i++) {
                const c = this.confetti[i];
                c.y += c.vy;
                c.swayPhase += c.swaySpeed;
                c.x += c.vx + Math.sin(c.swayPhase) * 0.8;
                c.rotationX += c.rotationSpeedX;
                c.rotationY += c.rotationSpeedY;

                if (c.y > this.height + 20) {
                    c.y = -20;
                    c.x = Math.random() * this.width;
                }

                const scaleX = Math.cos(c.rotationY);
                const scaleY = Math.sin(c.rotationX);

                ctx.setTransform(scaleX, 0, 0, scaleY, c.x, c.y);
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // 5. Draw Lucky Coins & Envelopes (Tài lộc rơi)
        if (this.showLuckyCoins) {
            for (let i = 0; i < this.luckyCoins.length; i++) {
                const coin = this.luckyCoins[i];
                coin.y += coin.vy;
                coin.wobblePhase += coin.wobbleSpeed;
                coin.x += coin.vx + Math.sin(coin.wobblePhase) * 0.6;
                coin.rot += coin.rotSpeed;

                if (coin.y > this.height + 30) {
                    coin.y = -30;
                    coin.x = Math.random() * this.width;
                }

                if (coin.type === 'coin') {
                    this.drawLuckyCoin(coin.x, coin.y, coin.size, coin.rot);
                } else {
                    this.drawMiniEnvelope(coin.x, coin.y, coin.size, coin.rot);
                }
            }
        }

        this.animFrameId = requestAnimationFrame(() => this.animate());
    }

    drawSkyLantern(x, y, scale, flicker) {
        const ctx = this.ctx;
        const candleFlicker = Math.sin(flicker) * 0.15 + 0.85;
        ctx.setTransform(scale, 0, 0, scale, x, y);
        ctx.drawImage(this.lanternSprite, -52, -52);

        // Inner warm flickering flame
        ctx.beginPath();
        ctx.ellipse(0, 4, 7, 11, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFDD0';
        ctx.globalAlpha = 0.88 * candleFlicker;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawLuckyCoin(x, y, size, rot) {
        const ctx = this.ctx;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        const s = size / 32;
        ctx.setTransform(cos * s, sin * s, -sin * s, cos * s, x, y);
        ctx.drawImage(this.coinSprite, -20, -20);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawMiniEnvelope(x, y, size, rot) {
        const ctx = this.ctx;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        const s = size / 24;
        ctx.setTransform(cos * s, sin * s, -sin * s, cos * s, x, y);
        ctx.drawImage(this.envelopeSprite, -20, -27);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // Toggle controls
    setStardust(enable) {
        this.showStardust = enable;
        localStorage.setItem('tet-ambient-stardust', enable ? 'true' : 'false');
        if (enable && !this.isRunning) this.start();
    }
    toggleStardust(enable) { this.setStardust(enable); }

    setLanterns(enable) {
        this.showLanterns = enable;
        localStorage.setItem('tet-ambient-lanterns', enable ? 'true' : 'false');
        if (enable && !this.isRunning) this.start();
    }
    toggleLanterns(enable) { this.setLanterns(enable); }

    setConfetti(enable) {
        this.showConfetti = enable;
        localStorage.setItem('tet-ambient-confetti', enable ? 'true' : 'false');
        if (enable && this.confetti.length === 0) this.initConfetti();
        if (enable && !this.isRunning) this.start();
    }
    toggleConfetti(enable) { this.setConfetti(enable); }

    setLuckyCoins(enable) {
        this.showLuckyCoins = enable;
        localStorage.setItem('tet-ambient-luckycoins', enable ? 'true' : 'false');
        if (enable && this.luckyCoins.length === 0) this.initLuckyCoins();
        if (enable && !this.isRunning) this.start();
    }
    toggleLuckyCoins(enable) { this.setLuckyCoins(enable); }

    setSpringRain(enable) {
        this.showSpringRain = enable;
        localStorage.setItem('tet-ambient-springrain', enable ? 'true' : 'false');
        if (enable && this.springRain.length === 0) this.initSpringRain();
        if (enable && !this.isRunning) this.start();
    }
    toggleSpringRain(enable) { this.setSpringRain(enable); }

    // Density controls
    setStardustDensity(count) {
        this.maxStardust = Math.max(15, Math.min(90, parseInt(count, 10)));
        localStorage.setItem('tet-stardust-density', this.maxStardust);
        this.initStardust();
    }

    setLanternsCount(count) {
        this.maxLanterns = Math.max(2, Math.min(14, parseInt(count, 10)));
        localStorage.setItem('tet-lantern-count', this.maxLanterns);
        this.initLanterns();
    }

    setConfettiDensity(count) {
        this.maxConfetti = Math.max(15, Math.min(80, parseInt(count, 10)));
        localStorage.setItem('tet-confetti-density', this.maxConfetti);
        this.initConfetti();
    }
}

window.AmbientSystem = AmbientSystem;
