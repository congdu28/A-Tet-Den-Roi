/**
 * High-Efficiency Precision Countdown Engine for Tet Đinh Mùi 2027
 * Separates heavy DOM operations (1s interval) from lightweight milliseconds (100ms interval).
 */
class TetCountdown {
    constructor() {
        this.targetDate = new Date('2027-02-06T00:00:00+07:00');
        this.startDate = new Date('2026-02-17T00:00:00+07:00');

        this.milestones = [
            {
                id: 'ong-tao',
                name: '23 Tháng Chạp - Tiễn Ông Táo',
                desc: 'Thả cá chép đỏ đưa Táo Quân chầu trời',
                date: new Date('2027-01-30T00:00:00+07:00'),
                icon: '🐟'
            },
            {
                id: 'banh-chung',
                name: '28 Tháng Chạp - Nồi Bánh Chưng Xanh',
                desc: 'Quây quần bên bếp lửa hồng canh nồi bánh',
                date: new Date('2027-02-04T00:00:00+07:00'),
                icon: '🎋'
            },
            {
                id: 'tat-nien',
                name: '30 Tháng Chạp - Cúng Tất Niên',
                desc: 'Bữa cơm sum họp gia đình chiều cuối năm',
                date: new Date('2027-02-05T00:00:00+07:00'),
                icon: '🍲'
            },
            {
                id: 'giao-thua',
                name: 'Đêm Giao Thừa Thiêng Liêng',
                desc: 'Thời khắc chuyển giao năm mới Đinh Mùi',
                date: new Date('2027-02-06T00:00:00+07:00'),
                icon: '🎆'
            },
            {
                id: 'mung-1',
                name: 'Mùng 1 Tết Cha',
                desc: 'Khai xuân đón lộc, chúc thọ ông bà cha mẹ',
                date: new Date('2027-02-06T00:00:00+07:00'),
                icon: '🧧'
            },
            {
                id: 'mung-2',
                name: 'Mùng 2 Tết Mẹ',
                desc: 'Về bên ngoại sum vầy chúc Tết họ hàng',
                date: new Date('2027-02-07T00:00:00+07:00'),
                icon: '🌸'
            },
            {
                id: 'mung-3',
                name: 'Mùng 3 Tết Thầy',
                desc: 'Uống nước nhớ nguồn, tri ân thầy cô giáo',
                date: new Date('2027-02-08T00:00:00+07:00'),
                icon: '📚'
            }
        ];

        this.elements = {
            days: document.getElementById('count-days'),
            hours: document.getElementById('count-hours'),
            minutes: document.getElementById('count-minutes'),
            seconds: document.getElementById('count-seconds'),
            millis: document.getElementById('count-millis'),
            progressBar: document.getElementById('year-progress-bar'),
            progressHead: document.getElementById('year-progress-head'),
            progressStage: document.getElementById('year-progress-stage'),
            glitterCanvas: document.getElementById('progress-glitter-canvas'),
            headerProgressBar: document.getElementById('header-progress-bar'),
            progressText: document.getElementById('year-progress-text'),
            celebrationBanner: document.getElementById('celebration-banner'),
            countdownBox: document.getElementById('countdown-main-box'),
            milestoneList: document.getElementById('milestones-container'),
            currentTime: document.getElementById('clock-current-time'),
            solarDate: document.getElementById('clock-solar-date'),
            lunarDate: document.getElementById('clock-lunar-date'),
            // Top Nav Clock Elements
            topNavbar: document.getElementById('main-top-navbar'),
            navClockTime: document.getElementById('nav-clock-time'),
            navClockDate: document.getElementById('nav-clock-date'),
            navClockLunar: document.getElementById('nav-clock-lunar')
        };

        this.prevValues = { d: -1, h: -1, m: -1, s: -1 };
        this.prevDateString = '';
        this.mainTimer = null;
        this.millisTimer = null;
        this.currentPercent = 0;
        this.glitterParticles = [];
        this.glitterRafId = null;
        this.glitterStageWidth = 0;
        this.glitterStageHeight = 0;

        // Initialize lunar calendar engine if available
        if (window.TetLunarCalendar) {
            this.lunarCalendar = new window.TetLunarCalendar();
        }
    }

