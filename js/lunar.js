/**
 * Vietnamese Solar-Lunar Calendar Engine & Monthly Calendar View
 * Based on Dr. Ho Ngoc Duc's Astronomical Algorithms (Accurate for GMT+7 Vietnam)
 */
(function() {
    const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
    const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
    const TIET_KHI = [
        'Xuân Phân', 'Thanh Minh', 'Cốc Vũ', 'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng',
        'Hạ Chí', 'Tiểu Thử', 'Đại Thử', 'Lập Thu', 'Xử Thử', 'Bạch Lộ',
        'Thu Phân', 'Hàn Lộ', 'Sương Giáng', 'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết',
        'Đông Chí', 'Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập'
    ];

    const HOANG_DAO_TABLE = {
        'Tý': ['Tý (23h-1h)', 'Sửu (1h-3h)', 'Mão (5h-7h)', 'Ngọ (11h-13h)', 'Thân (15h-17h)', 'Dậu (17h-19h)'],
        'Ngọ': ['Tý (23h-1h)', 'Sửu (1h-3h)', 'Mão (5h-7h)', 'Ngọ (11h-13h)', 'Thân (15h-17h)', 'Dậu (17h-19h)'],
        'Sửu': ['Dần (3h-5h)', 'Mão (5h-7h)', 'Tỵ (9h-11h)', 'Thân (15h-17h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)'],
        'Mùi': ['Dần (3h-5h)', 'Mão (5h-7h)', 'Tỵ (9h-11h)', 'Thân (15h-17h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)'],
        'Dần': ['Tý (23h-1h)', 'Sửu (1h-3h)', 'Thìn (7h-9h)', 'Tỵ (9h-11h)', 'Mùi (13h-15h)', 'Tuất (19h-21h)'],
        'Thân': ['Tý (23h-1h)', 'Sửu (1h-3h)', 'Thìn (7h-9h)', 'Tỵ (9h-11h)', 'Mùi (13h-15h)', 'Tuất (19h-21h)'],
        'Mão': ['Tý (23h-1h)', 'Dần (3h-5h)', 'Mão (5h-7h)', 'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Dậu (17h-19h)'],
        'Dậu': ['Tý (23h-1h)', 'Dần (3h-5h)', 'Mão (5h-7h)', 'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Dậu (17h-19h)'],
        'Thìn': ['Dần (3h-5h)', 'Thìn (7h-9h)', 'Tỵ (9h-11h)', 'Thân (15h-17h)', 'Dậu (17h-19h)', 'Hợi (21h-23h)'],
        'Tuất': ['Dần (3h-5h)', 'Thìn (7h-9h)', 'Tỵ (9h-11h)', 'Thân (15h-17h)', 'Dậu (17h-19h)', 'Hợi (21h-23h)'],
        'Tỵ': ['Sửu (1h-3h)', 'Thìn (7h-9h)', 'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)'],
        'Hợi': ['Sửu (1h-3h)', 'Thìn (7h-9h)', 'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)']
    };

    // 12 Thần Hoàng Đạo / Hắc Đạo truyền thống Lịch Vạn Niên Việt Nam
    const HOANG_DAO_STARS = [
        { name: 'Thanh Long', isGood: true },
        { name: 'Minh Đường', isGood: true },
        { name: 'Thiên Hình', isGood: false },
        { name: 'Chu Tước', isGood: false },
        { name: 'Kim Quỹ', isGood: true },
        { name: 'Thiên Đức', isGood: true },
        { name: 'Bạch Hổ', isGood: false },
        { name: 'Ngọc Đường', isGood: true },
        { name: 'Thiên Lao', isGood: false },
        { name: 'Huyền Vũ', isGood: false },
        { name: 'Tư Mệnh', isGood: true },
        { name: 'Câu Trận', isGood: false }
    ];

    function getHoangDaoDay(lunarMonth, chiName) {
        const chiIdx = CHI.indexOf(chiName);
        if (chiIdx === -1) return { isHoangDao: false, starName: 'Bình Thường', shortStatus: 'Bình Thường' };
        // Tháng Giêng & 7 khởi Tý (0); Tháng 2 & 8 khởi Dần (2); Tháng 3 & 9 khởi Thìn (4);
        // Tháng 4 & 10 khởi Ngọ (6); Tháng 5 & 11 khởi Thân (8); Tháng 6 & 12 khởi Tuất (10).
        const startChi = ((lunarMonth - 1) % 6) * 2;
        const offset = (chiIdx - startChi + 12) % 12;
        const star = HOANG_DAO_STARS[offset];
        return {
            isHoangDao: star.isGood,
            starName: star.name + (star.isGood ? ' Hoàng Đạo' : ' Hắc Đạo'),
            shortStatus: star.isGood ? 'Hoàng Đạo' : 'Hắc Đạo',
            rawName: star.name
        };
    }

    function INT(d) { return Math.floor(d); }

    function jdFromDate(dd, mm, yy) {
        let a = INT((14 - mm) / 12);
        let y = yy + 4800 - a;
        let m = mm + 12 * a - 3;
        let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
        if (jd < 2299161) {
            jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
        }
        return jd;
    }

    function getNewMoonDay(k, timeZone) {
        let T = k / 1236.85;
        let T2 = T * T;
        let T3 = T2 * T;
        let dr = Math.PI / 180;
        let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
        let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
        C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
        C1 = C1 - 0.0004 * Math.sin(3 * dr * Mpr);
        C1 = C1 + 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
        C1 = C1 - 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
        C1 = C1 - 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
        C1 = C1 + 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
        let deltat;
        if (T < -11) {
            deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
        } else {
            deltat = -0.000078 + 0.000094 * T + 0.000045 * T2;
        }
        let JdNew = Jd1 + C1 - deltat;
        return INT(JdNew + 0.5 + timeZone / 24);
    }

    function getSunLongitude(dayNumber, timeZone) {
        let T = (dayNumber - 2451545.5 - timeZone / 24) / 36525;
        let T2 = T * T;
        let dr = Math.PI / 180;
        let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
        let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
        let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
        DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
        let L = L0 + DL;
        L = L * dr;
        L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
        return INT(L / Math.PI * 6);
    }

    function getLunarMonth11(yy, timeZone) {
        let off = jdFromDate(31, 12, yy) - 2415021;
        let k = INT(off / 29.530588853);
        let nm = getNewMoonDay(k, timeZone);
        let sunLong = getSunLongitude(nm, timeZone);
        if (sunLong >= 9) {
            nm = getNewMoonDay(k - 1, timeZone);
        }
        return nm;
    }

    function getLeapMonthOffset(a11, timeZone) {
        let k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        let last = 0;
        let i = 1;
        let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
        do {
            last = arc;
            i++;
            arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
        } while (arc !== last && i < 14);
        return i - 1;
    }

    function convertSolar2Lunar(dd, mm, yy, timeZone = 7) {
        let dayNumber = jdFromDate(dd, mm, yy);
        let k = INT((dayNumber - 2415021.076998695) / 29.530588853);
        let monthStart = getNewMoonDay(k + 1, timeZone);
        if (monthStart > dayNumber) {
            monthStart = getNewMoonDay(k, timeZone);
        }
        let a11 = getLunarMonth11(yy, timeZone);
        let b11 = a11;
        let lunarYear;
        if (a11 >= monthStart) {
            lunarYear = yy;
            a11 = getLunarMonth11(yy - 1, timeZone);
        } else {
            lunarYear = yy + 1;
            b11 = getLunarMonth11(yy + 1, timeZone);
        }
        let lunarDay = dayNumber - monthStart + 1;
        let diff = INT((monthStart - a11) / 29);
        let isLeap = false;
        let lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff === leapMonthDiff) {
                    isLeap = true;
                }
            }
        }
        if (lunarMonth > 12) {
            lunarMonth = lunarMonth - 12;
        }
        if (lunarMonth >= 11 && diff < 4) {
            lunarYear -= 1;
        }
        return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeap: isLeap, jd: dayNumber };
    }

    function getCanChiYear(year) {
        return CAN[(year + 6) % 10] + ' ' + CHI[(year + 8) % 12];
    }

    function getCanChiDay(jd) {
        const canIndex = (jd + 9) % 10;
        const chiIndex = (jd + 1) % 12;
        return {
            full: CAN[canIndex] + ' ' + CHI[chiIndex],
            can: CAN[canIndex],
            chi: CHI[chiIndex]
        };
    }

    function getVietnamNow() {
        const vn = new Date(Date.now() + 7 * 3600000);
        return {
            year: vn.getUTCFullYear(),
            month: vn.getUTCMonth() + 1,
            day: vn.getUTCDate(),
            dayOfWeek: vn.getUTCDay(),
            hours: vn.getUTCHours(),
            minutes: vn.getUTCMinutes(),
            seconds: vn.getUTCSeconds()
        };
    }

    function getSolarTermName(dayNumber, timeZone = 7) {
        // Evaluate solar longitude at 24:00 local time (dayNumber + 1) per Ho Ngoc Duc standard
        let T = (dayNumber + 1 - 2451545.5 - timeZone / 24) / 36525;
        let T2 = T * T;
        let dr = Math.PI / 180;
        let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
        let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
        let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
        DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
        let L = (L0 + DL) * dr;
        L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
        let termIndex = INT(L / Math.PI * 12);
        return TIET_KHI[(termIndex % 24 + 24) % 24];
    }

    // Special Tet Milestones mapping (Lunar MM-DD or Solar YYYY-MM-DD)
    function getTetEventTag(solarD, solarM, solarY, lunar) {
        if (solarY === 2027 && solarM === 1 && solarD === 23) {
            return { name: 'Year End Party Pancake 2027', icon: '🥂', type: 'tet-milestone' };
        }
        if (!lunar || lunar.isLeap) return null;
        const lunarD = lunar.day;
        const lunarM = lunar.month;
        if (lunarM === 12 && lunarD === 23) {
            return { name: '23 Tháng Chạp - Cúng Tiễn Ông Táo', icon: '🐟', type: 'tet-milestone' };
        }
        if (lunarM === 12 && lunarD === 28) {
            return { name: '28 Tết - Nấu Bánh Chưng Xanh', icon: '🎋', type: 'tet-milestone' };
        }
        if (lunarM === 12 && (lunarD === 29 || lunarD === 30)) {
            const nextSolar = jdToDate(lunar.jd + 1);
            const nextLunar = convertSolar2Lunar(nextSolar[0], nextSolar[1], nextSolar[2], 7);
            if (!nextLunar.isLeap && nextLunar.month === 1 && nextLunar.day === 1) {
                return { name: `${lunarD} Tháng Chạp - Tất Niên & Đêm Giao Thừa`, icon: '🎆', type: 'tet-highlight' };
            }
        }
        if (lunarM === 1 && lunarD === 1) {
            return { name: 'MÙNG 1 TẾT NGUYÊN ĐÁN (Tết Cha)', icon: '🧧', type: 'tet-king' };
        }
        if (lunarM === 1 && lunarD === 2) {
            return { name: 'MÙNG 2 TẾT (Tết Mẹ)', icon: '🌸', type: 'tet-king' };
        }
        if (lunarM === 1 && lunarD === 3) {
            return { name: 'MÙNG 3 TẾT (Tết Thầy)', icon: '📚', type: 'tet-king' };
        }
        if (lunarM === 1 && lunarD === 15) {
            return { name: 'Rằm Tháng Giêng (Tết Nguyên Tiêu)', icon: '🏮', type: 'tet-milestone' };
        }
        return null;
    }

    /**
     * Lunar Calendar Interactive Modal & Month Viewer Class
     */
    class TetLunarCalendar {
        constructor() {
            const vnToday = getVietnamNow();
            this.viewYear = vnToday.year;
            this.viewMonth = vnToday.month; // 1-12
            this.selectedDate = {
                day: vnToday.day,
                month: vnToday.month,
                year: vnToday.year
            };

            this.tetTargetJd = jdFromDate(6, 2, 2027);

            this.initDOM();
            this.bindEvents();
        }

        initDOM() {
            this.modal = document.getElementById('lunar-calendar-modal');
            this.openBtn = document.getElementById('btn-open-lunar-calendar');
            this.closeBtn = document.getElementById('btn-close-calendar');
            this.gridContainer = document.getElementById('cal-days-grid');
            this.monthTitle = document.getElementById('cal-month-title');
            this.monthLunarSubtitle = document.getElementById('cal-month-lunar-subtitle');
            this.prevBtn = document.getElementById('btn-cal-prev-month');
            this.nextBtn = document.getElementById('btn-cal-next-month');
            this.todayBtn = document.getElementById('btn-cal-today');
            this.tetJumpBtn = document.getElementById('btn-cal-tet');
            this.detailBox = document.getElementById('cal-selected-day-details');
        }

        syncSelectedDateForViewMonth() {
            const vnToday = getVietnamNow();
            if (this.viewYear === vnToday.year && this.viewMonth === vnToday.month) {
                this.selectedDate = { day: vnToday.day, month: vnToday.month, year: vnToday.year };
                return;
            }
            if (this.viewYear === 2027 && this.viewMonth === 2) {
                this.selectedDate = { day: 6, month: 2, year: 2027 };
                return;
            }
            const daysInMonth = new Date(Date.UTC(this.viewYear, this.viewMonth, 0)).getUTCDate();
            this.selectedDate = {
                day: Math.min(this.selectedDate.day || 1, daysInMonth),
                month: this.viewMonth,
                year: this.viewYear
            };
        }

        bindEvents() {
            if (this.openBtn) {
                this.openBtn.addEventListener('click', () => this.open());
            }
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }
            if (this.modal) {
                this.modal.addEventListener('click', (e) => {
                    if (e.target === this.modal) this.close();
                });
            }
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    if (this.viewYear <= 1900 && this.viewMonth <= 1) return;
                    this.viewMonth--;
                    if (this.viewMonth < 1) {
                        this.viewMonth = 12;
                        this.viewYear--;
                    }
                    this.syncSelectedDateForViewMonth();
                    this.render();
                });
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    if (this.viewYear >= 2100 && this.viewMonth >= 12) return;
                    this.viewMonth++;
                    if (this.viewMonth > 12) {
                        this.viewMonth = 1;
                        this.viewYear++;
                    }
                    this.syncSelectedDateForViewMonth();
                    this.render();
                });
            }
            if (this.todayBtn) {
                this.todayBtn.addEventListener('click', () => {
                    const vnToday = getVietnamNow();
                    this.viewYear = vnToday.year;
                    this.viewMonth = vnToday.month;
                    this.selectedDate = {
                        day: vnToday.day,
                        month: vnToday.month,
                        year: vnToday.year
                    };
                    this.render();
                });
            }
            if (this.tetJumpBtn) {
                this.tetJumpBtn.addEventListener('click', () => {
                    this.viewYear = 2027;
                    this.viewMonth = 2;
                    this.selectedDate = { day: 6, month: 2, year: 2027 };
                    this.render();
                });
            }
        }

        open() {
            if (this.modal) {
                this.modal.classList.remove('hidden');
                if (window.syncModalScrollLock) window.syncModalScrollLock();
                this.render();
            }
            if (window.tetAudio) window.tetAudio.playLuckyChime();
        }

        close() {
            if (this.modal) {
                this.modal.classList.add('hidden');
                if (window.syncModalScrollLock) window.syncModalScrollLock();
            }
        }

        render() {
            if (!this.gridContainer) return;

            // Month titles
            if (this.monthTitle) {
                this.monthTitle.textContent = `Tháng ${String(this.viewMonth).padStart(2, '0')} / ${this.viewYear}`;
            }

            const daysInMonth = new Date(Date.UTC(this.viewYear, this.viewMonth, 0)).getUTCDate();
            const daysInPrevMonth = new Date(Date.UTC(this.viewYear, this.viewMonth - 1, 0)).getUTCDate();

            // Accurate Lunar month range (supports months spanning 2 lunar months/years)
            if (this.monthLunarSubtitle) {
                const startLunar = convertSolar2Lunar(1, this.viewMonth, this.viewYear, 7);
                const endLunar = convertSolar2Lunar(daysInMonth, this.viewMonth, this.viewYear, 7);
                const startYearName = getCanChiYear(startLunar.year);
                const endYearName = getCanChiYear(endLunar.year);
                const fmtMonth = (l, yName) => `Tháng ${l.month}${l.isLeap ? ' Nhuận' : ''} ${yName}`;
                if (startLunar.month === endLunar.month && startLunar.isLeap === endLunar.isLeap && startLunar.year === endLunar.year) {
                    this.monthLunarSubtitle.textContent = `(Âm lịch: Tháng ${startLunar.month}${startLunar.isLeap ? ' Nhuận' : ''} năm ${startYearName})`;
                } else if (startLunar.year === endLunar.year) {
                    this.monthLunarSubtitle.textContent = `(Âm lịch: Tháng ${startLunar.month}${startLunar.isLeap ? 'N' : ''} – Tháng ${endLunar.month}${endLunar.isLeap ? 'N' : ''} năm ${endYearName})`;
                } else {
                    this.monthLunarSubtitle.textContent = `(Âm lịch: ${fmtMonth(startLunar, startYearName)} – ${fmtMonth(endLunar, endYearName)})`;
                }
            }

            this.gridContainer.innerHTML = '';

            // First day of current view month (UTC-pure calendar math)
            let startDayOfWeek = new Date(Date.UTC(this.viewYear, this.viewMonth - 1, 1)).getUTCDay(); // 0=Sun..6=Sat
            startDayOfWeek = (startDayOfWeek === 0) ? 6 : startDayOfWeek - 1;

            const vnToday = getVietnamNow();
            const todayD = vnToday.day;
            const todayM = vnToday.month;
            const todayY = vnToday.year;

            // Total 42 cells (6 rows x 7 days)
            for (let i = 0; i < 42; i++) {
                let cellDay, cellMonth, cellYear, isOtherMonth = false;

                if (i < startDayOfWeek) {
                    // Previous month
                    cellDay = daysInPrevMonth - (startDayOfWeek - 1 - i);
                    cellMonth = this.viewMonth - 1;
                    cellYear = this.viewYear;
                    if (cellMonth < 1) {
                        cellMonth = 12;
                        cellYear--;
                    }
                    isOtherMonth = true;
                } else if (i >= startDayOfWeek + daysInMonth) {
                    // Next month
                    cellDay = i - (startDayOfWeek + daysInMonth) + 1;
                    cellMonth = this.viewMonth + 1;
                    cellYear = this.viewYear;
                    if (cellMonth > 12) {
                        cellMonth = 1;
                        cellYear++;
                    }
                    isOtherMonth = true;
                } else {
                    // Current month
                    cellDay = i - startDayOfWeek + 1;
                    cellMonth = this.viewMonth;
                    cellYear = this.viewYear;
                }

                // Solar to Lunar
                const lunar = convertSolar2Lunar(cellDay, cellMonth, cellYear, 7);
                const canChiCell = getCanChiDay(lunar.jd);
                const hoangDaoCell = getHoangDaoDay(lunar.month, canChiCell.chi);
                const isToday = (cellDay === todayD && cellMonth === todayM && cellYear === todayY);
                const isSelected = (cellDay === this.selectedDate.day && cellMonth === this.selectedDate.month && cellYear === this.selectedDate.year);
                const tetTag = getTetEventTag(cellDay, cellMonth, cellYear, lunar);

                const dayCol = i % 7; // 0 = Mon, ..., 5 = Sat, 6 = Sun
                const isWeekend = (dayCol === 5 || dayCol === 6);

                const cell = document.createElement('div');
                let cellClasses = ['cal-day-cell'];
                if (isOtherMonth) cellClasses.push('other-month');
                if (isToday) cellClasses.push('today');
                if (isSelected) cellClasses.push('selected');
                if (hoangDaoCell.isHoangDao) cellClasses.push('is-hoang-dao');
                if (tetTag) cellClasses.push(tetTag.type);
                if (isWeekend) cellClasses.push('weekend');

                cell.className = cellClasses.join(' ');

                // Display text for lunar day
                let lunarText = String(lunar.day);
                if (lunar.day === 1) {
                    lunarText = `${lunar.day}/${lunar.month}${lunar.isLeap ? 'N' : ''}`;
                    cell.classList.add('lunar-mung-1');
                } else if (lunar.day === 15) {
                    lunarText = '15 (Rằm)';
                    cell.classList.add('lunar-ram');
                }

                let badgeHtml = '';
                if (tetTag) {
                    badgeHtml += `<span class="cal-tet-badge" title="${tetTag.name}">${tetTag.icon}</span>`;
                }
                if (hoangDaoCell.isHoangDao) {
                    badgeHtml += `<span class="cal-hoang-dao-star" title="Ngày ${hoangDaoCell.starName} (Cát Lành Đại Cát)">⭐</span>`;
                }

                cell.innerHTML = `
                    <div class="cal-day-header">
                        <span class="cal-day-solar">${cellDay}</span>
                        <div class="cal-badges-wrap">${badgeHtml}</div>
                    </div>
                    <div class="cal-day-lunar ${lunar.day === 1 ? 'is-first-day' : ''}">${lunarText}</div>
                `;

                cell.addEventListener('click', () => {
                    if (cellMonth === this.viewMonth && cellYear === this.viewYear) {
                        this.selectedDate = { day: cellDay, month: cellMonth, year: cellYear };
                        const prevSelected = this.gridContainer.querySelector('.cal-day-cell.selected');
                        if (prevSelected) prevSelected.classList.remove('selected');
                        cell.classList.add('selected');
                        this.renderSelectedDayDetails();
                    } else {
                        this.viewMonth = cellMonth;
                        this.viewYear = cellYear;
                        this.selectedDate = { day: cellDay, month: cellMonth, year: cellYear };
                        this.render();
                    }
                });

                this.gridContainer.appendChild(cell);
            }

            this.renderSelectedDayDetails();
        }

        renderSelectedDayDetails() {
            if (!this.detailBox) return;
            const { day, month, year } = this.selectedDate;
            const lunar = convertSolar2Lunar(day, month, year, 7);
            const canChiDay = getCanChiDay(lunar.jd);
            const canChiYear = getCanChiYear(lunar.year);
            const tietKhi = getSolarTermName(lunar.jd, 7);
            const hoangDaoInfo = getHoangDaoDay(lunar.month, canChiDay.chi);
            const hoangDaoList = HOANG_DAO_TABLE[canChiDay.chi] || [];
            const tetTag = getTetEventTag(day, month, year, lunar);

            // Calculate exact calendar-day diff from selected date to Tet 2027 via Julian Day Number (timezone-immune)
            const diffDays = this.tetTargetJd - lunar.jd;
            const vnToday = getVietnamNow();
            const isSelectedToday = (day === vnToday.day && month === vnToday.month && year === vnToday.year);

            let diffText = '';
            if (diffDays === 0) {
                diffText = isSelectedToday
                    ? '🎉 <strong>HÔM NAY CHÍNH LÀ MÙNG 1 TẾT ĐINH MÙI 2027!</strong>'
                    : '🎉 <strong>NGÀY NÀY CHÍNH LÀ MÙNG 1 TẾT ĐINH MÙI 2027!</strong>';
            } else if (diffDays > 0) {
                diffText = `⏳ Còn đúng <strong>${diffDays} ngày</strong> tính tới Mùng 1 Tết Đinh Mùi 2027!`;
            } else {
                diffText = `✨ Sau Mùng 1 Tết Đinh Mùi <strong>${Math.abs(diffDays)} ngày</strong>.`;
            }

            const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const solarDayOfWeek = dayNames[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

            let eventNoticeHtml = '';
            if (tetTag) {
                eventNoticeHtml = `
                    <div class="cal-detail-event-highlight">
                        <span>${tetTag.icon}</span> <strong>${tetTag.name}</strong>
                    </div>
                `;
            }

            this.detailBox.innerHTML = `
                <div class="cal-detail-card">
                    <div class="cal-detail-header-row">
                        <div class="cal-detail-main-date">
                            <span class="day-num">${day}</span>
                            <div class="day-meta">
                                <div class="solar-full">DƯƠNG LỊCH: <strong>${solarDayOfWeek}, ngày ${day}/${month}/${year}</strong></div>
                                <div class="lunar-full">ÂM LỊCH: <strong>Ngày ${lunar.day} tháng ${lunar.month}${lunar.isLeap ? ' (Nhuận)' : ''} năm ${canChiYear}</strong></div>
                            </div>
                        </div>
                        <div class="cal-detail-canchi-group">
                            <div class="cal-detail-canchi-badge">
                                Ngày <strong>${canChiDay.full}</strong>
                            </div>
                            <div class="cal-detail-hoangdao-badge ${hoangDaoInfo.isHoangDao ? 'is-good' : 'is-neutral'}">
                                ${hoangDaoInfo.isHoangDao ? '⭐ ' + hoangDaoInfo.starName : '🌑 ' + hoangDaoInfo.starName}
                            </div>
                        </div>
                    </div>

                    ${eventNoticeHtml}

                    <div class="cal-detail-grid-info">
                        <div class="cal-info-item">
                            <span>🌿 Tiết Khí:</span> <strong>${tietKhi}</strong>
                        </div>
                        <div class="cal-info-item">
                            <span>🏮 Đếm ngược Tết 2027:</span> <span>${diffText}</span>
                        </div>
                        <div class="cal-info-item full-width">
                            <div class="cal-hd-header">
                                <span>⭐ Giờ Hoàng Đạo Cát Lành Trong Ngày:</span>
                                <span class="hd-count-tag">${hoangDaoList.length} Khung Giờ</span>
                            </div>
                            <div class="hoang-dao-pills">
                                ${hoangDaoList.map(h => `<span class="hd-pill">${h}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Expose engine & calendar class globally
    window.LunarEngine = {
        convertSolar2Lunar,
        getCanChiYear,
        getCanChiDay,
        getSolarTermName,
        getVietnamNow,
        jdFromDate,
        HOANG_DAO_TABLE
    };
    window.TetLunarCalendar = TetLunarCalendar;
})();
