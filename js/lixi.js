/**
 * Lucky Red Envelope Tree (Cây Lộc Lì Xì Đinh Mùi 2027)
 * Đa dạng phong bao, theo dõi tổng tiền lộc thu thập, hiệu ứng nổ pháo hoa vàng
 */
class LixiSystem {
    constructor() {
        this.wishes = [
            {
                amount: "888.888 VNĐ",
                numVal: 888888,
                meaning: "PHÁT TÀI PHÁT LỘC",
                wish: "Chúc bạn năm mới tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin. Làm đâu thắng đó, đếm tiền mỏi tay!"
            },
            {
                amount: "1.688.888 VNĐ",
                numVal: 1688888,
                meaning: "NHẤT LỘC PHÁT TÀI",
                wish: "Mở lối thành công, khởi đầu hanh thông! Mọi dự định đều bứt phá ngoạn mục, gặt hái thành quả rực rỡ nhất!"
            },
            {
                amount: "999.999 VNĐ",
                numVal: 999999,
                meaning: "TRƯỜNG CỬU AN KHANG",
                wish: "Năm Đinh Mùi 2027: Miệng luôn cười tươi, mắt sáng long lanh, tình duyên thắm thiết, một đời an nhiên hạnh phúc!"
            },
            {
                amount: "2.027.000 VNĐ",
                numVal: 2027000,
                meaning: "ĐINH MÙI ĐẠI CÁT",
                wish: "Lộc xuân 2027 ngập tràn cửa ngõ! Gia đình hòa thuận, con cháu sum vầy, phú quý vinh hoa suốt bốn mùa!"
            },
            {
                amount: "686.868 VNĐ",
                numVal: 686868,
                meaning: "LỘC PHÁT SONG HỶ",
                wish: "Vía lì xì cực mạnh: Ăn nhiều không mập, thức khuya không mụn, sếp thương đồng nghiệp quý, lương thưởng x5 x10!"
            },
            {
                amount: "777.777 VNĐ",
                numVal: 777777,
                meaning: "THẤT BẢO BÌNH AN",
                wish: "Gió xuân ấm áp chở bình an về. Bốn mùa mạnh khỏe vô lo, tâm an trí sáng, gia đạo ngập tràn tiếng cười!"
            },
            {
                amount: "3.333.333 VNĐ",
                numVal: 3333333,
                meaning: "TAM TÀI VỮNG CHẮC",
                wish: "Phúc - Lộc - Thọ tề tựu bên hiên nhà. Sức khỏe dẻo dai như cành mai xuân, vạn dặm bình an trên mọi nẻo đường!"
            },
            {
                amount: "1.888.888 VNĐ",
                numVal: 1888888,
                meaning: "AN CƯ LẠC NGHIỆP",
                wish: "Năm mới thêm nhà mới, xe sang, công việc vững như bàn thạch, tiền tài tích lũy ngày một sung túc!"
            },
            {
                amount: "6.666.666 VNĐ",
                numVal: 6666666,
                meaning: "LỤC PHÚC ĐẠI PHÁT",
                wish: "Lộc đổ vào nhà đếm không xuể! Mua may bán đắt, khách vào nườm nượp, doanh số x10 x20 vượt chỉ tiêu!"
            },
            {
                amount: "8.888.888 VNĐ",
                numVal: 8888888,
                meaning: "HƯNG THỊNH VÔ BIÊN",
                wish: "Tài vận đỉnh nóc kịch trần! Đầu tư trúng lớn, tiền đẻ ra tiền, phúc đức tổ tiên che chở một đời hưng vượng!"
            },
            {
                amount: "5.555.555 VNĐ",
                numVal: 5555555,
                meaning: "NGŨ HÀNH KHỞI SẮC",
                wish: "Vận đỏ như son, quý nhân nâng đỡ bước đường tương lai. Bứt phá mọi giới hạn cũ để chạm đến thành công vang dội!"
            },
            {
                amount: "9.999.999 VNĐ + 1 CÂY VÀNG 9999",
                numVal: 9999999,
                meaning: "KIM NGỌC MÃN ĐƯỜNG",
                wish: "Bao lì xì VIP Độc Đắc Đinh Mùi 2027! Chúc bạn vàng bạc đầy két, kim cương lấp lánh, vinh hoa phú quý trường tồn!"
            },
            {
                amount: "168.000 VNĐ",
                numVal: 168000,
                meaning: "NHẤT LỘC PHÁT",
                wish: "Đầu năm khai vận cát tường, giữa năm thắng lớn, cuối năm bội thu viên mãn!"
            },
            {
                amount: "268.000 VNĐ",
                numVal: 268000,
                meaning: "MÃI LỘC PHÁT",
                wish: "Lộc biếc đâm chồi, công danh khởi sắc. Luôn giữ nụ cười rạng rỡ và tinh thần phấn chấn!"
            },
            {
                amount: "12.345.678 VNĐ",
                numVal: 12345678,
                meaning: "TIẾN BƯỚC THĂNG HOA",
                wish: "Các nấc thang thành công mở rộng trước mắt! Học vị thăng tiến, sự nghiệp vang dội, vạn người ngưỡng mộ!"
            },
            {
                amount: "100 ĐIỂM HẠNH PHÚC",
                numVal: 1000000,
                meaning: "VIÊN MÃN TRỌN ĐỜI",
                wish: "Món quà tinh thần quý giá nhất: Gia đình sum họp đầm ấm, người thân khỏe mạnh, vạn sự thuận hòa!"
            },
            {
                amount: "6.888.888 VNĐ",
                numVal: 6888888,
                meaning: "LỘC PHÁT TRƯỜNG TỒN",
                wish: "Vận may nhân bội, vạn điều như mơ! Kinh doanh đại thắng, buôn may bán đắt, tài lộc cuộn trào quanh năm!"
            },
            {
                amount: "8.686.868 VNĐ",
                numVal: 8686868,
                meaning: "PHÁT LỘC ĐẠI CÁT",
                wish: "Tân xuân đắc lộc, gia sự yên vui, sức khỏe dồi dào, phúc thọ diên niên vạn sự thành toàn!"
            }
        ];

        this.openedIndices = new Set();
        this.totalAmountCollected = 0;

        // Restore saved session only if openedIndices are valid
        try {
            const savedOpened = JSON.parse(localStorage.getItem('tet-lixi-opened') || '[]');
            const savedTotal = parseInt(localStorage.getItem('tet-lixi-total'), 10) || 0;
            const validOpened = Array.isArray(savedOpened)
                ? savedOpened.filter(i => Number.isInteger(i) && i >= 0 && i < 36)
                : [];
            if (validOpened.length > 0) {
                this.openedIndices = new Set(validOpened);
                this.totalAmountCollected = Math.max(0, savedTotal);
            } else {
                this.openedIndices = new Set();
                this.totalAmountCollected = 0;
            }
        } catch (e) {
            this.openedIndices = new Set();
            this.totalAmountCollected = 0;
        }

        this.bindEvents();
        this.updateStatsUI();
    }

