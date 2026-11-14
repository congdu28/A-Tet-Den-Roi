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

        // Initialize lunar calendar engine if available
        if (window.TetLunarCalendar) {
            this.lunarCalendar = new window.TetLunarCalendar();
        }
    }

    start() {
        this.renderMilestones();
        this.updateMain();

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
        const percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)).toFixed(1);

        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${percent}%`;
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `Hành trình năm cũ tới Tết Đinh Mùi: ${percent}%`;
        }
    }

    handleTetArrived() {
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
