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

    const ZODIAC_MASCOTS = [
        { chi: 'Tý', icon: '🐭', animal: 'Chuột Vàng' },
        { chi: 'Sửu', icon: '🐮', animal: 'Trâu Vàng' },
        { chi: 'Dần', icon: '🐯', animal: 'Hổ Vàng' },
        { chi: 'Mão', icon: '🐱', animal: 'Mèo Vàng' },
        { chi: 'Thìn', icon: '🐲', animal: 'Rồng Vàng' },
        { chi: 'Tỵ', icon: '🐍', animal: 'Rắn Vàng' },
        { chi: 'Ngọ', icon: '🐴', animal: 'Ngựa Vàng' },
        { chi: 'Mùi', icon: '🐐', animal: 'Dê Vàng' },
        { chi: 'Thân', icon: '🐵', animal: 'Khỉ Vàng' },
        { chi: 'Dậu', icon: '🐔', animal: 'Gà Vàng' },
        { chi: 'Tuất', icon: '🐶', animal: 'Chó Vàng' },
        { chi: 'Hợi', icon: '🐷', animal: 'Heo Vàng' }
    ];
    const DAY_NAMES_VI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

    function jdToDate(jd) {
        let a, b, c;
        if (jd > 2299160) {
            a = jd + 32044;
            b = INT((4 * a + 3) / 146097);
            c = a - INT((b * 146097) / 4);
        } else {
            b = 0;
            c = jd + 32082;
        }
        let d = INT((4 * c + 3) / 1461);
        let e = c - INT((1461 * d) / 4);
        let m = INT((5 * e + 2) / 153);
        let day = e - INT((153 * m + 2) / 5) + 1;
        let month = m + 3 - 12 * INT(m / 10);
        let year = b * 100 + d - 4800 + INT(m / 10);
        return [day, month, year];
    }

    function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap = 0, timeZone = 7) {
        let a11, b11;
        if (lunarMonth < 11) {
            a11 = getLunarMonth11(lunarYear - 1, timeZone);
            b11 = getLunarMonth11(lunarYear, timeZone);
        } else {
            a11 = getLunarMonth11(lunarYear, timeZone);
            b11 = getLunarMonth11(lunarYear + 1, timeZone);
        }
        let k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
        let off = lunarMonth - 11;
        if (off < 0) off += 12;
        if (b11 - a11 > 365) {
            let leapOff = getLeapMonthOffset(a11, timeZone);
            let leapMonth = leapOff - 2;
            if (leapMonth < 0) leapMonth += 12;
            if (lunarLeap !== 0 && lunarMonth !== leapMonth) {
                return { day: 0, month: 0, year: 0, jd: 0 };
            } else if (lunarLeap !== 0 || off >= leapOff) {
                off += 1;
            }
        }
        let monthStart = getNewMoonDay(k + off, timeZone);
        let jd = monthStart + lunarDay - 1;
        let [d, m, y] = jdToDate(jd);
        return { day: d, month: m, year: y, jd };
    }

    function formatSolarMilestone(jd) {
        const [d, m, y] = jdToDate(jd);
        const dd = String(d).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const dow = DAY_NAMES_VI[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
        return {
            day: d,
            month: m,
            year: y,
            dd,
            mm,
            jd,
            dayOfWeekName: dow,
            dateStr: `${dd}/${mm}/${y}`,
            shortStr: `${dd}/${mm}`,
            isoMidnight: `${y}-${mm}-${dd}T00:00:00+07:00`
        };
    }

    function getZodiacMascot(lunarYear) {
        return ZODIAC_MASCOTS[((lunarYear + 8) % 12 + 12) % 12];
    }

    function getTetInfoForYear(tetLunarYear, timeZone = 7) {
        const m1 = convertLunar2Solar(1, 1, tetLunarYear, 0, timeZone);
        const prevM1 = convertLunar2Solar(1, 1, tetLunarYear - 1, 0, timeZone);
        const mung1 = formatSolarMilestone(m1.jd);
        const prevMung1 = formatSolarMilestone(prevM1.jd);

        const tatNienJd = m1.jd - 1;
        const [tnD, tnM, tnY] = jdToDate(tatNienJd);
        const tatNienLunar = convertSolar2Lunar(tnD, tnM, tnY, timeZone);
        const chapDays = tatNienLunar.day; // 29 or 30

        const tatNien = { ...formatSolarMilestone(tatNienJd), lunarDay: chapDays };
        const banhChung = formatSolarMilestone(tatNienJd - (chapDays - 28));
        const ongTao = formatSolarMilestone(tatNienJd - (chapDays - 23));
        const mung2 = formatSolarMilestone(m1.jd + 1);
        const mung3 = formatSolarMilestone(m1.jd + 2);
        const ramThangGieng = formatSolarMilestone(m1.jd + 14);

        return {
            year: tetLunarYear,
            canChi: getCanChiYear(tetLunarYear),
            mascot: getZodiacMascot(tetLunarYear),
            mung1,
            prevMung1,
            ongTao,
            banhChung,
            tatNien,
            mung2,
            mung3,
            ramThangGieng
        };
    }

    // Rule: Up through 15/01 Âm lịch (non-leap) stays in current Lunar year's Tết; from 16/01 ÂL onwards switches to next year's Tết
    function getTetCycleForLunar(lunar, timeZone = 7) {
        const isWithinFirst15SpringDays = (lunar.month === 1 && !lunar.isLeap && lunar.day <= 15);
        const targetYear = isWithinFirst15SpringDays ? lunar.year : (lunar.year + 1);
        return getTetInfoForYear(targetYear, timeZone);
    }

    function getCurrentTetCycle(timeZone = 7) {
        const vn = getVietnamNow();
        const lunar = convertSolar2Lunar(vn.day, vn.month, vn.year, timeZone);
        return getTetCycleForLunar(lunar, timeZone);
    }

    function getCanChiYear(year) {
        return CAN[((year + 6) % 10 + 10) % 10] + ' ' + CHI[((year + 8) % 12 + 12) % 12];
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

    // Fixed Solar Holidays & Commemorative Days in Vietnam (key: 'MM-DD')
    const SOLAR_HOLIDAYS_VI = {
        '01-01': {
            name: 'Tết Dương lịch',
            shortName: 'Tết Dương lịch',
            icon: '🎆',
            type: 'tet-king',
            isDayOff: true,
            note: 'Nghỉ lễ chính thức 01 ngày hưởng nguyên lương'
        },
        '01-09': {
            name: 'Ngày Truyền thống Học sinh - Sinh viên Việt Nam',
            shortName: 'HS - Sinh viên VN',
            icon: '🎓',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kỷ niệm phong trào Học sinh - Sinh viên Việt Nam (09/01/1950)'
        },
        '02-03': {
            name: 'Ngày thành lập Đảng Cộng sản Việt Nam',
            shortName: 'Thành lập Đảng',
            icon: '🚩',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Kỷ niệm thành lập Đảng Cộng sản Việt Nam (03/02/1930)'
        },
        '02-14': {
            name: 'Lễ Tình nhân (Valentine)',
            shortName: 'Valentine 14/2',
            icon: '💝',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Ngày lễ tôn vinh tình yêu đôi lứa'
        },
        '02-27': {
            name: 'Ngày Thầy thuốc Việt Nam',
            shortName: 'Thầy thuốc VN',
            icon: '🩺',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Tôn vinh đội ngũ y bác sĩ và ngành Y tế Việt Nam (27/02/1955)'
        },
        '03-03': {
            name: 'Ngày Truyền thống Bộ đội Biên phòng',
            shortName: 'Bộ đội Biên phòng',
            icon: '🛡️',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Ngày Biên phòng toàn dân & Truyền thống Bộ đội Biên phòng (03/03/1959)'
        },
        '03-08': {
            name: 'Ngày Quốc tế Phụ nữ (8/3)',
            shortName: 'Quốc tế Phụ nữ',
            icon: '🌷',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Tôn vinh quyền bình đẳng và vẻ đẹp của phụ nữ trên toàn thế giới'
        },
        '03-20': {
            name: 'Ngày Quốc tế Hạnh phúc',
            shortName: 'Quốc tế Hạnh phúc',
            icon: '😊',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Ngày Quốc tế Hạnh phúc do Liên Hợp Quốc khởi xướng (20/3)'
        },
        '03-26': {
            name: 'Ngày thành lập Đoàn TNCS Hồ Chí Minh',
            shortName: 'Thành lập Đoàn',
            icon: '🎽',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kỷ niệm thành lập Đoàn Thanh niên Cộng sản Hồ Chí Minh (26/03/1931)'
        },
        '03-27': {
            name: 'Ngày Thể thao Việt Nam',
            shortName: 'Thể thao VN',
            icon: '🏃',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Ngày truyền thống ngành Thể dục Thể thao Việt Nam (27/03/1946)'
        },
        '04-01': {
            name: 'Ngày Cá tháng Tư (April Fools\' Day)',
            shortName: 'Cá tháng Tư',
            icon: '🃏',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Ngày hội vui vẻ quốc tế đầu tháng Tư'
        },
        '04-21': {
            name: 'Ngày Sách và Văn hóa đọc Việt Nam',
            shortName: 'Ngày Sách VN',
            icon: '📖',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Lan tỏa tri thức và phong trào đọc sách toàn dân (21/4)'
        },
        '04-22': {
            name: 'Ngày Trái Đất (Earth Day)',
            shortName: 'Ngày Trái Đất',
            icon: '🌍',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Chung tay bảo vệ thiên nhiên và môi trường sống toàn cầu'
        },
        '04-30': {
            name: 'Ngày Giải phóng miền Nam, Thống nhất đất nước',
            shortName: 'Giải phóng 30/4',
            icon: '🇻🇳',
            type: 'tet-king',
            isDayOff: true,
            note: 'Nghỉ lễ chính thức 01 ngày hưởng nguyên lương (30/04/1975)'
        },
        '05-01': {
            name: 'Ngày Quốc tế Lao động',
            shortName: 'Quốc tế Lao động',
            icon: '🛠️',
            type: 'tet-king',
            isDayOff: true,
            note: 'Nghỉ lễ chính thức 01 ngày hưởng nguyên lương (1/5)'
        },
        '05-07': {
            name: 'Ngày Chiến thắng Điện Biên Phủ',
            shortName: 'Chiến thắng Điện Biên',
            icon: '⭐',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Kỷ niệm Chiến thắng lịch sử Điện Biên Phủ lừng lẫy năm châu (07/05/1954)'
        },
        '05-15': {
            name: 'Ngày thành lập Đội Thiếu niên Tiền phong Hồ Chí Minh',
            shortName: 'Thành lập Đội TNTP',
            icon: '🧣',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kỷ niệm thành lập Đội TNTP Hồ Chí Minh (15/05/1941)'
        },
        '05-19': {
            name: 'Ngày sinh Chủ tịch Hồ Chí Minh',
            shortName: 'Sinh nhật Bác Hồ',
            icon: '🪷',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Kỷ niệm ngày sinh Chủ tịch Hồ Chí Minh kính yêu (19/05/1890)'
        },
        '06-01': {
            name: 'Ngày Quốc tế Thiếu nhi',
            shortName: 'Quốc tế Thiếu nhi',
            icon: '🎈',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Ngày Tết Thiếu nhi — Chăm sóc, bảo vệ và yêu thương trẻ em'
        },
        '06-05': {
            name: 'Ngày Bác Hồ ra đi tìm đường cứu nước & Ngày Môi trường Thế giới',
            shortName: 'Bác tìm đường cứu nước',
            icon: '🚢',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kỷ niệm sự kiện tại Bến cảng Nhà Rồng (05/06/1911) & Ngày Môi trường Thế giới'
        },
        '06-21': {
            name: 'Ngày Báo chí Cách mạng Việt Nam',
            shortName: 'Báo chí CMVN',
            icon: '📰',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kỷ niệm ngày xuất bản báo Thanh Niên (21/06/1925) — Tôn vinh người làm báo'
        },
        '06-28': {
            name: 'Ngày Gia đình Việt Nam',
            shortName: 'Gia đình Việt Nam',
            icon: '👨‍👩‍👧‍👦',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Gìn giữ và tôn vinh giá trị văn hóa gia đình Việt Nam ấm no, hạnh phúc'
        },
        '07-27': {
            name: 'Ngày Thương binh - Liệt sĩ',
            shortName: 'Thương binh - Liệt sĩ',
            icon: '🕯️',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Đạo lý "Uống nước nhớ nguồn" — Tri ân các Anh hùng Liệt sĩ & Thương bệnh binh'
        },
        '07-28': {
            name: 'Ngày thành lập Công đoàn Việt Nam',
            shortName: 'Công đoàn VN',
            icon: '🤝',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kỷ niệm thành lập tổ chức Công đoàn Việt Nam (28/07/1929)'
        },
        '08-19': {
            name: 'Ngày Cách mạng Tháng Tám thành công & Ngày truyền thống CAND',
            shortName: 'Cách mạng Tháng Tám',
            icon: '⭐',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Kỷ niệm Tổng khởi nghĩa Cách mạng Tháng Tám (19/08/1945) & Ngày truyền thống Công an nhân dân'
        },
        '09-02': {
            name: 'Ngày Quốc khánh nước CHXHCN Việt Nam',
            shortName: 'Quốc khánh 2/9',
            icon: '🇻🇳',
            type: 'tet-king',
            isDayOff: true,
            note: 'Nghỉ lễ chính thức 02 ngày hưởng nguyên lương (02/9 và 01 ngày liền kề trước hoặc sau)'
        },
        '10-01': {
            name: 'Ngày Quốc tế Người cao tuổi',
            shortName: 'Người cao tuổi',
            icon: '🧓',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kính lão đắc thọ — Quan tâm, phụng dưỡng người cao tuổi Việt Nam'
        },
        '10-10': {
            name: 'Ngày Giải phóng Thủ đô & Ngày Chuyển đổi số Quốc gia',
            shortName: 'Giải phóng Thủ đô',
            icon: '🏛️',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Kỷ niệm Giải phóng Thủ đô Hà Nội (10/10/1954) & Ngày Chuyển đổi số Quốc gia'
        },
        '10-13': {
            name: 'Ngày Doanh nhân Việt Nam',
            shortName: 'Doanh nhân VN',
            icon: '💼',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Tôn vinh đội ngũ doanh nhân đóng góp xây dựng kinh tế đất nước (13/10)'
        },
        '10-14': {
            name: 'Ngày thành lập Hội Nông dân Việt Nam',
            shortName: 'Hội Nông dân VN',
            icon: '🌾',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kỷ niệm thành lập Hội Nông dân Việt Nam (14/10/1930)'
        },
        '10-20': {
            name: 'Ngày Phụ nữ Việt Nam (20/10)',
            shortName: 'Phụ nữ Việt Nam',
            icon: '💐',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Kỷ niệm thành lập Hội Liên hiệp Phụ nữ Việt Nam (20/10/1930) — Tôn vinh phụ nữ Việt'
        },
        '10-31': {
            name: 'Lễ hội Hóa trang (Halloween)',
            shortName: 'Halloween',
            icon: '🎃',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Lễ hội hóa trang quốc tế tối 31/10'
        },
        '11-09': {
            name: 'Ngày Pháp luật nước CHXHCN Việt Nam',
            shortName: 'Ngày Pháp luật VN',
            icon: '⚖️',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Thượng tôn Hiến pháp và pháp luật Việt Nam (09/11)'
        },
        '11-18': {
            name: 'Ngày Truyền thống Mặt trận Tổ quốc Việt Nam',
            shortName: 'Đại đoàn kết dân tộc',
            icon: '🤝',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Ngày hội Đại đoàn kết toàn dân tộc ở khu dân cư (18/11/1930)'
        },
        '11-19': {
            name: 'Ngày Quốc tế Nam giới (19/11)',
            shortName: 'Quốc tế Nam giới',
            icon: '👔',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Tôn vinh vai trò và đóng góp tích cực của nam giới trong gia đình & xã hội'
        },
        '11-20': {
            name: 'Ngày Nhà giáo Việt Nam (20/11)',
            shortName: 'Nhà giáo Việt Nam',
            icon: '👩‍🏫',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Truyền thống "Tôn sư trọng đạo" — Tri ân các thế hệ nhà giáo Việt Nam'
        },
        '11-23': {
            name: 'Ngày Di sản Văn hóa Việt Nam & Thành lập Hội Chữ thập đỏ VN',
            shortName: 'Di sản Văn hóa VN',
            icon: '🏺',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Bảo tồn di sản văn hóa dân tộc & Kỷ niệm Hội Chữ thập đỏ Việt Nam (23/11)'
        },
        '12-22': {
            name: 'Ngày thành lập Quân đội Nhân dân Việt Nam',
            shortName: 'Quân đội Nhân dân VN',
            icon: '🎖️',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Kỷ niệm thành lập QĐND Việt Nam (22/12/1944) & Ngày hội Quốc phòng toàn dân'
        },
        '12-24': {
            name: 'Đêm Giáng sinh (Christmas Eve)',
            shortName: 'Đêm Giáng sinh',
            icon: '🎄',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Đêm vọng Lễ Giáng sinh sum vầy, an lành'
        },
        '12-25': {
            name: 'Lễ Giáng sinh (Noel)',
            shortName: 'Lễ Giáng sinh',
            icon: '🎅',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Lễ Giáng sinh an lành, ấm áp bên gia đình và người thân'
        },
        '12-31': {
            name: 'Đêm Giao thừa Dương lịch (New Year\'s Eve)',
            shortName: 'Tất niên Dương lịch',
            icon: '🥂',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Khép lại năm cũ, đếm ngược chào đón năm mới Dương lịch'
        }
    };

    // Traditional Vietnamese Lunar Holidays & Festivals (key: 'MM-DD', non-leap months only)
    const LUNAR_HOLIDAYS_VI = {
        '01-01': {
            name: 'Mùng 1 Tết Nguyên Đán (Tết Cha)',
            shortName: 'Mùng 1 Tết',
            icon: '🧧',
            type: 'tet-king',
            isDayOff: true,
            note: 'Nghỉ lễ Tết Nguyên đán chính thức hưởng nguyên lương'
        },
        '01-02': {
            name: 'Mùng 2 Tết Nguyên Đán (Tết Mẹ)',
            shortName: 'Mùng 2 Tết',
            icon: '🌸',
            type: 'tet-king',
            isDayOff: true,
            note: 'Nghỉ lễ Tết Nguyên đán chính thức hưởng nguyên lương'
        },
        '01-03': {
            name: 'Mùng 3 Tết Nguyên Đán (Tết Thầy)',
            shortName: 'Mùng 3 Tết',
            icon: '📚',
            type: 'tet-king',
            isDayOff: true,
            note: 'Nghỉ lễ Tết Nguyên đán chính thức hưởng nguyên lương'
        },
        '01-04': {
            name: 'Mùng 4 Tết Nguyên Đán (Lễ Hóa Vàng)',
            shortName: 'Mùng 4 Tết',
            icon: '🌼',
            type: 'tet-highlight',
            isDayOff: true,
            note: 'Lễ Hóa vàng tiễn gia tiên & Trong kỳ nghỉ Tết Nguyên đán chính thức (5 ngày)'
        },
        '01-05': {
            name: 'Mùng 5 Tết — Chiến thắng Ngọc Hồi - Đống Đa',
            shortName: 'Mùng 5 Tết Đống Đa',
            icon: '🐉',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Kỷ niệm đại thắng Ngọc Hồi - Đống Đa mùa Xuân Kỷ Dậu 1789 & Khai xuân đầu năm'
        },
        '01-10': {
            name: 'Ngày vía Thần Tài (Mùng 10 tháng Giêng)',
            shortName: 'Vía Thần Tài',
            icon: '🪙',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Cầu tài lộc, mua bán hanh thông, sung túc suốt cả năm'
        },
        '01-15': {
            name: 'Rằm Tháng Giêng — Tết Nguyên Tiêu',
            shortName: 'Tết Nguyên Tiêu',
            icon: '🏮',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Lễ Thượng Nguyên — Đêm trăng tròn viên mãn đầu tiên của năm mới'
        },
        '03-03': {
            name: 'Tết Hàn Thực (Bánh trôi - Bánh chay)',
            shortName: 'Tết Hàn Thực',
            icon: '🍡',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Phong tục dâng bánh trôi, bánh chay thanh tịnh hướng về cội nguồn (3/3 ÂL)'
        },
        '03-10': {
            name: 'Giỗ Tổ Hùng Vương (Mùng 10 tháng 3 Âm lịch)',
            shortName: 'Giỗ Tổ Hùng Vương',
            icon: '🏛️',
            type: 'tet-king',
            isDayOff: true,
            note: 'Quốc giỗ dân tộc Việt Nam — Nghỉ lễ chính thức 01 ngày hưởng nguyên lương'
        },
        '04-15': {
            name: 'Đại lễ Phật Đản (Rằm tháng Tư)',
            shortName: 'Lễ Phật Đản',
            icon: '🪷',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Kỷ niệm ngày Đức Phật Thích Ca Mâu Ni đản sinh (15/4 ÂL)'
        },
        '05-05': {
            name: 'Tết Đoan Ngọ (Mùng 5 tháng 5 Âm lịch)',
            shortName: 'Tết Đoan Ngọ',
            icon: '🍙',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Tết Đoan Ngọ cổ truyền ("diệt sâu bọ", thưởng thức rượu nếp, bánh ú tro, trái cây)'
        },
        '07-07': {
            name: 'Lễ Thất Tịch (Ngưu Lang - Chức Nữ)',
            shortName: 'Lễ Thất Tịch',
            icon: '🌌',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Ngày lễ tình duyên truyền thống phương Đông (Mùng 7 tháng 7 ÂL)'
        },
        '07-15': {
            name: 'Lễ Vu Lan Báo Hiếu — Rằm tháng Bảy',
            shortName: 'Lễ Vu Lan',
            icon: '🪷',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Mùa Vu Lan hiếu hạnh tri ân cha mẹ & Lễ Xá tội vong nhân (15/7 ÂL)'
        },
        '08-15': {
            name: 'Tết Trung Thu (Tết Đoàn Viên)',
            shortName: 'Tết Trung Thu',
            icon: '🥮',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Rằm tháng Tám rước đèn, trông trăng, phá cỗ sum họp gia đình'
        },
        '09-09': {
            name: 'Tết Trùng Cửu (Mùng 9 tháng 9 Âm lịch)',
            shortName: 'Tết Trùng Cửu',
            icon: '🌼',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Tết Trùng Dương cầu sức khỏe, trường thọ cho ông bà cha mẹ'
        },
        '10-10': {
            name: 'Tết Trùng Thập (Tết Cơm Mới)',
            shortName: 'Tết Cơm Mới',
            icon: '🌾',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Tết Cơm Mới mừng mùa màng thu hoạch & Ngày truyền thống Y học cổ truyền'
        },
        '10-15': {
            name: 'Tết Hạ Nguyên (Rằm tháng Mười)',
            shortName: 'Tết Hạ Nguyên',
            icon: '🌕',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Lễ Tạ ơn trời đất và tổ tiên ban phước mùa màng bình an (15/10 ÂL)'
        },
        '12-23': {
            name: 'Lễ cúng Ông Công Ông Táo (23 tháng Chạp)',
            shortName: 'Ông Công Ông Táo',
            icon: '🐟',
            type: 'tet-highlight',
            isDayOff: false,
            note: 'Tiễn Táo Quân cưỡi cá chép chầu trời báo cáo việc gia đạo cuối năm'
        },
        '12-28': {
            name: '28 Tết — Gói & Nấu Bánh Chưng Xanh',
            shortName: '28 Tết Bánh Chưng',
            icon: '🎋',
            type: 'tet-milestone',
            isDayOff: false,
            note: 'Sắm sửa đào mai, quây quần bên bếp lửa nấu bánh chưng bánh tét đón Tết'
        }
    };

    const EVENT_TYPE_RANK = {
        'tet-king': 3,
        'tet-highlight': 2,
        'tet-milestone': 1
    };

    /**
     * Returns ALL Lunar & Solar holidays/events falling on a given Solar date, sorted by importance.
     */
    function getCalendarEventsForDay(solarD, solarM, solarY, lunarInput = null) {
        const lunar = lunarInput || convertSolar2Lunar(solarD, solarM, solarY, 7);
        const events = [];

        // 1. Lunar Holidays (only on non-leap Lunar months)
        if (lunar && !lunar.isLeap) {
            const lunarKey = `${String(lunar.month).padStart(2, '0')}-${String(lunar.day).padStart(2, '0')}`;
            if (LUNAR_HOLIDAYS_VI[lunarKey]) {
                events.push({
                    ...LUNAR_HOLIDAYS_VI[lunarKey],
                    calendarSystem: 'lunar'
                });
            }

            // Giao Thừa dynamically lands on 29 or 30 Tháng Chạp depending on astronomical lunar month length
            if (lunar.month === 12 && (lunar.day === 29 || lunar.day === 30)) {
                const [nd, nm, ny] = jdToDate(lunar.jd + 1);
                const nextLunar = convertSolar2Lunar(nd, nm, ny, 7);
                if (!nextLunar.isLeap && nextLunar.month === 1 && nextLunar.day === 1) {
                    events.push({
                        name: `${lunar.day} Tháng Chạp — Lễ Tất Niên & Đêm Giao Thừa`,
                        shortName: 'Tất Niên & Giao Thừa',
                        icon: '🎆',
                        type: 'tet-king',
                        isDayOff: true,
                        calendarSystem: 'lunar',
                        note: 'Đêm Giao Thừa thiêng liêng đón năm mới & Nghỉ lễ Tết Nguyên đán chính thức'
                    });
                }
            }
        }

        // 2. Fixed Solar Holidays & Commemorative Days
        const solarKey = `${String(solarM).padStart(2, '0')}-${String(solarD).padStart(2, '0')}`;
        if (SOLAR_HOLIDAYS_VI[solarKey]) {
            events.push({
                ...SOLAR_HOLIDAYS_VI[solarKey],
                calendarSystem: 'solar'
            });
        }

        // 3. Ngày Văn hóa Việt Nam (24/11) — New statutory paid public holiday effective nationwide from 2026!
        if (solarM === 11 && solarD === 24) {
            const isEffectivePublicHoliday = solarY >= 2026;
            events.push({
                name: 'Ngày Văn hóa Việt Nam (24/11)',
                shortName: 'Ngày Văn hóa VN',
                icon: '🏛️',
                type: isEffectivePublicHoliday ? 'tet-king' : 'tet-milestone',
                isDayOff: isEffectivePublicHoliday,
                calendarSystem: 'solar',
                note: isEffectivePublicHoliday
                    ? 'Nghỉ lễ chính thức 01 ngày hưởng nguyên lương (áp dụng toàn quốc từ năm 2026 theo Nghị quyết của Quốc hội)'
                    : 'Ngày Văn hóa Việt Nam (từ năm 2026 chính thức là ngày nghỉ lễ hưởng nguyên lương toàn quốc)'
            });
        }

        // 4. Floating Solar Holidays (Mother's Day = 2nd Sunday of May; Father's Day = 3rd Sunday of June)
        const dow = new Date(Date.UTC(solarY, solarM - 1, solarD)).getUTCDay(); // 0 = Sunday
        if (dow === 0 && solarM === 5 && solarD >= 8 && solarD <= 14) {
            events.push({
                name: 'Ngày của Mẹ (Mother\'s Day)',
                shortName: 'Ngày của Mẹ',
                icon: '🤱',
                type: 'tet-milestone',
                isDayOff: false,
                calendarSystem: 'solar',
                note: 'Chủ nhật thứ 2 của tháng 5 — Tri ân công ơn sinh thành dưỡng dục của Mẹ'
            });
        }
        if (dow === 0 && solarM === 6 && solarD >= 15 && solarD <= 21) {
            events.push({
                name: 'Ngày của Cha (Father\'s Day)',
                shortName: 'Ngày của Cha',
                icon: '👨‍👧',
                type: 'tet-milestone',
                isDayOff: false,
                calendarSystem: 'solar',
                note: 'Chủ nhật thứ 3 của tháng 6 — Tôn vinh tình yêu thương và sự hy sinh của Cha'
            });
        }

        // 5. Special 2027 Event
        if (solarY === 2027 && solarM === 1 && solarD === 23) {
            events.push({
                name: 'Year End Party Pancake 2027',
                shortName: 'YEP Pancake 2027',
                icon: '🥂',
                type: 'tet-highlight',
                isDayOff: false,
                calendarSystem: 'solar',
                note: 'Đại tiệc tổng kết cuối năm Year End Party Pancake 2027'
            });
        }

        events.sort((a, b) => {
            if (Boolean(b.isDayOff) !== Boolean(a.isDayOff)) return b.isDayOff ? 1 : -1;
            return (EVENT_TYPE_RANK[b.type] || 0) - (EVENT_TYPE_RANK[a.type] || 0);
        });

        return events;
    }

    // Backward-compatible primary event getter
    function getTetEventTag(solarD, solarM, solarY, lunar) {
        const events = getCalendarEventsForDay(solarD, solarM, solarY, lunar);
        return events.length > 0 ? events[0] : null;
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

            this.initDOM();
            this.populateQuickPickers();
            this.bindEvents();
        }

        initDOM() {
            this.modal = document.getElementById('lunar-calendar-modal');
            this.openBtn = document.getElementById('btn-open-lunar-calendar');
            this.closeBtn = document.getElementById('btn-close-calendar');
            this.gridContainer = document.getElementById('cal-days-grid');
            this.monthTitle = document.getElementById('cal-month-title');
            this.monthSelect = document.getElementById('cal-select-month');
            this.yearSelect = document.getElementById('cal-select-year');
            this.monthLunarSubtitle = document.getElementById('cal-month-lunar-subtitle');
            this.prevBtn = document.getElementById('btn-cal-prev-month');
            this.nextBtn = document.getElementById('btn-cal-next-month');
            this.todayBtn = document.getElementById('btn-cal-today');
            this.tetJumpBtn = document.getElementById('btn-cal-tet');
            this.monthEventsBar = document.getElementById('cal-month-events-bar');
            this.detailBox = document.getElementById('cal-selected-day-details');
        }

        populateQuickPickers() {
            if (this.monthSelect && this.monthSelect.options.length === 0) {
                for (let m = 1; m <= 12; m++) {
                    const opt = document.createElement('option');
                    opt.value = String(m);
                    opt.textContent = `Tháng ${String(m).padStart(2, '0')}`;
                    this.monthSelect.appendChild(opt);
                }
            }
            if (this.yearSelect && this.yearSelect.options.length === 0) {
                for (let y = 1950; y <= 2100; y++) {
                    const opt = document.createElement('option');
                    opt.value = String(y);
                    opt.textContent = `${y} (${getCanChiYear(y)})`;
                    this.yearSelect.appendChild(opt);
                }
            }
        }

        getJumpTetYear() {
            const activeCycle = getCurrentTetCycle(7);
            const vnToday = getVietnamNow();
            if (this.viewYear === vnToday.year) {
                return activeCycle.year;
            }
            return this.viewYear;
        }

        syncSelectedDateForViewMonth() {
            const vnToday = getVietnamNow();
            if (this.viewYear === vnToday.year && this.viewMonth === vnToday.month) {
                this.selectedDate = { day: vnToday.day, month: vnToday.month, year: vnToday.year };
                return;
            }
            // If viewing the month that contains Mùng 1 Tết of this Solar year, auto-select Mùng 1 Tết!
            const tetOfViewYear = convertLunar2Solar(1, 1, this.viewYear, 0, 7);
            if (tetOfViewYear.year === this.viewYear && tetOfViewYear.month === this.viewMonth) {
                this.selectedDate = { day: tetOfViewYear.day, month: tetOfViewYear.month, year: tetOfViewYear.year };
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
            if (this.monthSelect) {
                this.monthSelect.addEventListener('change', (e) => {
                    const m = parseInt(e.target.value, 10);
                    if (m >= 1 && m <= 12) {
                        this.viewMonth = m;
                        this.syncSelectedDateForViewMonth();
                        this.render();
                    }
                });
            }
            if (this.yearSelect) {
                this.yearSelect.addEventListener('change', (e) => {
                    const y = parseInt(e.target.value, 10);
                    if (y >= 1900 && y <= 2100) {
                        this.viewYear = y;
                        this.syncSelectedDateForViewMonth();
                        this.render();
                    }
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
                    const targetTetYear = this.getJumpTetYear();
                    const m1 = convertLunar2Solar(1, 1, targetTetYear, 0, 7);
                    if (m1.year >= 1900 && m1.year <= 2100) {
                        this.viewYear = m1.year;
                        this.viewMonth = m1.month;
                        this.selectedDate = { day: m1.day, month: m1.month, year: m1.year };
                        this.render();
                    }
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

            // Sync month/year title & quick-select dropdowns
            if (this.monthTitle) {
                this.monthTitle.textContent = `Tháng ${String(this.viewMonth).padStart(2, '0')} / ${this.viewYear}`;
            }
            if (this.monthSelect) {
                this.monthSelect.value = String(this.viewMonth);
            }
            if (this.yearSelect) {
                this.yearSelect.value = String(this.viewYear);
            }
            if (this.tetJumpBtn) {
                const jumpYear = this.getJumpTetYear();
                this.tetJumpBtn.textContent = `🧧 Tết ${jumpYear}`;
                this.tetJumpBtn.title = `Nhảy tới Mùng 1 Tết ${getCanChiYear(jumpYear)} ${jumpYear}`;
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
            const monthEvents = [];

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
                const dayEvents = getCalendarEventsForDay(cellDay, cellMonth, cellYear, lunar);
                const primaryEvent = dayEvents.length > 0 ? dayEvents[0] : null;

                if (!isOtherMonth && dayEvents.length > 0) {
                    dayEvents.forEach((ev) => {
                        monthEvents.push({
                            day: cellDay,
                            month: cellMonth,
                            year: cellYear,
                            lunarDay: lunar.day,
                            lunarMonth: lunar.month,
                            ...ev
                        });
                    });
                }

                const dayCol = i % 7; // 0 = Mon, ..., 5 = Sat, 6 = Sun
                const isWeekend = (dayCol === 5 || dayCol === 6);

                const cell = document.createElement('div');
                let cellClasses = ['cal-day-cell'];
                if (isOtherMonth) cellClasses.push('other-month');
                if (isToday) cellClasses.push('today');
                if (isSelected) cellClasses.push('selected');
                if (hoangDaoCell.isHoangDao) cellClasses.push('is-hoang-dao');
                if (primaryEvent) cellClasses.push(primaryEvent.type);
                if (primaryEvent && primaryEvent.isDayOff) cellClasses.push('is-day-off');
                if (isWeekend) cellClasses.push('weekend');

                cell.className = cellClasses.join(' ');
                if (dayEvents.length > 0) {
                    cell.title = dayEvents.map(ev => `${ev.icon} ${ev.name}${ev.isDayOff ? ' (Nghỉ lễ chính thức)' : ''}`).join(' • ');
                }

                // Display text for lunar day
                let lunarText = String(lunar.day);
                if (lunar.day === 1) {
                    lunarText = `${lunar.day}/${lunar.month}${lunar.isLeap ? 'N' : ''}`;
                    cell.classList.add('lunar-mung-1');
                } else if (lunar.day === 15) {
                    lunarText = primaryEvent ? '15' : '15 (Rằm)';
                    cell.classList.add('lunar-ram');
                }

                let badgeHtml = '';
                if (dayEvents.length > 0) {
                    const iconIcons = dayEvents.slice(0, 2).map(ev => ev.icon).join('');
                    const tooltipText = dayEvents.map(ev => `${ev.name}${ev.isDayOff ? ' (Nghỉ lễ)' : ''}`).join(' | ');
                    badgeHtml += `<span class="cal-tet-badge" title="${tooltipText}">${iconIcons}</span>`;
                }
                if (hoangDaoCell.isHoangDao) {
                    badgeHtml += `<span class="cal-hoang-dao-star" title="Ngày ${hoangDaoCell.starName} (Cát Lành Đại Cát)">⭐</span>`;
                }

                const miniEventHtml = primaryEvent
                    ? `<span class="cal-cell-event-mini ${primaryEvent.isDayOff ? 'is-holiday-off' : ''}">${primaryEvent.shortName || primaryEvent.name}</span>`
                    : '<span></span>';

                cell.innerHTML = `
                    <div class="cal-day-header">
                        <span class="cal-day-solar">${cellDay}</span>
                        <div class="cal-badges-wrap">${badgeHtml}</div>
                    </div>
                    <div class="cal-day-footer">
                        ${miniEventHtml}
                        <div class="cal-day-lunar ${lunar.day === 1 ? 'is-first-day' : ''}">${lunarText}</div>
                    </div>
                `;

                cell.addEventListener('click', () => {
                    if (cellMonth === this.viewMonth && cellYear === this.viewYear) {
                        this.selectedDate = { day: cellDay, month: cellMonth, year: cellYear };
                        const prevSelected = this.gridContainer.querySelector('.cal-day-cell.selected');
                        if (prevSelected) prevSelected.classList.remove('selected');
                        cell.classList.add('selected');
                        this.syncActiveMonthEventChip();
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

            this.renderMonthEventsBar(monthEvents);
            this.renderSelectedDayDetails();
        }

        syncActiveMonthEventChip() {
            if (!this.monthEventsBar) return;
            const chips = this.monthEventsBar.querySelectorAll('.cal-month-event-chip');
            chips.forEach((chip) => {
                const d = parseInt(chip.getAttribute('data-day'), 10);
                chip.classList.toggle(
                    'active',
                    d === this.selectedDate.day && this.viewMonth === this.selectedDate.month && this.viewYear === this.selectedDate.year
                );
            });
        }

        renderMonthEventsBar(monthEvents) {
            if (!this.monthEventsBar) return;
            if (!monthEvents || monthEvents.length === 0) {
                this.monthEventsBar.innerHTML = '';
                this.monthEventsBar.classList.add('hidden');
                return;
            }
            this.monthEventsBar.classList.remove('hidden');
            this.monthEventsBar.innerHTML = '';

            const label = document.createElement('span');
            label.className = 'cal-month-events-label';
            label.textContent = `🎉 Ngày lễ & kỷ niệm Tháng ${String(this.viewMonth).padStart(2, '0')}:`;
            this.monthEventsBar.appendChild(label);

            const listWrap = document.createElement('div');
            listWrap.className = 'cal-month-events-list';

            monthEvents.forEach((ev) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `cal-month-event-chip ${ev.isDayOff ? 'is-day-off' : ''}`;
                if (ev.day === this.selectedDate.day && ev.month === this.selectedDate.month && ev.year === this.selectedDate.year) {
                    btn.classList.add('active');
                }
                btn.setAttribute('data-day', String(ev.day));
                btn.title = `${String(ev.day).padStart(2, '0')}/${String(ev.month).padStart(2, '0')} — ${ev.name}${ev.note ? ' (' + ev.note + ')' : ''}`;

                const dateStr = `${String(ev.day).padStart(2, '0')}/${String(ev.month).padStart(2, '0')}`;
                const offBadge = ev.isDayOff ? '<span class="chip-off-badge">Nghỉ lễ</span>' : '';
                btn.innerHTML = `<span class="chip-date">${dateStr}</span><span>${ev.icon} ${ev.shortName || ev.name}</span>${offBadge}`;

                btn.addEventListener('click', () => {
                    this.selectedDate = { day: ev.day, month: ev.month, year: ev.year };
                    const cells = this.gridContainer.querySelectorAll('.cal-day-cell:not(.other-month)');
                    this.gridContainer.querySelectorAll('.cal-day-cell.selected').forEach(c => c.classList.remove('selected'));
                    const targetCell = cells[ev.day - 1];
                    if (targetCell) targetCell.classList.add('selected');
                    this.syncActiveMonthEventChip();
                    this.renderSelectedDayDetails();
                });

                listWrap.appendChild(btn);
            });

            this.monthEventsBar.appendChild(listWrap);
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
            const dayEvents = getCalendarEventsForDay(day, month, year, lunar);

            // Dynamic multi-year Tết cycle: stays on current Tết through 15/01 ÂL, then switches to next year's Tết
            const tetCycle = getTetCycleForLunar(lunar, 7);
            const diffDays = tetCycle.mung1.jd - lunar.jd;
            const vnToday = getVietnamNow();
            const isSelectedToday = (day === vnToday.day && month === vnToday.month && year === vnToday.year);

            let countdownLabel = `🏮 Đếm ngược Tết ${tetCycle.year}:`;
            let diffText = '';
            if (diffDays === 0) {
                countdownLabel = `🏮 Mùng 1 Tết ${tetCycle.year}:`;
                diffText = isSelectedToday
                    ? `🎉 <strong>HÔM NAY CHÍNH LÀ MÙNG 1 TẾT ${tetCycle.canChi.toUpperCase()} ${tetCycle.year}!</strong>`
                    : `🎉 <strong>NGÀY NÀY CHÍNH LÀ MÙNG 1 TẾT ${tetCycle.canChi.toUpperCase()} ${tetCycle.year}!</strong>`;
            } else if (diffDays > 0) {
                diffText = `⏳ Còn đúng <strong>${diffDays} ngày</strong> tới Mùng 1 Tết ${tetCycle.canChi} ${tetCycle.year} (${tetCycle.mung1.dateStr})!`;
            } else {
                countdownLabel = `🏮 Xuân ${tetCycle.canChi} ${tetCycle.year}:`;
                if (lunar.day === 15) {
                    const nextCanChi = getCanChiYear(tetCycle.year + 1);
                    diffText = `🌕 <strong>Rằm Tháng Giêng ${tetCycle.canChi} ${tetCycle.year}</strong> (từ 16/01 ÂL tự chuyển đếm Tết ${nextCanChi} ${tetCycle.year + 1}).`;
                } else {
                    const lunarDayLabel = lunar.day <= 10 ? `Mùng ${lunar.day} Tết` : `${lunar.day} Tháng Giêng`;
                    diffText = `🌸 Đang trong 15 ngày đầu Xuân (<strong>${lunarDayLabel}</strong> — còn ${15 - lunar.day} ngày đến Rằm Tháng Giêng).`;
                }
            }

            const solarDayOfWeek = DAY_NAMES_VI[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

            let eventNoticeHtml = '';
            if (dayEvents.length > 0) {
                const itemsHtml = dayEvents.map((ev) => {
                    const sysBadge = ev.isDayOff
                        ? '<span class="cal-ev-tag is-off">🏖️ Nghỉ lễ chính thức</span>'
                        : (ev.calendarSystem === 'lunar'
                            ? '<span class="cal-ev-tag is-lunar">🌙 Lễ Âm lịch</span>'
                            : '<span class="cal-ev-tag is-solar">☀️ Kỷ niệm Dương lịch</span>');
                    const noteHtml = ev.note ? `<div class="cal-ev-note">${ev.note}</div>` : '';
                    return `
                        <div class="cal-detail-event-highlight ${ev.isDayOff ? 'is-day-off' : ''}">
                            <div class="cal-ev-main-line">
                                <span class="cal-ev-icon">${ev.icon}</span>
                                <strong class="cal-ev-title">${ev.name}</strong>
                                ${sysBadge}
                            </div>
                            ${noteHtml}
                        </div>
                    `;
                }).join('');
                eventNoticeHtml = `<div class="cal-detail-events-stack">${itemsHtml}</div>`;
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
                            <span>${countdownLabel}</span> <span>${diffText}</span>
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
        convertLunar2Solar,
        jdFromDate,
        jdToDate,
        getCanChiYear,
        getCanChiDay,
        getSolarTermName,
        getVietnamNow,
        getZodiacMascot,
        getTetInfoForYear,
        getTetCycleForLunar,
        getCurrentTetCycle,
        getCalendarEventsForDay,
        getTetEventTag,
        HOANG_DAO_TABLE
    };
    window.TetLunarCalendar = TetLunarCalendar;
})();