    bindEvents() {
        const envelopes = document.querySelectorAll('.hanging-lixi');
        envelopes.forEach((env, index) => {
            if (this.openedIndices.has(index)) {
                env.classList.add('opened');
            }
            env.addEventListener('click', (e) => this.openEnvelope(env, index, e));
        });

        const resetBtn = document.getElementById('btn-reset-lixi-tree');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetTree());
        }

        const closeBtn = document.getElementById('btn-close-lixi');
        const acceptBtn = document.getElementById('btn-accept-lixi');
        const modal = document.getElementById('lixi-modal');
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        if (acceptBtn && modal) {
            acceptBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
    }

    updateStatsUI() {
        const totalEl = document.getElementById('lixi-total-amount');
        const countEl = document.getElementById('lixi-opened-count');
        const totalCountEl = document.getElementById('lixi-total-count');
        const allEnvelopes = document.querySelectorAll('.hanging-lixi');

        if (totalEl) {
            totalEl.textContent = this.totalAmountCollected.toLocaleString('vi-VN') + ' VNĐ';
        }
        if (countEl) {
            countEl.textContent = this.openedIndices.size;
        }
        if (totalCountEl && allEnvelopes.length > 0) {
            totalCountEl.textContent = allEnvelopes.length;
        }

        try {
            localStorage.setItem('tet-lixi-opened', JSON.stringify(Array.from(this.openedIndices)));
            localStorage.setItem('tet-lixi-total', String(this.totalAmountCollected));
        } catch (e) {}
    }

    openEnvelope(envelopeEl, index, event) {
        if (window.tetAudio) {
            window.tetAudio.playLuckyChime();
        }

        envelopeEl.classList.add('lixi-popped');
        setTimeout(() => envelopeEl.classList.remove('lixi-popped'), 600);

        // Add opened badge class
        const isNewOpen = !this.openedIndices.has(index);
        envelopeEl.classList.add('opened');
        this.openedIndices.add(index);

        if (window.fireworks && event) {
            const rect = envelopeEl.getBoundingClientRect();
            window.fireworks.explodeAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        // Pick wish based on index or shuffle
        const data = this.wishes[index % this.wishes.length];

        if (isNewOpen) {
            this.totalAmountCollected += data.numVal;
        }
        this.updateStatsUI();

        const amountEl = document.getElementById('lixi-res-amount');
        const meaningEl = document.getElementById('lixi-res-meaning');
        const wishEl = document.getElementById('lixi-res-wish');

        if (amountEl) amountEl.textContent = data.amount;
        if (meaningEl) meaningEl.textContent = data.meaning;
        if (wishEl) wishEl.textContent = data.wish;

        const modal = document.getElementById('lixi-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    resetTree() {
        this.openedIndices.clear();
        this.totalAmountCollected = 0; // Reset total money to 0!
        try {
            localStorage.removeItem('tet-lixi-opened');
            localStorage.removeItem('tet-lixi-total');
        } catch (e) {}

        const envelopes = document.querySelectorAll('.hanging-lixi');
        envelopes.forEach(env => {
            env.classList.remove('opened');
            env.classList.add('lixi-popped');
            setTimeout(() => env.classList.remove('lixi-popped'), 600);
        });

        // Shuffle wishes order
        for (let i = this.wishes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.wishes[i], this.wishes[j]] = [this.wishes[j], this.wishes[i]];
        }

        this.updateStatsUI();

        if (window.tetAudio) {
            window.tetAudio.playLuckyChime();
        }
        if (window.fireworks) {
            window.fireworks.explodeAt(window.innerWidth / 2, window.innerHeight * 0.4);
        }

        // Show toast
        const toast = document.getElementById('tet-toast');
        if (toast) {
            toast.textContent = '🎋 Cây Lộc 18 Bao Lì Xì mới đã được treo lên! Hãy chọn những phong bao may mắn tiếp theo!';
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
        }
    }
}

window.LixiSystem = LixiSystem;
