/**
 * High-Efficiency Precision Countdown Engine for Tet Đinh Mùi 2027
 * Separates heavy DOM operations (1s interval) from lightweight milliseconds (100ms interval).
 */
class TetCountdown {
    constructor() {
        this.activeTetYear = null;
        this.targets = {
            tet: {
                date: new Date('2027-02-06T00:00:00+07:00'),
                mainTitle: 'ĐẾM NGƯỢC ĐẾN TẾT',
                badgeLabel: '🗓️ MÙNG 1 TẾT NGUYÊN ĐÁN:',
                badgeValue: 'Thứ Bảy, ngày 06/02/2027 Dương Lịch (00:00:00)',
                progressPrefix: 'Hành trình năm cũ tới Tết Đinh Mùi',
                destLabel: '🧧 Đích đến:',
                destValue: 'Tết Đinh Mùi 2027'
            },
            yep: {
                date: new Date('2027-01-23T00:00:00+07:00'),
                mainTitle: 'YEAR END PARTY PANCAKE 2027',
                badgeLabel: '🥂 YEAR END PARTY PANCAKE:',
                badgeValue: 'Thứ Bảy, ngày 23/01/2027 Dương Lịch (00:00:00)',
                progressPrefix: 'Hành trình tới Year End Party Pancake',
                destLabel: '🥂 Đích đến:',
                destValue: 'YEP Pancake 23/01/2027'
            }
        };
        this.startDate = new Date('2026-02-17T00:00:00+07:00');
        this.milestones = [];

        this.elements = {
            days: document.getElementById('count-days'),
            hours: document.getElementById('count-hours'),
            minutes: document.getElementById('count-minutes'),
            seconds: document.getElementById('count-seconds'),
            timerGrid: document.querySelector('#countdown-main-box .timer-grid'),
            progressTrack: document.querySelector('#year-progress-stage .progress-track'),
            progressBar: document.getElementById('year-progress-bar'),
            progressHead: document.getElementById('year-progress-head'),
            progressStage: document.getElementById('year-progress-stage'),
            glitterCanvas: document.getElementById('progress-glitter-canvas'),
            headerProgressBar: document.getElementById('header-progress-bar'),
            progressText: document.getElementById('year-progress-text'),
            mainTitle: document.getElementById('main-countdown-title'),
            targetDateLabel: document.getElementById('target-date-label'),
            targetDateValue: document.getElementById('target-date-value'),
            progressDestLabel: document.getElementById('progress-dest-label'),
            progressDestValue: document.getElementById('progress-dest-value'),
            targetSwitchBtns: document.querySelectorAll('.target-switch-btn'),
            btnTargetTet: document.getElementById('btn-target-tet'),
            btnTargetYep: document.getElementById('btn-target-yep'),
            navBrandTitle: document.getElementById('nav-brand-title'),
            milestonesTitle: document.getElementById('milestones-section-title'),
            mascotBtn: document.getElementById('mascot-goat-btn'),
            mascotBubble: document.querySelector('.mascot-speech-bubble'),
            celebrationBanner: document.getElementById('celebration-banner'),
            countdownBox: document.getElementById('countdown-main-box'),
            milestoneList: document.getElementById('milestones-container'),
            weatherPill: document.getElementById('weather-status-pill'),
            weatherLink: document.getElementById('weather-link-main'),
            weatherGpsBtn: document.getElementById('btn-weather-gps'),
            weatherIcon: document.getElementById('weather-icon'),
            weatherTemp: document.getElementById('weather-temp'),
            weatherCity: document.getElementById('weather-city'),
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
        this.currentPercent = 0;
        this.hasTriggeredTetCelebration = false;
        this.weatherReqId = 0;
        this.isGpsLoading = false;
        this.glitterParticles = [];
        this.glitterRafId = null;
        this.glitterStageWidth = 0;
        this.glitterStageHeight = 0;

        this.syncActiveTetCycle({ initial: true });

        const savedTarget = localStorage.getItem('tet_countdown_target_v1');
        const yepAllowed = this.activeTetYear === 2027;
        this.activeTargetKey = (savedTarget && this.targets[savedTarget] && (savedTarget !== 'yep' || yepAllowed))
            ? savedTarget
            : 'tet';
        this.targetDate = this.targets[this.activeTargetKey].date;

        // Initialize lunar calendar engine if available
        if (window.TetLunarCalendar) {
            this.lunarCalendar = new window.TetLunarCalendar();
        }
    }

    /**
     * Automatically computes upcoming Tết cycle (switches to next year's Tết after 15/01 Âm lịch)
     */
    syncActiveTetCycle(options = {}) {
        if (!window.LunarEngine || typeof window.LunarEngine.getCurrentTetCycle !== 'function') return false;
        const cycle = window.LunarEngine.getCurrentTetCycle(7);
        if (!cycle || cycle.year === this.activeTetYear) return false;

        this.activeTetYear = cycle.year;
        this.hasTriggeredTetCelebration = false;
        this.startDate = new Date(cycle.prevMung1.isoMidnight);

        this.targets.tet = {
            date: new Date(cycle.mung1.isoMidnight),
            mainTitle: 'ĐẾM NGƯỢC ĐẾN TẾT',
            badgeLabel: '🗓️ MÙNG 1 TẾT NGUYÊN ĐÁN:',
            badgeValue: `${cycle.mung1.dayOfWeekName}, ngày ${cycle.mung1.dateStr} Dương Lịch (00:00:00)`,
            progressPrefix: `Hành trình năm cũ tới Tết ${cycle.canChi}`,
            destLabel: '🧧 Đích đến:',
            destValue: `Tết ${cycle.canChi} ${cycle.year}`
        };

        this.milestones = [
            {
                id: 'ong-tao',
                name: '23 Tháng Chạp - Tiễn Ông Táo',
                desc: 'Thả cá chép đỏ đưa Táo Quân chầu trời',
                date: new Date(cycle.ongTao.isoMidnight),
                icon: '🐟'
            },
            {
                id: 'banh-chung',
                name: '28 Tháng Chạp - Nồi Bánh Chưng Xanh',
                desc: 'Quây quần bên bếp lửa hồng canh nồi bánh',
                date: new Date(cycle.banhChung.isoMidnight),
                icon: '🎋'
            },
            {
                id: 'tat-nien',
                name: `${cycle.tatNien.lunarDay} Tháng Chạp - Cúng Tất Niên`,
                desc: 'Bữa cơm sum họp gia đình chiều cuối năm',
                date: new Date(cycle.tatNien.isoMidnight),
                icon: '🍲'
            },
            {
                id: 'giao-thua',
                name: 'Đêm Giao Thừa Thiêng Liêng',
                desc: `Thời khắc chuyển giao năm mới ${cycle.canChi} ${cycle.year}`,
                date: new Date(cycle.mung1.isoMidnight),
                icon: '🎆'
            },
            {
                id: 'mung-1',
                name: 'Mùng 1 Tết Cha',
                desc: 'Khai xuân đón lộc, chúc thọ ông bà cha mẹ',
                date: new Date(cycle.mung1.isoMidnight),
                icon: '🧧'
            },
            {
                id: 'mung-2',
                name: 'Mùng 2 Tết Mẹ',
                desc: 'Về bên ngoại sum vầy chúc Tết họ hàng',
                date: new Date(cycle.mung2.isoMidnight),
                icon: '🌸'
            },
            {
                id: 'mung-3',
                name: 'Mùng 3 Tết Thầy',
                desc: 'Uống nước nhớ nguồn, tri ân thầy cô giáo',
                date: new Date(cycle.mung3.isoMidnight),
                icon: '📚'
            },
            {
                id: 'ram-thang-gieng',
                name: '15 Tháng Giêng - Tết Nguyên Tiêu',
                desc: 'Rằm tháng Giêng viên mãn, khép lại mùa lễ Tết',
                date: new Date(cycle.ramThangGieng.isoMidnight),
                icon: '🏮'
            }
        ];

        if (this.elements.btnTargetTet) {
            this.elements.btnTargetTet.innerHTML = `<span>🧧</span><span>Tết ${cycle.canChi} (${cycle.mung1.shortStr})</span>`;
        }
        if (this.elements.btnTargetYep) {
            this.elements.btnTargetYep.classList.toggle('hidden', cycle.year !== 2027);
        }
        if (this.elements.navBrandTitle) {
            this.elements.navBrandTitle.textContent = `TẾT ${cycle.canChi.toUpperCase()} ${cycle.year}`;
        }
        if (this.elements.milestonesTitle) {
            this.elements.milestonesTitle.textContent = `📅 Các Cột Mốc Đón Tết ${cycle.canChi} ${cycle.year}`;
        }
        if (this.elements.mascotBtn && cycle.mascot) {
            this.elements.mascotBtn.textContent = cycle.mascot.icon;
            this.elements.mascotBtn.title = `Nhấp vào bé ${cycle.mascot.animal} để nghe lời chúc Tết!`;
        }
        if (this.elements.mascotBubble && cycle.year !== 2027) {
            this.elements.mascotBubble.textContent = `Chào bạn! Năm ${cycle.canChi} ${cycle.year} vạn sự đại cát nhé! ✨`;
        }
        if (this.elements.celebrationBanner) {
            const h2 = this.elements.celebrationBanner.querySelector('h2');
            const p = this.elements.celebrationBanner.querySelector('p');
            if (h2) h2.textContent = `🎉 CHÚC MỪNG NĂM MỚI ${cycle.year} 🎉`;
            if (p) p.textContent = `NĂM ${cycle.canChi.toUpperCase()} ĐẠI THẮNG • VẠN SỰ NHƯ Ý • AN KHANG THỊNH VƯỢNG!`;
        }
        if (cycle.year !== 2027 && typeof document !== 'undefined') {
            document.title = `Đếm Ngược Tết ${cycle.year} - Xuân ${cycle.canChi} Rực Rỡ & May Mắn`;
        }

        if (!options.initial) {
            if (cycle.year !== 2027 && this.activeTargetKey === 'yep') {
                this.activeTargetKey = 'tet';
            }
            this.setCountdownTarget(this.activeTargetKey, { skipSave: true, skipUpdate: true });
            this.renderMilestones();
        }
        return true;
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
            this.glitterStageWidth = rect.width;
            this.glitterStageHeight = rect.height;
            canvas.width = Math.max(1, Math.round(rect.width));
            canvas.height = Math.max(1, Math.round(rect.height));
            ctx.setTransform(1, 0, 0, 1, 0, 0);
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

        let isStageVisible = true;
        const prefersReducedMotion = typeof window.matchMedia === 'function'
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false;

        let lastEmitTime = 0;
        let lastGlitterFrame = 0;
        const ensureTick = () => {
            if (this.glitterRafId) return;
            if (document.hidden || !isStageVisible) return;
            if (prefersReducedMotion && this.glitterParticles.length === 0) return;
            this.glitterRafId = requestAnimationFrame(tick);
        };

        stage.addEventListener('click', (e) => {
            e.stopPropagation();
            spawnBurst(26, true);
            ensureTick();
        });

        if (typeof IntersectionObserver !== 'undefined') {
            this.glitterVisibilityObserver = new IntersectionObserver((entries) => {
                isStageVisible = entries.some(entry => entry.isIntersecting);
                if (isStageVisible) ensureTick();
            }, { threshold: 0.01 });
            this.glitterVisibilityObserver.observe(stage);
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) ensureTick();
        });