    initProgressGlitter() {
        const canvas = this.elements.glitterCanvas;
        const stage = this.elements.progressStage;
        if (!canvas || !stage) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const measureCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.glitterStageWidth = rect.width;
            this.glitterStageHeight = rect.height;
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        measureCanvas();
        if (typeof ResizeObserver !== 'undefined') {
            this.glitterResizeObserver = new ResizeObserver(measureCanvas);
            this.glitterResizeObserver.observe(stage);
        } else {
            window.addEventListener('resize', measureCanvas, { passive: true });
        }

        const GLITTER_COLORS = ['#FFFDE7', '#FFD700', '#FFA726', '#FF4081', '#FF5252', '#40E0D0'];

        const spawnBurst = (count = 2, isClickBurst = false) => {
            if (!this.glitterStageWidth || !this.glitterStageHeight) return;
            if (this.glitterParticles.length > 110) return;

            const pct = Math.max(0, Math.min(100, this.currentPercent));
            const headX = this.glitterStageWidth * (pct / 100);
            const centerY = this.glitterStageHeight * 0.52;

            for (let i = 0; i < count; i++) {
                // 80% shoot from glowing tip, 20% shimmer from within filled bar
                const fromHead = isClickBurst || Math.random() < 0.82 || headX < 24;
                const spawnX = fromHead ? headX + (Math.random() - 0.5) * 6 : Math.random() * headX;
                const spawnY = centerY + (Math.random() - 0.5) * 10;

                const angle = fromHead
                    ? (Math.random() - 0.5) * Math.PI * 1.45 // Fan forward, up, and down
                    : -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
                const speed = isClickBurst
                    ? 1.5 + Math.random() * 2.8
                    : fromHead
                        ? 0.9 + Math.random() * 2.1
                        : 0.4 + Math.random() * 0.9;

                const shapeRoll = Math.random();
                const shape = shapeRoll < 0.35 ? 'star' : shapeRoll < 0.72 ? 'diamond' : 'confetti';

                this.glitterParticles.push({
                    x: spawnX,
                    y: spawnY,
                    vx: Math.cos(angle) * speed + (fromHead ? 0.45 : 0),
                    vy: Math.sin(angle) * speed - (fromHead ? 0.35 : 0.4),
                    gravity: isClickBurst ? 0.055 : 0.04,
                    drag: 0.975,
                    size: shape === 'star' ? 2.8 + Math.random() * 2.8 : 2.4 + Math.random() * 2.8,
                    color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
                    life: 1,
                    decay: isClickBurst ? 0.02 + Math.random() * 0.018 : 0.022 + Math.random() * 0.02,
                    rot: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.25,
                    twinklePhase: Math.random() * Math.PI * 2,
                    shape
                });
            }
        };

        stage.addEventListener('click', (e) => {
            e.stopPropagation();
            spawnBurst(26, true);
        });

        let lastEmitTime = 0;
        const tick = (now) => {
            if (!document.hidden && this.glitterStageWidth > 0) {
                ctx.clearRect(0, 0, this.glitterStageWidth, this.glitterStageHeight);

                if (now - lastEmitTime > 48) {
                    spawnBurst(2, false);
                    lastEmitTime = now;
                }

                for (let i = this.glitterParticles.length - 1; i >= 0; i--) {
                    const p = this.glitterParticles[i];
                    p.vx *= p.drag;
                    p.vy = p.vy * p.drag + p.gravity;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.rot += p.rotSpeed;
                    p.twinklePhase += 0.28;
                    p.life -= p.decay;

                    if (p.life <= 0) {
                        this.glitterParticles.splice(i, 1);
                        continue;
                    }

                    const twinkle = 0.6 + 0.4 * Math.abs(Math.sin(p.twinklePhase));
                    const alpha = Math.max(0, Math.min(1, p.life * twinkle));

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot);
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = p.color;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 6;

                    if (p.shape === 'star') {
                        const s = p.size;
                        ctx.beginPath();
                        ctx.moveTo(0, -s);
                        ctx.lineTo(s * 0.3, -s * 0.3);
                        ctx.lineTo(s, 0);
                        ctx.lineTo(s * 0.3, s * 0.3);
                        ctx.lineTo(0, s);
                        ctx.lineTo(-s * 0.3, s * 0.3);
                        ctx.lineTo(-s, 0);
                        ctx.lineTo(-s * 0.3, -s * 0.3);
                        ctx.closePath();
                        ctx.fill();
                    } else if (p.shape === 'diamond') {
                        const s = p.size;
                        ctx.beginPath();
                        ctx.moveTo(0, -s);
                        ctx.lineTo(s * 0.65, 0);
                        ctx.lineTo(0, s);
                        ctx.lineTo(-s * 0.65, 0);
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        ctx.fillRect(-p.size * 0.7, -p.size * 0.35, p.size * 1.4, p.size * 0.7);
                    }
                    ctx.restore();
                }
            }
            this.glitterRafId = requestAnimationFrame(tick);
        };

        this.glitterRafId = requestAnimationFrame(tick);
    }

    start() {
        this.renderMilestones();
        this.updateMain();
        this.initProgressGlitter();

        // 1. Update days/hours/minutes/seconds & real-time clock once every second (0 overhead!)
        this.mainTimer = setInterval(() => this.updateMain(), 1000);

        // 2. Lắng nghe cuộn trang để kích hoạt hiệu ứng thanh bar ghim trên đầu (sticky, mượt với rAF + hysteresis)
        this.isScrolled = false;
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (scrollTicking || !this.elements.topNavbar) return;
            scrollTicking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                const nextScrolled = this.isScrolled ? y > 12 : y > 30;
                if (nextScrolled !== this.isScrolled) {
                    this.isScrolled = nextScrolled;
                    this.elements.topNavbar.classList.toggle('is-scrolled', nextScrolled);
                }
                scrollTicking = false;
            });
        }, { passive: true });

        // 3. Update milliseconds at relaxed 100ms rate (nếu có phần tử)
        if (this.elements.millis) {
            this.millisTimer = setInterval(() => {
                const now = Date.now();
                const diff = this.targetDate.getTime() - now;
                if (diff > 0) {
                    const millis = Math.floor((diff % 1000) / 10);
                    this.elements.millis.textContent = String(millis).padStart(2, '0');
                }
            }, 100);
        }
    }

    updateMain() {
        const now = new Date();
        const diff = this.targetDate.getTime() - now.getTime();

        // Real-time Clock & Solar/Lunar Date Display
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const timeStr = `${hh}:${mm}:${ss}`;

        if (this.elements.currentTime) {
            this.elements.currentTime.textContent = timeStr;
        }
        if (this.elements.navClockTime) {
            this.elements.navClockTime.textContent = timeStr;
        }

        if (this.prevDateString !== now.toDateString()) {
            this.prevDateString = now.toDateString();
            const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const dayName = dayNames[now.getDay()];
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear();

            if (this.elements.solarDate) {
                this.elements.solarDate.textContent = `${dayName}, ${d}/${m}/${y}`;
            }
            if (this.elements.navClockDate) {
                this.elements.navClockDate.textContent = `${d}/${m}/${y}`;
            }

            if (window.LunarEngine) {
                const lunar = window.LunarEngine.convertSolar2Lunar(now.getDate(), now.getMonth() + 1, now.getFullYear(), 7);
                const canChiYear = window.LunarEngine.getCanChiYear(lunar.year);
                const lunarD = String(lunar.day).padStart(2, '0');
                const lunarM = String(lunar.month).padStart(2, '0');
                if (this.elements.lunarDate) {
                    this.elements.lunarDate.textContent = `Ngày ${lunarD}/${lunarM} (Năm ${canChiYear})`;
                }
                if (this.elements.navClockLunar) {
                    this.elements.navClockLunar.textContent = `(Âm: ${lunarD}/${lunarM})`;
                }
            }
        }

        if (diff <= 0) {
            this.handleTetArrived();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (this.prevValues.d !== days && this.elements.days) {
            this.prevValues.d = days;
            this.elements.days.textContent = String(days).padStart(2, '0');
        }
        if (this.prevValues.h !== hours && this.elements.hours) {
            this.prevValues.h = hours;
            this.elements.hours.textContent = String(hours).padStart(2, '0');
        }
        if (this.prevValues.m !== minutes && this.elements.minutes) {
            this.prevValues.m = minutes;
            this.elements.minutes.textContent = String(minutes).padStart(2, '0');
        }
        if (this.prevValues.s !== seconds && this.elements.seconds) {
            this.prevValues.s = seconds;
            this.elements.seconds.textContent = String(seconds).padStart(2, '0');
        }

        // Progress bar (updated only once per second)
        const totalDuration = this.targetDate.getTime() - this.startDate.getTime();
        const elapsed = now.getTime() - this.startDate.getTime();
        const percentNum = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        const percent = percentNum.toFixed(1);
        this.currentPercent = percentNum;

        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${percent}%`;
        }
        if (this.elements.progressHead) {
            this.elements.progressHead.style.left = `${percent}%`;
        }
        if (this.elements.headerProgressBar) {
            this.elements.headerProgressBar.style.width = `${percent}%`;
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `Hành trình năm cũ tới Tết Đinh Mùi: ${percent}%`;
        }
    }

    handleTetArrived() {
        this.currentPercent = 100;
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = '100%';
        }
        if (this.elements.progressHead) {
            this.elements.progressHead.style.left = '100%';
        }
        if (this.elements.headerProgressBar) {
            this.elements.headerProgressBar.style.width = '100%';
        }
        if (this.elements.countdownBox) {
            this.elements.countdownBox.classList.add('hidden');
        }
        if (this.elements.celebrationBanner) {
            this.elements.celebrationBanner.classList.remove('hidden');
        }
        if (window.fireworks) {
            window.fireworks.triggerFrenzy(15);
        }
        if (this.mainTimer) clearInterval(this.mainTimer);
        if (this.millisTimer) clearInterval(this.millisTimer);
    }

    renderMilestones() {
        if (!this.elements.milestoneList) return;
        this.elements.milestoneList.innerHTML = '';

        const now = new Date();

        this.milestones.forEach(m => {
            const isPassed = now > m.date;
            const diffDays = Math.ceil((m.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            const card = document.createElement('div');
            card.className = `milestone-card ${isPassed ? 'passed' : ''}`;
            card.id = `ms-${m.id}`;

            card.innerHTML = `
                <div class="milestone-icon">${m.icon}</div>
                <div class="milestone-content">
                    <div class="milestone-title">${m.name}</div>
                    <div class="milestone-desc">${m.desc}</div>
                    <div class="milestone-badge">
                        ${isPassed ? '✓ Đã hoàn thành' : (diffDays === 0 ? '✨ Đang diễn ra hôm nay!' : `Còn ${diffDays} ngày`)}
                    </div>
                </div>
            `;
            this.elements.milestoneList.appendChild(card);
        });
    }
}

window.TetCountdown = TetCountdown;