        const tick = (now) => {
            this.glitterRafId = null;
            if (document.hidden || !isStageVisible || this.glitterStageWidth <= 0) {
                return;
            }

            const canDraw = typeof window.shouldDrawCanvasFrame === 'function'
                ? window.shouldDrawCanvasFrame(now, lastGlitterFrame, 0)
                : (!lastGlitterFrame || (now - lastGlitterFrame) >= 15.2);

            if (!canDraw) {
                this.glitterRafId = requestAnimationFrame(tick);
                return;
            }

            const elapsed = lastGlitterFrame ? (now - lastGlitterFrame) : 16.667;
            lastGlitterFrame = now;
            const dt = Math.min(2.4, elapsed / 16.667);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.glitterStageWidth, this.glitterStageHeight);

            if (!prefersReducedMotion && now - lastEmitTime > 48) {
                spawnBurst(2, false);
                lastEmitTime = now;
            }

            for (let i = this.glitterParticles.length - 1; i >= 0; i--) {
                const p = this.glitterParticles[i];
                const drag = dt === 1 ? p.drag : Math.pow(p.drag, dt);
                p.vx *= drag;
                p.vy = p.vy * drag + p.gravity * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.rot += p.rotSpeed * dt;
                p.twinklePhase += 0.28 * dt;
                p.life -= p.decay * dt;

                if (p.life <= 0) {
                    const last = this.glitterParticles.length - 1;
                    if (i !== last) this.glitterParticles[i] = this.glitterParticles[last];
                    this.glitterParticles.pop();
                    continue;
                }

                const twinkle = 0.6 + 0.4 * Math.abs(Math.sin(p.twinklePhase));
                const alpha = Math.max(0, Math.min(1, p.life * twinkle));
                const cos = Math.cos(p.rot);
                const sin = Math.sin(p.rot);

                ctx.setTransform(cos, sin, -sin, cos, p.x, p.y);
                ctx.fillStyle = p.color;

                // Soft additive halo without expensive Canvas 2D shadowBlur
                if (p.size >= 3.2 && alpha > 0.25) {
                    ctx.globalAlpha = alpha * 0.28;
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 1.45, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.globalAlpha = alpha;
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
            }

            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            if (!prefersReducedMotion || this.glitterParticles.length > 0) {
                this.glitterRafId = requestAnimationFrame(tick);
            }
        };

        ensureTick();
    }

    initTargetSwitcher() {
        const btns = this.elements.targetSwitchBtns;
        if (!btns || !btns.length) return;

        btns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.getAttribute('data-target');
                if (key && this.targets[key] && key !== this.activeTargetKey) {
                    this.setCountdownTarget(key);
                }
            });
        });

        this.setCountdownTarget(this.activeTargetKey, { skipSave: true, skipUpdate: true });
    }

    setCountdownTarget(targetKey, options = {}) {
        const cfg = this.targets[targetKey];
        if (!cfg) return;

        this.activeTargetKey = targetKey;
        this.targetDate = cfg.date;
        this.prevValues = { d: -1, h: -1, m: -1, s: -1 };

        if (!options.skipSave) {
            try {
                localStorage.setItem('tet_countdown_target_v1', targetKey);
            } catch {
                // ignore storage quota errors
            }
        }

        if (this.elements.targetSwitchBtns) {
            this.elements.targetSwitchBtns.forEach((btn) => {
                const isActive = btn.getAttribute('data-target') === targetKey;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        }

        if (this.elements.mainTitle) {
            this.elements.mainTitle.textContent = cfg.mainTitle;
        }
        if (this.elements.targetDateLabel) {
            this.elements.targetDateLabel.textContent = cfg.badgeLabel;
        }
        if (this.elements.targetDateValue) {
            this.elements.targetDateValue.textContent = cfg.badgeValue;
        }
        if (this.elements.progressDestLabel) {
            this.elements.progressDestLabel.textContent = cfg.destLabel;
        }
        if (this.elements.progressDestValue) {
            this.elements.progressDestValue.textContent = cfg.destValue;
        }
        if (this.elements.progressTrack) {
            this.elements.progressTrack.setAttribute('title', `Tiến trình thời gian tiến tới ${cfg.destValue}`);
        }

        if (!options.skipUpdate) {
            this.updateMain();
        }
    }

    start() {
        this.initTargetSwitcher();
        this.renderMilestones();
        this.updateMain();
        this.initProgressGlitter();
        this.initWeatherWidget();

        // 1. Update days/hours/minutes/seconds & real-time nav clock once every second
        this.mainTimer = setInterval(() => this.updateMain(), 1000);

        // 2. Lắng nghe cuộn trang để kích hoạt hiệu ứng thanh bar ghim trên đầu (sticky, mượt với rAF + hysteresis)
        this.isScrolled = window.scrollY > 30;
        if (this.elements.topNavbar && this.isScrolled) {
            this.elements.topNavbar.classList.add('is-scrolled');
        }
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
    }

    describeWeather(code, isDay) {
        const day = isDay !== 0;
        if (code === 0) return { icon: day ? '☀️' : '🌙', desc: day ? 'Trời quang, nắng đẹp' : 'Đêm quang đãng' };
        if (code === 1) return { icon: day ? '🌤️' : '🌙', desc: day ? 'Trời hầu như không mây' : 'Đêm ít mây' };
        if (code === 2) return { icon: day ? '⛅' : '☁️', desc: day ? 'Mây rải rác, hửng nắng' : 'Đêm mây rải rác' };
        if (code === 3) return { icon: '☁️', desc: 'Trời nhiều mây, u ám' };
        if (code === 45 || code === 48) return { icon: '🌫️', desc: 'Có sương mù' };
        if (code >= 51 && code <= 57) return { icon: '🌦️', desc: 'Mưa phùn nhẹ hạt' };
        if (code === 80) return { icon: day ? '🌦️' : '🌧️', desc: day ? 'Nắng xen mưa rào thoáng qua' : 'Mưa rào nhẹ thoáng qua' };
        if ((code >= 61 && code <= 67) || (code >= 81 && code <= 82)) return { icon: '🌧️', desc: 'Có mưa rào' };
        if (code >= 71 && code <= 77) return { icon: '❄️', desc: 'Tuyết rơi' };
        if (code >= 95) return { icon: '⛈️', desc: 'Mưa dông kèm sấm chớp' };
        return { icon: day ? '⛅' : '☁️', desc: 'Thời tiết hiện tại' };
    }

    calibrateWeatherCode(rawCode, cur) {
        let code = Number.isFinite(rawCode) ? rawCode : 2;
        const uv = cur && Number.isFinite(cur.uv_index) ? cur.uv_index : 0;
        const cloud = cur && Number.isFinite(cur.cloud_cover) ? cur.cloud_cover : 50;
        const precip = cur && Number.isFinite(cur.precipitation) ? cur.precipitation : 0;
        const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
        const isSunnyOrPartlyClear = (uv >= 2 && cloud <= 60) || (uv >= 1.5 && cloud <= 45);

        if (rainCodes.includes(code) && (isSunnyOrPartlyClear || (precip <= 0.2 && cloud <= 55))) {
            code = cloud <= 25 ? 0 : cloud <= 50 ? 1 : 2;
        }
        return code;
    }

    renderWeatherPill(temp, city, code, isDay, fullLocation = '', isGps = false) {
        if (!this.elements.weatherPill) return;
        const { icon, desc } = this.describeWeather(code, isDay);
        const rounded = Math.round(temp);
        const safeCity = String(city || 'Hà Nội').trim().slice(0, 36) || 'Hà Nội';
        const displayFull = String(fullLocation || safeCity).trim().slice(0, 80);

        if (this.elements.weatherIcon) this.elements.weatherIcon.textContent = icon;
        if (this.elements.weatherTemp) this.elements.weatherTemp.textContent = `${rounded}°C`;
        if (this.elements.weatherCity) this.elements.weatherCity.textContent = safeCity;

        const targetLink = this.elements.weatherLink || this.elements.weatherPill;
        targetLink.title = `${displayFull}: ${rounded}°C (${desc}) • Nhấn để xem dự báo & lịch âm chi tiết tại Weather 24h`;

        if (this.elements.weatherGpsBtn) {
            this.elements.weatherGpsBtn.classList.toggle('is-gps', Boolean(isGps));
            this.elements.weatherGpsBtn.title = isGps
                ? `Đang lấy theo GPS: ${displayFull} (Nhấn để cập nhật lại)`
                : 'Cập nhật vị trí chi tiết theo Xã/Phường (GPS)';
        }
    }

    showWeatherToast(text) {
        const toast = document.getElementById('tet-toast');
        if (!toast) return;
        toast.textContent = String(text || '');
        toast.classList.remove('hidden');
        if (window.toastTimer) clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
    }

    async fetchJsonWithTimeout(url, timeoutMs = 4000) {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
        try {
            const res = await fetch(url, controller ? { signal: controller.signal } : undefined);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } finally {
            if (timer) clearTimeout(timer);
        }
    }

    normalizeVietnamesePlace(rawName) {
        const cleaned = String(rawName || '').trim();
        if (!cleaned) return '';
        const asciiMap = {
            'hanoi': 'Hà Nội',
            'ha noi': 'Hà Nội',
            'ho chi minh': 'TP. Hồ Chí Minh',
            'ho chi minh city': 'TP. Hồ Chí Minh',
            'thanh hoa': 'Thanh Hóa',
            'da nang': 'Đà Nẵng',
            'hai phong': 'Hải Phòng',
            'can tho': 'Cần Thơ',
            'nghe an': 'Nghệ An',
            'ha tinh': 'Hà Tĩnh',
            'thua thien hue': 'Huế',
            'hue': 'Huế',
            'quang ninh': 'Quảng Ninh',
            'bac ninh': 'Bắc Ninh',
            'hai duong': 'Hải Dương',
            'hung yen': 'Hưng Yên',
            'nam dinh': 'Nam Định',
            'ninh binh': 'Ninh Bình',
            'thai binh': 'Thái Bình',
            'thai nguyen': 'Thái Nguyên',
            'vinh phuc': 'Vĩnh Phúc',
            'phu tho': 'Phú Thọ',
            'bac giang': 'Bắc Giang',
            'binh duong': 'Bình Dương',
            'dong nai': 'Đồng Nai',
            'bien hoa': 'Biên Hòa',
            'vung tau': 'Vũng Tàu',
            'ba ria - vung tau': 'Bà Rịa - Vũng Tàu',
            'khanh hoa': 'Khánh Hòa',
            'nha trang': 'Nha Trang',
            'da lat': 'Đà Lạt',
            'lam dong': 'Lâm Đồng',
            'quy nhon': 'Quy Nhơn',
            'binh dinh': 'Bình Định',
            'quang nam': 'Quảng Nam',
            'quang ngai': 'Quảng Ngãi',
            'dak lak': 'Đắk Lắk',
            'buon ma thuot': 'Buôn Ma Thuột',
            'kien giang': 'Kiên Giang',
            'phu quoc': 'Phú Quốc',
            'an giang': 'An Giang',
            'tien giang': 'Tiền Giang',
            'dong thap': 'Đồng Tháp',
            'ca mau': 'Cà Mau',
            'vinh long': 'Vĩnh Long',
            'lao cai': 'Lào Cai',
            'son la': 'Sơn La',
            'lang son': 'Lạng Sơn'
        };
        const key = cleaned.toLowerCase().replace(/\s+province$|\s+city$/i, '').trim();
        return asciiMap[key] || asciiMap[cleaned.toLowerCase()] || cleaned;
    }

    formatVietnameseWardName(name, desc = '') {
        const clean = this.normalizeVietnamesePlace(name);
        if (!clean) return '';
        const lower = clean.toLowerCase();
        const hasPrefix = /^(phường|xã|thị trấn|quận|huyện|thị xã|thành phố|tp\.?)\s+/i.test(lower);
        if (hasPrefix) return clean;

        const d = String(desc || '').toLowerCase();
        if (d.includes('phường')) return `Phường ${clean}`;
        if (d.includes('thị trấn')) return `Thị trấn ${clean}`;
        if (/\bxã\b/.test(d)) return `Xã ${clean}`;
        return clean;
    }

    extractBigDataCloudPlace(data) {
        if (!data) return null;
        let wardFromAdmin = '';
        let districtFromAdmin = '';
        if (data.localityInfo && Array.isArray(data.localityInfo.administrative)) {
            for (const item of data.localityInfo.administrative) {
                const name = (item && item.name) || '';
                const desc = ((item && item.description) || '').toLowerCase();
                if (!wardFromAdmin && (desc.includes('phường') || desc.includes('xã') || desc.includes('thị trấn') || name.startsWith('Phường') || name.startsWith('Xã') || name.startsWith('Thị trấn'))) {
                    wardFromAdmin = this.formatVietnameseWardName(name, desc);
                } else if (!districtFromAdmin && (desc.includes('quận') || desc.includes('huyện') || desc.includes('thị xã'))) {
                    districtFromAdmin = this.normalizeVietnamesePlace(name);
                }
            }
        }

        const rawWard = wardFromAdmin || this.normalizeVietnamesePlace(data.locality) || districtFromAdmin || this.normalizeVietnamesePlace(data.city);
        const rawProvince = this.normalizeVietnamesePlace(data.principalSubdivision || data.city);
        if (!rawWard && !rawProvince) return null;

        const shortName = rawWard || rawProvince;
        const fullName = [rawWard, rawProvince].filter((v, idx, arr) => v && arr.indexOf(v) === idx).join(', ');
        return { city: shortName, fullLocation: fullName || shortName };
    }

    async reverseGeocodeWard(lat, lon) {
        const formatPlace = (ward, province) => {
            const w = this.normalizeVietnamesePlace(ward);
            const p = this.normalizeVietnamesePlace(province);
            if (!w && !p) return null;
            const shortName = w || p;
            const fullName = [w, p].filter((v, idx, arr) => v && arr.indexOf(v) === idx).join(', ');
            return { city: shortName, fullLocation: fullName || shortName };
        };

        const queryNominatim = async () => {
            const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json&addressdetails=1&accept-language=vi`;
            const data = await this.fetchJsonWithTimeout(nomUrl, 5500);
            const addr = data && data.address;
            if (!addr) return null;
            const ward = addr.quarter || addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || addr.town || addr.city_district || addr.county;
            const province = addr.city || addr.state || addr.province;
            return formatPlace(ward, province);
        };

        const queryBigDataCloud = async () => {
            const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=vi`;
            const data = await this.fetchJsonWithTimeout(bdcUrl, 6000);
            return this.extractBigDataCloudPlace(data);
        };

        const queryPhoton = async () => {
            const phUrl = `https://photon.komoot.io/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
            const data = await this.fetchJsonWithTimeout(phUrl, 6000);
            const props = data && data.features && data.features[0] && data.features[0].properties;
            if (!props) return null;
            const ward = props.district || props.locality || props.suburb || props.city || props.county;
            const province = props.state || props.city;
            return formatPlace(ward, province);
        };

        // Run all 3 independent reverse geocoders in parallel; prefer Vietnamese-aware Nominatim & BigDataCloud first
        const [nomRes, bdcRes, phRes] = await Promise.allSettled([
            queryNominatim(),
            queryBigDataCloud(),
            queryPhoton()
        ]);

        for (const res of [nomRes, bdcRes, phRes]) {
            if (res.status === 'fulfilled' && res.value) {
                return res.value;
            }
        }
        return null;
    }

    async fetchAndSaveWeather(lat, lon, city, fullLocation, source = 'ip', fallbackCached = null, persistCache = true, reqId = null) {
        try {
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,weather_code,is_day,uv_index,cloud_cover,precipitation&timezone=auto`;
            const data = await this.fetchJsonWithTimeout(apiUrl, 4500);
            if (reqId !== null && reqId !== this.weatherReqId) return null;
            const cur = data && data.current;
            if (cur && Number.isFinite(cur.temperature_2m)) {
                const cleanCity = this.normalizeVietnamesePlace(city);
                const cleanFull = this.normalizeVietnamesePlace(fullLocation || cleanCity);
                const payload = {
                    temp: cur.temperature_2m,
                    code: this.calibrateWeatherCode(cur.weather_code, cur),
                    isDay: Number.isFinite(cur.is_day) ? cur.is_day : 1,
                    city: cleanCity,
                    fullLocation: cleanFull || cleanCity,
                    lat,
                    lon,
                    source,
                    ts: Date.now()
                };
                this.renderWeatherPill(payload.temp, payload.city, payload.code, payload.isDay, payload.fullLocation, source === 'gps');
                if (persistCache) {
                    try {
                        localStorage.setItem('tet-weather-cache-v4', JSON.stringify(payload));
                    } catch {}
                }
                return payload;
            }
        } catch {
            // Fall through to clean offline fallback if no cache exists
        }

        if (reqId !== null && reqId !== this.weatherReqId) return null;
        if (!fallbackCached && this.elements.weatherTemp && this.elements.weatherCity) {
            this.elements.weatherIcon && (this.elements.weatherIcon.textContent = '⛅');
            this.elements.weatherTemp.textContent = 'Thời tiết';
            this.elements.weatherCity.textContent = 'Weather 24h';
        }
        return null;
    }

    async resolveIpFallbackLocation() {
        // 1. Prefer BigDataCloud IP endpoint because it returns full Vietnamese diacritics & ward/city names
        try {
            const bdc = await this.fetchJsonWithTimeout('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=vi', 4500);
            if (
                bdc &&
                Number.isFinite(bdc.latitude) &&
                Number.isFinite(bdc.longitude) &&
                Math.abs(bdc.latitude) <= 90 &&
                Math.abs(bdc.longitude) <= 180
            ) {
                const place = this.extractBigDataCloudPlace(bdc) || { city: 'Hà Nội', fullLocation: 'Hà Nội' };
                return { lat: bdc.latitude, lon: bdc.longitude, city: place.city, fullLocation: place.fullLocation };
            }
        } catch {
            // Fall through to ipwho.is
        }

        // 2. Fallback to ipwho.is and normalize unaccented Vietnamese names cleanly
        try {
            const geo = await this.fetchJsonWithTimeout('https://ipwho.is/?fields=success,city,latitude,longitude', 4000);
            if (
                geo &&
                geo.success !== false &&
                Number.isFinite(geo.latitude) &&
                Number.isFinite(geo.longitude) &&
                Math.abs(geo.latitude) <= 90 &&
                Math.abs(geo.longitude) <= 180
            ) {
                const city = this.normalizeVietnamesePlace(geo.city).slice(0, 32) || 'Hà Nội';
                return { lat: geo.latitude, lon: geo.longitude, city, fullLocation: city };
            }
        } catch {
            // Ignore IP lookup failure
        }
        return null;
    }

    async refreshWeatherByIp(cached = null) {
        const reqId = ++this.weatherReqId;
        const ipPlace = await this.resolveIpFallbackLocation();
        if (reqId !== this.weatherReqId) return null;

        let lat = 21.0285;
        let lon = 105.8542;
        let city = 'Hà Nội';
        let fullLocation = 'Hà Nội';
        let shouldPersist = false;

        if (ipPlace) {
            lat = ipPlace.lat;
            lon = ipPlace.lon;
            city = ipPlace.city;
            fullLocation = ipPlace.fullLocation;
            shouldPersist = true;
        } else if (cached && Number.isFinite(cached.lat) && Number.isFinite(cached.lon)) {
            lat = cached.lat;
            lon = cached.lon;
            city = this.normalizeVietnamesePlace(cached.city) || 'Hà Nội';
            fullLocation = this.normalizeVietnamesePlace(cached.fullLocation) || city;
            shouldPersist = true;
        }

        return this.fetchAndSaveWeather(lat, lon, city, fullLocation, 'ip', cached, shouldPersist, reqId);
    }

    fetchWeatherByGps(manualClick = false) {
        if (this.isGpsLoading) return Promise.resolve(null);
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            if (manualClick) {
                this.showWeatherToast('⚠️ Trình duyệt không hỗ trợ định vị GPS.');
            }
            return Promise.resolve(null);
        }

        this.isGpsLoading = true;
        const reqId = ++this.weatherReqId;
        const btn = this.elements.weatherGpsBtn;
        if (btn) btn.classList.add('is-loading');

        let hasCachedWeather = false;
        try {
            const old = JSON.parse(localStorage.getItem('tet-weather-cache-v4') || 'null');
            hasCachedWeather = Boolean(old && Number.isFinite(old.temp));
        } catch {}

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const lat = pos.coords && pos.coords.latitude;
                        const lon = pos.coords && pos.coords.longitude;
                        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                            resolve(null);
                            return;
                        }

                        let place = await this.reverseGeocodeWard(lat, lon);
                        const hasExactPlace = Boolean(place && place.city);

                        if (!hasExactPlace) {
                            let prevCity = '';
                            let prevFull = '';
                            try {
                                const old = JSON.parse(localStorage.getItem('tet-weather-cache-v4') || 'null');
                                if (old && old.city && old.city !== 'Vị trí của bạn') {
                                    prevCity = this.normalizeVietnamesePlace(old.city);
                                    prevFull = this.normalizeVietnamesePlace(old.fullLocation || old.city);
                                }
                            } catch {}
                            if (!prevCity) {
                                const ipPlace = await this.resolveIpFallbackLocation();
                                if (ipPlace) {
                                    prevCity = ipPlace.city;
                                    prevFull = ipPlace.fullLocation;
                                }
                            }
                            place = {
                                city: prevCity || 'Khu vực của bạn',
                                fullLocation: prevFull || prevCity || `${lat.toFixed(3)}, ${lon.toFixed(3)}`
                            };
                        }

                        const saved = await this.fetchAndSaveWeather(
                            lat,
                            lon,
                            place.city,
                            place.fullLocation,
                            'gps',
                            hasCachedWeather,
                            true,
                            reqId
                        );

                        if (manualClick) {
                            if (saved) {
                                this.showWeatherToast(
                                    hasExactPlace
                                        ? `📍 Đã cập nhật thời tiết tại ${saved.fullLocation}!`
                                        : `📍 Đã cập nhật nhiệt độ theo GPS (${saved.city}).`
                                );
                            } else {
                                this.showWeatherToast('⚠️ Đã định vị GPS nhưng không tải được dữ liệu thời tiết, vui lòng thử lại.');
                            }
                        }
                        resolve(saved);
                    } finally {
                        this.isGpsLoading = false;
                        if (btn) btn.classList.remove('is-loading');
                    }
                },
                (err) => {
                    this.isGpsLoading = false;
                    if (btn) btn.classList.remove('is-loading');
                    if (manualClick) {
                        const msg = err && err.code === 1
                            ? '⚠️ Bạn đã từ chối quyền vị trí — vẫn giữ thời tiết khu vực hiện tại.'
                            : '⚠️ Không lấy được tín hiệu GPS lúc này, vui lòng thử lại sau.';
                        this.showWeatherToast(msg);
                    }
                    resolve(null);
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
            );
        });
    }

    async isGeolocationGrantedSilently() {
        if (!navigator.permissions || typeof navigator.permissions.query !== 'function') return false;
        try {
            const status = await navigator.permissions.query({ name: 'geolocation' });
            return status.state === 'granted';
        } catch {
            return false;
        }
    }

    async initWeatherWidget() {
        if (!this.elements.weatherPill) return;

        if (this.elements.weatherGpsBtn) {
            this.elements.weatherGpsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.tetAudio) window.tetAudio.playLuckyChime();
                this.fetchWeatherByGps(true);
            });
        }

        const CACHE_KEY = 'tet-weather-cache-v4';
        const CACHE_TTL_MS = 20 * 60 * 1000;
        let cached = null;
        try {
            const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
            if (parsed && Number.isFinite(parsed.temp) && Number.isFinite(parsed.ts)) {
                cached = parsed;
            }
        } catch {}

        if (cached) {
            this.renderWeatherPill(
                cached.temp,
                cached.city,
                cached.code,
                cached.isDay,
                cached.fullLocation,
                cached.source === 'gps'
            );
        }

        const isExpired = !cached || Date.now() - cached.ts >= CACHE_TTL_MS;
        const gpsAlreadyGranted = await this.isGeolocationGrantedSilently();

        if (gpsAlreadyGranted && (isExpired || cached.source !== 'gps')) {
            await this.fetchWeatherByGps(false);
        } else if (isExpired && cached && cached.source === 'gps' && Number.isFinite(cached.lat) && Number.isFinite(cached.lon)) {
            const reqId = ++this.weatherReqId;
            await this.fetchAndSaveWeather(cached.lat, cached.lon, cached.city, cached.fullLocation, 'gps', cached, true, reqId);
        } else if (isExpired) {
            await this.refreshWeatherByIp(cached);
        }

        this.weatherTimer = setInterval(async () => {
            if (document.hidden) return;
            let latest = null;
            try {
                const p = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
                if (p && Number.isFinite(p.lat) && Number.isFinite(p.lon)) latest = p;
            } catch {}

            if (await this.isGeolocationGrantedSilently()) {
                this.fetchWeatherByGps(false);
            } else if (latest && latest.source === 'gps') {
                const reqId = ++this.weatherReqId;
                this.fetchAndSaveWeather(latest.lat, latest.lon, latest.city, latest.fullLocation, 'gps', latest, true, reqId);
            } else {
                this.refreshWeatherByIp(latest);
            }
        }, CACHE_TTL_MS);
    }

    updateMain() {
        const nowMs = Date.now();

        // Vietnam UTC+7 Wall-Clock & Calendar Date
        const vnNow = (window.LunarEngine && typeof window.LunarEngine.getVietnamNow === 'function')
            ? window.LunarEngine.getVietnamNow()
            : (() => {
                const dObj = new Date(nowMs + 7 * 3600000);
                return {
                    year: dObj.getUTCFullYear(),
                    month: dObj.getUTCMonth() + 1,
                    day: dObj.getUTCDate(),
                    dayOfWeek: dObj.getUTCDay(),
                    hours: dObj.getUTCHours(),
                    minutes: dObj.getUTCMinutes(),
                    seconds: dObj.getUTCSeconds()
                };
            })();

        const hh = String(vnNow.hours).padStart(2, '0');
        const mm = String(vnNow.minutes).padStart(2, '0');
        const ss = String(vnNow.seconds).padStart(2, '0');
        const timeStr = `${hh}:${mm}:${ss}`;

        if (this.elements.navClockTime) {
            this.elements.navClockTime.textContent = timeStr;
        }

        const dateKey = `${vnNow.year}-${vnNow.month}-${vnNow.day}`;
        if (this.prevDateString !== dateKey) {
            const shouldRefreshMilestones = Boolean(this.prevDateString);
            this.prevDateString = dateKey;
            // Auto-rollover to next year's Tết when passing 15/01 Âm lịch -> 16/01 Âm lịch
            const cycleChanged = this.syncActiveTetCycle();

            const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const dayName = dayNames[vnNow.dayOfWeek];
            const d = String(vnNow.day).padStart(2, '0');
            const m = String(vnNow.month).padStart(2, '0');
            const y = vnNow.year;

            if (this.elements.solarDate) {
                this.elements.solarDate.textContent = `${dayName}, ${d}/${m}/${y}`;
            }
            if (this.elements.navClockDate) {
                this.elements.navClockDate.textContent = `${d}/${m}/${y}`;
            }

            if (window.LunarEngine) {
                const lunar = window.LunarEngine.convertSolar2Lunar(vnNow.day, vnNow.month, vnNow.year, 7);
                const canChiYear = window.LunarEngine.getCanChiYear(lunar.year);
                const lunarD = String(lunar.day).padStart(2, '0');
                const lunarM = String(lunar.month).padStart(2, '0');
                const leapSuffix = lunar.isLeap ? ' Nhuận' : '';
                const leapShort = lunar.isLeap ? 'N' : '';
                if (this.elements.lunarDate) {
                    this.elements.lunarDate.textContent = `${lunarD}/${lunarM}${leapSuffix} (${canChiYear})`;
                }
                if (this.elements.navClockLunar) {
                    this.elements.navClockLunar.textContent = `(Âm: ${lunarD}/${lunarM}${leapShort})`;
                }
            }

            if (shouldRefreshMilestones && !cycleChanged) {
                this.renderMilestones();
            }
        }

        const diff = this.targetDate.getTime() - nowMs;

        if (diff <= 0) {
            this.handleTetArrived();
            return;
        }

        // Ensure normal countdown grid is visible when switching back to a future target
        if (this.elements.timerGrid) {
            this.elements.timerGrid.classList.remove('hidden');
        }
        if (this.elements.celebrationBanner) {
            this.elements.celebrationBanner.classList.add('hidden');
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

        // Progress bar (updated only once per second; cap label at 99.9% while diff > 0)
        const totalDuration = this.targetDate.getTime() - this.startDate.getTime();
        const elapsed = nowMs - this.startDate.getTime();
        const percentNum = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        const barWidthPct = percentNum.toFixed(1);
        const labelPct = Math.min(99.9, percentNum).toFixed(1);
        this.currentPercent = percentNum;

        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${barWidthPct}%`;
        }
        if (this.elements.progressHead) {
            this.elements.progressHead.style.left = `${barWidthPct}%`;
        }
        if (this.elements.headerProgressBar) {
            this.elements.headerProgressBar.style.width = `${barWidthPct}%`;
        }
        if (this.elements.progressText) {
            const cfg = this.targets[this.activeTargetKey] || this.targets.tet;
            this.elements.progressText.textContent = `${cfg.progressPrefix}: ${labelPct}%`;
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

        if (this.elements.days) this.elements.days.textContent = '00';
        if (this.elements.hours) this.elements.hours.textContent = '00';
        if (this.elements.minutes) this.elements.minutes.textContent = '00';
        if (this.elements.seconds) this.elements.seconds.textContent = '00';
        this.prevValues = { d: 0, h: 0, m: 0, s: 0 };

        if (this.activeTargetKey !== 'tet') {
            if (this.elements.timerGrid) {
                this.elements.timerGrid.classList.remove('hidden');
            }
            if (this.elements.celebrationBanner) {
                this.elements.celebrationBanner.classList.add('hidden');
            }
            if (this.elements.progressText) {
                this.elements.progressText.textContent = '🥂 Sự kiện Year End Party Pancake 2027 đã chính thức bắt đầu!';
            }
            return;
        }

        if (this.elements.progressText) {
            const cfg = this.targets.tet;
            this.elements.progressText.textContent = `${cfg.progressPrefix}: 100.0%`;
        }

        // Keep #countdown-main-box visible so Weather, Lunar Calendar & Target Switcher stay accessible
        if (this.elements.celebrationBanner) {
            this.elements.celebrationBanner.style.display = '';
            this.elements.celebrationBanner.classList.remove('hidden');
        }
        if (!this.hasTriggeredTetCelebration) {
            this.hasTriggeredTetCelebration = true;
            if (window.fireworks) {
                window.fireworks.triggerFrenzy(15);
            }
        }
    }

    renderMilestones() {
        if (!this.elements.milestoneList) return;
        this.elements.milestoneList.innerHTML = '';

        const vnDayIndex = (ts) => Math.floor((ts + 7 * 3600000) / 86400000);
        const todayIdx = vnDayIndex(Date.now());

        this.milestones.forEach(m => {
            const targetIdx = vnDayIndex(m.date.getTime());
            const diffDays = targetIdx - todayIdx;
            const isPassed = diffDays < 0;
            const isToday = diffDays === 0;

            const card = document.createElement('div');
            card.className = `milestone-card ${isPassed ? 'passed' : ''}${isToday ? ' active-today' : ''}`;
            card.id = `ms-${m.id}`;

            const iconEl = document.createElement('div');
            iconEl.className = 'milestone-icon';
            iconEl.textContent = m.icon;

            const contentEl = document.createElement('div');
            contentEl.className = 'milestone-content';

            const titleEl = document.createElement('div');
            titleEl.className = 'milestone-title';
            titleEl.textContent = m.name;

            const descEl = document.createElement('div');
            descEl.className = 'milestone-desc';
            descEl.textContent = m.desc;

            const badgeEl = document.createElement('div');
            badgeEl.className = 'milestone-badge';
            badgeEl.textContent = isPassed
                ? '✓ Đã hoàn thành'
                : (isToday ? '✨ Đang diễn ra hôm nay!' : `Còn ${diffDays} ngày`);

            contentEl.append(titleEl, descEl, badgeEl);
            card.append(iconEl, contentEl);
            this.elements.milestoneList.appendChild(card);
        });
    }
}

window.TetCountdown = TetCountdown;
