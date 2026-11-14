/**
 * Main Application Orchestrator for Tet Đinh Mùi 2027
 * Handles 100% Synchronized Fonts, Themes, Custom MP3 Vocal Upload, and Festive Effects.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Visual Systems (Canvas - staggered to avoid startup frame hitch)
    const fireworks = new FireworksSystem('fireworks-canvas');
    window.fireworks = fireworks;

    const ambient = new AmbientSystem('ambient-canvas');
    window.ambient = ambient;

    const petals = new PetalsSystem('petals-canvas');
    window.petals = petals;

    // 2. Initialize Countdown
    const countdown = new TetCountdown();
    countdown.start();
    window.countdown = countdown;

    // 3. Initialize Interactive Modules
    const fortune = new FortuneSystem();
    const lixi = new LixiSystem();
    const cardMaker = new CardMaker();
    window.cardMaker = cardMaker;

    requestAnimationFrame(() => {
        petals.start();
        ambient.start();
        setTimeout(() => fireworks.start(), 120);
    });

    // 4. Click anywhere to explode fireworks (ignoring UI buttons/inputs)
    document.addEventListener('click', (e) => {
        const tag = e.target.tagName.toLowerCase();
        if (
            tag === 'input' || 
            tag === 'button' || 
            tag === 'select' || 
            tag === 'textarea' || 
            e.target.closest('.btn-ctrl') ||
            e.target.closest('.nav-tab-btn') ||
            e.target.closest('.modal-content') ||
            e.target.closest('.interactive-clickable') ||
            e.target.closest('.music-player-panel') ||
            e.target.closest('.custom-select-ctrl')
        ) {
            return;
        }
        const types = ['chrysanthemum', 'willow', 'ring', 'heart', 'strobe'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        fireworks.explodeAt(e.clientX, e.clientY, null, randomType, 1.45);
    });

    // Auto-unlock Web AudioContext on first user interaction
    const unlockAudioContext = () => {
        if (window.tetAudio) {
            window.tetAudio.init();
        }
    };
    document.addEventListener('click', unlockAudioContext, { once: true });
    document.addEventListener('keydown', unlockAudioContext, { once: true });
    document.addEventListener('touchstart', unlockAudioContext, { once: true });

    // 5. Light / Dark Mode Orchestration (Giao diện Sáng Nắng Xuân / Tối Hội Đêm)
    const lightDarkToggleBtn = document.getElementById('btn-toggle-light-dark');
    const modeLightBtn = document.getElementById('btn-mode-light');
    const modeDarkBtn = document.getElementById('btn-mode-dark');
    const modeIcon = document.getElementById('mode-icon');
    const modeText = document.getElementById('mode-text');
    const savedMode = localStorage.getItem('tet-theme-mode') || 'light';

    const setLightMode = (isLight, playSound = false) => {
        document.body.classList.toggle('light-mode', isLight);
        if (modeIcon) modeIcon.textContent = isLight ? '🌙' : '☀️';
        if (modeText) modeText.textContent = isLight ? 'Tối' : 'Sáng';
        if (modeLightBtn) modeLightBtn.classList.toggle('active', isLight);
        if (modeDarkBtn) modeDarkBtn.classList.toggle('active', !isLight);
        localStorage.setItem('tet-theme-mode', isLight ? 'light' : 'dark');

        const accBadgeMode = document.getElementById('acc-badge-mode');
        if (accBadgeMode) accBadgeMode.textContent = isLight ? 'Nắng Xuân (Sáng)' : 'Hội Đêm (Tối)';

        if (playSound && window.tetAudio) {
            window.tetAudio.init();
            window.tetAudio.playLuckyChime();
        }
        if (window.cardMaker) {
            window.cardMaker.requestSmartRender();
        }
    };

    setLightMode(savedMode === 'light', false);

    if (lightDarkToggleBtn) {
        lightDarkToggleBtn.addEventListener('click', () => {
            const isCurrentlyLight = document.body.classList.contains('light-mode');
            setLightMode(!isCurrentlyLight, true);
        });
    }

    if (modeLightBtn) {
        modeLightBtn.addEventListener('click', () => {
            setLightMode(true, true);
        });
    }

    if (modeDarkBtn) {
        modeDarkBtn.addEventListener('click', () => {
            setLightMode(false, true);
        });
    }

    // 6. Settings Modal (Gom tất cả tính năng cài đặt vào một bảng gọn gàng)
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('btn-open-settings');
    const closeSettingsBtn = document.getElementById('btn-close-settings');
    const doneSettingsBtn = document.getElementById('btn-done-settings');

    const openSettings = () => {
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
        }
    };

    const closeSettings = () => {
        if (settingsModal) settingsModal.classList.add('hidden');
    };

    if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (doneSettingsBtn) {
        doneSettingsBtn.addEventListener('click', () => {
            closeSettings();
            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
            fireworks.explodeAt(window.innerWidth / 2, window.innerHeight * 0.35);
        });
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }

    // Settings Modal Tab Navigation (Chuyển tab mượt mà, tức thì, triệt tiêu giật lag)
    const settingsTabBtns = document.querySelectorAll('.settings-tab-btn');
    const settingsTabPanels = document.querySelectorAll('.settings-tab-panel');

    settingsTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = btn.getAttribute('data-tab');
            if (!targetTab) return;

            settingsTabBtns.forEach(b => b.classList.remove('active'));
            settingsTabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(targetTab);
            if (activePanel) activePanel.classList.add('active');

            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
        });
    });

    // 7. Theme Switcher (16 Rich Festive Themes with visual chips)
    const themeChips = document.querySelectorAll('.theme-chip-btn');
    const themeSelect = document.getElementById('theme-picker-select');
    const savedTheme = localStorage.getItem('tet-theme') || 'theme-red-gold';

    const THEME_DISPLAY_NAMES = {
        'theme-red-gold': 'Đỏ Kim',
        'theme-mai-vang': 'Mai Vàng',
        'theme-dao-hong': 'Đào Hồng',
        'theme-dem-giao-thua': 'Đêm Giao Thừa',
        'theme-loc-biec': 'Lộc Biếc',
        'theme-cam-hoi-an': 'Cam Hội An',
        'theme-tim-hue': 'Tím Huế',
        'theme-trang-sen': 'Bạch Liên',
        'theme-ho-phach': 'Hổ Phách',
        'theme-ngoc-bich': 'Ngọc Bích',
        'theme-cyber-tet': 'Neon Giao Thừa',
        'theme-gom-su': 'Lam Ngọc',
        'theme-hoang-kim': 'Hoàng Kim',
        'theme-ruou-vang': 'Ruby Rượu Vang',
        'theme-binh-minh': 'Bình Minh',
        'theme-tay-bac': 'Tây Bắc'
    };

    const allThemes = [
        'theme-red-gold', 'theme-mai-vang', 'theme-dao-hong', 'theme-dem-giao-thua', 'theme-loc-biec',
        'theme-cam-hoi-an', 'theme-tim-hue', 'theme-trang-sen', 'theme-ho-phach',
        'theme-ngoc-bich', 'theme-cyber-tet', 'theme-gom-su', 'theme-hoang-kim',
        'theme-ruou-vang', 'theme-binh-minh', 'theme-tay-bac'
    ];

    const applyTheme = (themeClass) => {
        allThemes.forEach(t => document.body.classList.remove(t));
        document.body.classList.add(themeClass);
        if (themeSelect) themeSelect.value = themeClass;
        themeChips.forEach(chip => {
            chip.classList.toggle('active', chip.getAttribute('data-theme') === themeClass);
        });
        localStorage.setItem('tet-theme', themeClass);

        const accBadgeTheme = document.getElementById('acc-badge-theme');
        if (accBadgeTheme) {
            accBadgeTheme.textContent = THEME_DISPLAY_NAMES[themeClass] || 'Giao Diện Tết';
        }

        if (window.cardMaker) {
            window.cardMaker.requestSmartRender();
        }
    };

    applyTheme(savedTheme);

    themeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const theme = chip.getAttribute('data-theme');
            applyTheme(theme);
            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
        });
    });

    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            applyTheme(e.target.value);
            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
        });
    }

    // Ambient Effects Controls (6 Dynamic Festive Layers & Intensity Sliders)
    const toggleStardust = document.getElementById('toggle-ambient-stardust');
    const toggleLanterns = document.getElementById('toggle-ambient-lanterns');
    const toggleConfetti = document.getElementById('toggle-ambient-confetti');
    const toggleLuckyCoins = document.getElementById('toggle-ambient-luckycoins');
    const toggleHangingLanterns = document.getElementById('toggle-ambient-hanging-lanterns');
    const toggleSpringRain = document.getElementById('toggle-ambient-springrain');
    const petalFilterSelect = document.getElementById('petal-flower-filter');

    // Restore saved toggles
    if (toggleStardust) toggleStardust.checked = localStorage.getItem('tet-ambient-stardust') !== 'false';
    if (toggleLanterns) toggleLanterns.checked = localStorage.getItem('tet-ambient-lanterns') !== 'false';
    if (toggleConfetti) toggleConfetti.checked = localStorage.getItem('tet-ambient-confetti') === 'true';
    if (toggleLuckyCoins) toggleLuckyCoins.checked = localStorage.getItem('tet-ambient-luckycoins') === 'true';
    if (toggleHangingLanterns) toggleHangingLanterns.checked = localStorage.getItem('tet-ambient-hanging-lanterns') !== 'false';
    if (toggleSpringRain) toggleSpringRain.checked = localStorage.getItem('tet-ambient-springrain') === 'true';

    // Apply hanging lanterns initial state
    const updateHangingLanterns = (enable) => {
        const lanterns = document.querySelectorAll('.hanging-lantern');
        lanterns.forEach(el => el.classList.toggle('hidden', !enable));
        localStorage.setItem('tet-ambient-hanging-lanterns', enable ? 'true' : 'false');
    };
    if (toggleHangingLanterns) {
        updateHangingLanterns(toggleHangingLanterns.checked);
    }

    const updateAmbientBadge = () => {
        const accBadgeAmbient = document.getElementById('acc-badge-ambient');
        if (!accBadgeAmbient) return;
        const s = toggleStardust && toggleStardust.checked ? 1 : 0;
        const l = toggleLanterns && toggleLanterns.checked ? 1 : 0;
        const c = toggleConfetti && toggleConfetti.checked ? 1 : 0;
        const k = toggleLuckyCoins && toggleLuckyCoins.checked ? 1 : 0;
        const h = toggleHangingLanterns && toggleHangingLanterns.checked ? 1 : 0;
        const r = toggleSpringRain && toggleSpringRain.checked ? 1 : 0;
        const activeCount = s + l + c + k + h + r;
        accBadgeAmbient.textContent = `Bật ${activeCount}/6`;
    };

    if (toggleStardust) {
        toggleStardust.addEventListener('change', (e) => {
            if (window.ambient) window.ambient.setStardust(e.target.checked);
            updateAmbientBadge();
        });
    }

    if (toggleLanterns) {
        toggleLanterns.addEventListener('change', (e) => {
            if (window.ambient) window.ambient.setLanterns(e.target.checked);
            updateAmbientBadge();
        });
    }

    if (toggleConfetti) {
        toggleConfetti.addEventListener('change', (e) => {
            if (window.ambient) window.ambient.setConfetti(e.target.checked);
            updateAmbientBadge();
        });
    }

    if (toggleLuckyCoins) {
        toggleLuckyCoins.addEventListener('change', (e) => {
            if (window.ambient) window.ambient.setLuckyCoins(e.target.checked);
            updateAmbientBadge();
        });
    }

    if (toggleHangingLanterns) {
        toggleHangingLanterns.addEventListener('change', (e) => {
            updateHangingLanterns(e.target.checked);
            updateAmbientBadge();
        });
    }

    if (toggleSpringRain) {
        toggleSpringRain.addEventListener('change', (e) => {
            if (window.ambient) window.ambient.setSpringRain(e.target.checked);
            updateAmbientBadge();
        });
    }

    if (petalFilterSelect) {
        petalFilterSelect.addEventListener('change', (e) => {
            if (window.petals) window.petals.setFilter(e.target.value);
        });
    }

    updateAmbientBadge();

    // Effect Quantity & Density Sliders Wiring
    const sliderFireworkDensity = document.getElementById('slider-firework-density');
    const badgeFireworkDensity = document.getElementById('badge-firework-density');
    const sliderPetalDensity = document.getElementById('slider-petal-density');
    const badgePetalDensity = document.getElementById('badge-petal-density');
    const sliderLanternCount = document.getElementById('slider-lantern-count');
    const badgeLanternCount = document.getElementById('badge-lantern-count');
    const sliderStardustDensity = document.getElementById('slider-stardust-density');
    const badgeStardustDensity = document.getElementById('badge-stardust-density');
    const sliderConfettiDensity = document.getElementById('slider-confetti-density');
    const badgeConfettiDensity = document.getElementById('badge-confetti-density');

    // 1. Fireworks Density Slider
    const fireworkDensityMap = {
        '1': { key: 'low', label: 'Thưa Nhẹ Nhàng 🎆' },
        '2': { key: 'medium', label: 'Tiêu Chuẩn 🎆' },
        '3': { key: 'high', label: 'Đại Tiệc Rực Rỡ 🎆' }
    };
    if (sliderFireworkDensity) {
        const savedFwDensity = localStorage.getItem('tet-firework-density') || 'high';
        const initialVal = savedFwDensity === 'low' ? '1' : savedFwDensity === 'medium' ? '2' : '3';
        sliderFireworkDensity.value = initialVal;
        if (badgeFireworkDensity) badgeFireworkDensity.textContent = fireworkDensityMap[initialVal].label;

        sliderFireworkDensity.addEventListener('input', (e) => {
            const item = fireworkDensityMap[e.target.value] || fireworkDensityMap['3'];
            if (badgeFireworkDensity) badgeFireworkDensity.textContent = item.label;
            if (window.fireworks) window.fireworks.setDensity(item.key);
        });
    }

    // 2. Petals Density Slider
    if (sliderPetalDensity) {
        const savedPetalDensity = localStorage.getItem('tet-petal-density') || '35';
        sliderPetalDensity.value = savedPetalDensity;
        if (badgePetalDensity) badgePetalDensity.textContent = `${savedPetalDensity} cánh 🌸`;

        sliderPetalDensity.addEventListener('input', (e) => {
            const val = e.target.value;
            if (badgePetalDensity) badgePetalDensity.textContent = `${val} cánh 🌸`;
            if (window.petals) window.petals.setDensity(val);
        });
    }

    // 3. Lanterns Count Slider
    if (sliderLanternCount) {
        const savedLanternCount = localStorage.getItem('tet-lantern-count') || '6';
        sliderLanternCount.value = savedLanternCount;
        if (badgeLanternCount) badgeLanternCount.textContent = `${savedLanternCount} đèn 🏮`;

        sliderLanternCount.addEventListener('input', (e) => {
            const val = e.target.value;
            if (badgeLanternCount) badgeLanternCount.textContent = `${val} đèn 🏮`;
            if (window.ambient) window.ambient.setLanternsCount(val);
        });
    }

    // 4. Stardust Density Slider
    if (sliderStardustDensity) {
        const savedStardustDensity = localStorage.getItem('tet-stardust-density') || '40';
        sliderStardustDensity.value = savedStardustDensity;
        if (badgeStardustDensity) badgeStardustDensity.textContent = `${savedStardustDensity} hạt ✨`;

        sliderStardustDensity.addEventListener('input', (e) => {
            const val = e.target.value;
            if (badgeStardustDensity) badgeStardustDensity.textContent = `${val} hạt ✨`;
            if (window.ambient) window.ambient.setStardustDensity(val);
        });
    }

    // 5. Confetti Density Slider
    if (sliderConfettiDensity) {
        const savedConfettiDensity = localStorage.getItem('tet-confetti-density') || '35';
        sliderConfettiDensity.value = savedConfettiDensity;
        if (badgeConfettiDensity) badgeConfettiDensity.textContent = `${savedConfettiDensity} mảnh 🎊`;

        sliderConfettiDensity.addEventListener('input', (e) => {
            const val = e.target.value;
            if (badgeConfettiDensity) badgeConfettiDensity.textContent = `${val} mảnh 🎊`;
            if (window.ambient) window.ambient.setConfettiDensity(val);
        });
    }

    // 6. Background Scrolling Wish Marquee (Chữ Chạy Dưới Background)
    const bgMarqueeLayer = document.getElementById('bg-marquee-layer');
    const toggleBgMarquee = document.getElementById('toggle-bg-marquee');
    const inputBgMarqueeText = document.getElementById('input-bg-marquee-text');
    const btnBgMarqueeRandom = document.getElementById('btn-bg-marquee-random');
    const selectBgMarqueeStyle = document.getElementById('select-bg-marquee-style');
    const sliderBgMarqueeSpeed = document.getElementById('slider-bg-marquee-speed');
    const badgeBgMarqueeSpeed = document.getElementById('badge-bg-marquee-speed');
    const sliderBgMarqueeSize = document.getElementById('slider-bg-marquee-size');
    const badgeBgMarqueeSize = document.getElementById('badge-bg-marquee-size');
    const sliderBgMarqueeOpacity = document.getElementById('slider-bg-marquee-opacity');
    const badgeBgMarqueeOpacity = document.getElementById('badge-bg-marquee-opacity');

    if (bgMarqueeLayer) {
        const defaultMarqueeState = {
            enabled: true,
            text: '🌸 Chúc Mừng Năm Mới Đinh Mùi 2027 • An Khang Thịnh Vượng • Vạn Sự Như Ý • Tấn Tài Tấn Lộc 🌸',
            style: 'multi',
            speed: 2,
            size: 52,
            opacity: 16
        };

        let marqueeState = { ...defaultMarqueeState };
        try {
            const saved = JSON.parse(localStorage.getItem('tet-bg-marquee') || 'null');
            if (saved && typeof saved === 'object') {
                marqueeState = { ...defaultMarqueeState, ...saved };
            }
        } catch (err) {
            marqueeState = { ...defaultMarqueeState };
        }

        const marqueePresets = [
            '🌸 Chúc Mừng Năm Mới Đinh Mùi 2027 • An Khang Thịnh Vượng • Vạn Sự Như Ý • Tấn Tài Tấn Lộc 🌸',
            '🧧 Cung Chúc Tân Xuân • Phát Tài Phát Lộc • Gia Đạo Bình An • Sum Vầy Hạnh Phúc 🧧',
            '✨ Xuân Đinh Mùi 2027 • Mã Đáo Thành Công • Công Danh Rạng Rỡ • Tiền Vào Như Nước ✨',
            '🏮 Tết Đoàn Viên • Bách Niên Giai Lão • Sức Khỏe Dồi Dào • Cát Tường Như Ý 🏮',
            '🎆 Khai Xuân Đắc Lộc • Vạn Sự Hanh Thông • Sự Nghiệp Thăng Hoa • Niềm Vui Ngập Tràn 🎆',
            '🌼 Hoa Mai Nở Rộ • Đón Lộc Đầu Năm • Bình An May Mắn • Cả Năm Sung Túc 🌼'
        ];

        const speedDurationMap = {
            1: { duration: '52s', label: 'Chậm' },
            2: { duration: '34s', label: 'Vừa' },
            3: { duration: '20s', label: 'Nhanh' }
        };

        const saveMarqueeState = () => {
            localStorage.setItem('tet-bg-marquee', JSON.stringify(marqueeState));
        };

        const renderBgMarquee = () => {
            const text = (marqueeState.text || '').trim() || defaultMarqueeState.text;
            const speedInfo = speedDurationMap[marqueeState.speed] || speedDurationMap[2];

            bgMarqueeLayer.classList.toggle('hidden', !marqueeState.enabled);
            bgMarqueeLayer.classList.remove('style-multi', 'style-single', 'style-diagonal');
            bgMarqueeLayer.classList.add(`style-${marqueeState.style || 'multi'}`);

            bgMarqueeLayer.style.setProperty('--marquee-opacity', (marqueeState.opacity / 100).toFixed(2));
            bgMarqueeLayer.style.setProperty('--marquee-size', `${marqueeState.size}px`);
            bgMarqueeLayer.style.setProperty('--marquee-duration', speedInfo.duration);

            const rowCount = marqueeState.style === 'single' ? 1 : 3;
            bgMarqueeLayer.innerHTML = '';

            for (let r = 0; r < rowCount; r++) {
                const row = document.createElement('div');
                row.className = `bg-marquee-row${r % 2 === 1 ? ' reverse' : ''}`;

                const track = document.createElement('div');
                track.className = 'bg-marquee-track';

                // Two identical groups for seamless 50% infinite loop
                for (let g = 0; g < 2; g++) {
                    const group = document.createElement('div');
                    group.className = 'bg-marquee-group';
                    for (let k = 0; k < 3; k++) {
                        const span = document.createElement('span');
                        span.textContent = text;
                        group.appendChild(span);
                    }
                    track.appendChild(group);
                }

                row.appendChild(track);
                bgMarqueeLayer.appendChild(row);
            }
        };

        // Sync UI controls with loaded state
        if (toggleBgMarquee) toggleBgMarquee.checked = Boolean(marqueeState.enabled);
        if (inputBgMarqueeText) inputBgMarqueeText.value = marqueeState.text;
        if (selectBgMarqueeStyle) selectBgMarqueeStyle.value = marqueeState.style;
        if (sliderBgMarqueeSpeed) sliderBgMarqueeSpeed.value = String(marqueeState.speed);
        if (badgeBgMarqueeSpeed) {
            badgeBgMarqueeSpeed.textContent = (speedDurationMap[marqueeState.speed] || speedDurationMap[2]).label;
        }
        if (sliderBgMarqueeSize) sliderBgMarqueeSize.value = String(marqueeState.size);
        if (badgeBgMarqueeSize) badgeBgMarqueeSize.textContent = `${marqueeState.size}px`;
        if (sliderBgMarqueeOpacity) sliderBgMarqueeOpacity.value = String(marqueeState.opacity);
        if (badgeBgMarqueeOpacity) badgeBgMarqueeOpacity.textContent = `${marqueeState.opacity}%`;

        renderBgMarquee();

        if (toggleBgMarquee) {
            toggleBgMarquee.addEventListener('change', (e) => {
                marqueeState.enabled = e.target.checked;
                saveMarqueeState();
                renderBgMarquee();
            });
        }

        if (inputBgMarqueeText) {
            inputBgMarqueeText.addEventListener('input', (e) => {
                marqueeState.text = e.target.value;
                saveMarqueeState();
                renderBgMarquee();
            });
        }

        if (btnBgMarqueeRandom) {
            btnBgMarqueeRandom.addEventListener('click', () => {
                const others = marqueePresets.filter(p => p !== marqueeState.text);
                const pick = others[Math.floor(Math.random() * others.length)] || marqueePresets[0];
                marqueeState.text = pick;
                if (inputBgMarqueeText) inputBgMarqueeText.value = pick;
                saveMarqueeState();
                renderBgMarquee();
                if (window.tetAudio) window.tetAudio.playLuckyChime();
            });
        }

        if (selectBgMarqueeStyle) {
            selectBgMarqueeStyle.addEventListener('change', (e) => {
                marqueeState.style = e.target.value;
                saveMarqueeState();
                renderBgMarquee();
            });
        }

        if (sliderBgMarqueeSpeed) {
            sliderBgMarqueeSpeed.addEventListener('input', (e) => {
                const speedVal = parseInt(e.target.value, 10) || 2;
                marqueeState.speed = speedVal;
                if (badgeBgMarqueeSpeed) {
                    badgeBgMarqueeSpeed.textContent = (speedDurationMap[speedVal] || speedDurationMap[2]).label;
                }
                saveMarqueeState();
                renderBgMarquee();
            });
        }

        if (sliderBgMarqueeSize) {
            sliderBgMarqueeSize.addEventListener('input', (e) => {
                const sizeVal = parseInt(e.target.value, 10) || 52;
                marqueeState.size = sizeVal;
                if (badgeBgMarqueeSize) badgeBgMarqueeSize.textContent = `${sizeVal}px`;
                saveMarqueeState();
                renderBgMarquee();
            });
        }

        if (sliderBgMarqueeOpacity) {
            sliderBgMarqueeOpacity.addEventListener('input', (e) => {
                const opVal = parseInt(e.target.value, 10) || 16;
                marqueeState.opacity = opVal;
                if (badgeBgMarqueeOpacity) badgeBgMarqueeOpacity.textContent = `${opVal}%`;
                saveMarqueeState();
                renderBgMarquee();
            });
        }
    }

    // 8. Synchronized 12 Artistic Vietnamese Fonts Switcher
    const fontSelect = document.getElementById('font-picker-select');
    let savedFont = localStorage.getItem('tet-font');
    if (!savedFont || savedFont === 'font-vietnam') {
        savedFont = 'font-uvn-thuphap';
    }

    const allFonts = [
        'font-playfair', 'font-merriweather', 'font-lora', 'font-svn-athena', 'font-svn-didot',
        'font-dancing', 'font-svn-angellina', 'font-svn-brusher', 'font-uvn-thuphap', 'font-hp-thuphap',
        'font-montserrat', 'font-jakarta'
    ];

    const applyFont = (fontClass) => {
        allFonts.forEach(f => document.body.classList.remove(f));
        document.body.classList.add(fontClass);
        if (fontSelect) fontSelect.value = fontClass;
        localStorage.setItem('tet-font', fontClass);

        const accBadgeFont = document.getElementById('acc-badge-font');
        if (accBadgeFont && fontSelect && fontSelect.selectedIndex >= 0) {
            const rawText = fontSelect.options[fontSelect.selectedIndex].textContent;
            const match = rawText.match(/\d+\.\s*([A-Za-z0-9\s-]+)\s*—/);
            accBadgeFont.textContent = match ? match[1].trim() : rawText.split('—')[0].trim();
        }

        const previewSample = document.getElementById('font-live-preview-sample');
        if (previewSample) {
            previewSample.style.fontFamily = `var(--font-heading)`;
        }

        // Synchronize card canvas renderer font
        if (window.cardMaker) {
            window.cardMaker.requestSmartRender();
        }
    };

    applyFont(savedFont);

    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            applyFont(e.target.value);
            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
        });
    }

    // 7. Interactive Music Player & Custom MP3 Vocal Support
    const musicPlayBtn = document.getElementById('btn-music-play');
    const musicPrevBtn = document.getElementById('btn-music-prev');
    const musicNextBtn = document.getElementById('btn-music-next');
    const musicSongSelect = document.getElementById('music-song-select');
    const musicTitle = document.getElementById('music-current-title');
    const musicModeLabel = document.getElementById('music-mode-label');
    const vinylDisk = document.getElementById('music-vinyl-disk');
    const volumeSlider = document.getElementById('music-volume-slider');
    const uploadMusicBtn = document.getElementById('btn-upload-music');
    const userMusicInput = document.getElementById('user-music-input');

    // Toast notification (safe text rendering, prevents DOM XSS)
    const showToast = (message, duration = 3500) => {
        const toast = document.getElementById('tet-toast');
        if (!toast) return;
        toast.textContent = String(message ?? '');
        toast.classList.remove('hidden');
        if (window.toastTimer) clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    };

    // Render song options into the dropdown
    const renderSongDropdown = (playlist) => {
        if (!musicSongSelect || !playlist) return;
        musicSongSelect.innerHTML = '';
        playlist.forEach((song, idx) => {
            const opt = document.createElement('option');
            opt.value = String(idx);
            if (song.isDefault) {
                opt.textContent = `🎤 ${idx + 1}. ${song.name} - ${song.artist}`;
            } else if (song.type === 'custom') {
                opt.textContent = `🎤 ${idx + 1}. ${song.name} (Của bạn)`;
            } else {
                opt.textContent = `🎵 ${idx + 1}. ${song.name}`;
            }
            musicSongSelect.appendChild(opt);
        });
        if (window.tetAudio) {
            musicSongSelect.value = String(window.tetAudio.currentSongIndex);
        }
    };

    // Render custom uploaded and default songs inside the Settings modal
    const renderCustomSongsSettingsList = () => {
        const container = document.getElementById('custom-songs-list-container');
        if (!container || !window.tetAudio) return;

        const allSongs = window.tetAudio.playlist.map((song, index) => ({ ...song, index }));
        const customCount = allSongs.filter(s => s.type === 'custom').length;

        const accBadgeMusic = document.getElementById('acc-badge-music');
        if (accBadgeMusic) {
            accBadgeMusic.textContent = customCount > 0 ? `${allSongs.length} bài (${customCount} bài thêm)` : `${allSongs.length} bài mặc định`;
        }

        if (allSongs.length === 0) {
            container.textContent = '';
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'custom-songs-empty';
            emptyDiv.textContent = 'Chưa có bài hát nào trong danh sách. Hãy bấm nút trên để thêm bài hát Tết yêu thích của bạn!';
            container.appendChild(emptyDiv);
            return;
        }

        container.textContent = '';
        allSongs.forEach(song => {
            const isCurrent = (window.tetAudio.currentSongIndex === song.index);
            const isPlaying = isCurrent && window.tetAudio.bgmPlaying;

            const item = document.createElement('div');
            item.className = 'custom-song-item' + (isCurrent ? ' active-song' : '');

            const fullTitle = song.artist ? `${song.name} - ${song.artist}` : song.name;

            const nameWrap = document.createElement('div');
            nameWrap.className = 'custom-song-name';
            nameWrap.title = fullTitle;

            const micIcon = document.createElement('span');
            micIcon.textContent = '🎤';
            nameWrap.appendChild(micIcon);

            const nameText = document.createElement('span');
            nameText.className = 'custom-song-name-text';
            nameText.textContent = fullTitle;
            nameWrap.appendChild(nameText);

            if (song.isDefault) {
                const badge = document.createElement('span');
                badge.className = 'default-song-badge';
                badge.title = 'Bài hát Tết mặc định của trang';
                badge.textContent = 'Mặc định';
                nameWrap.appendChild(badge);
            }

            const actionsWrap = document.createElement('div');
            actionsWrap.className = 'custom-song-actions';

            const playBtn = document.createElement('button');
            playBtn.className = 'btn-song-play-mini';
            playBtn.title = 'Phát bài này';
            playBtn.textContent = isPlaying ? '⏸️ Tạm Dừng' : '▶️ Phát';
            actionsWrap.appendChild(playBtn);

            let deleteBtn = null;
            if (!song.isDefault) {
                deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn-song-delete-mini';
                deleteBtn.title = 'Xóa khỏi danh sách phát';
                deleteBtn.textContent = '🗑️';
                actionsWrap.appendChild(deleteBtn);
            }

            item.appendChild(nameWrap);
            item.appendChild(actionsWrap);

            playBtn.addEventListener('click', () => {
                if (isCurrent) {
                    window.tetAudio.toggleBGM();
                } else {
                    window.tetAudio.selectSong(song.index);
                    window.tetAudio.startBGM();
                }
                updateMusicUI();
                renderCustomSongsSettingsList();
            });

            if (deleteBtn) {
                deleteBtn.addEventListener('click', async () => {
                    if (confirm(`Bạn có chắc muốn xóa bài "${song.name}" khỏi danh sách phát không?`)) {
                        await window.tetAudio.removeCustomSong(song.id);
                        renderSongDropdown(window.tetAudio.playlist);
                        renderCustomSongsSettingsList();
                        updateMusicUI();
                        showToast(`🗑️ Đã xóa bài hát "${song.name}" khỏi danh sách!`);
                    }
                });
            }

            container.appendChild(item);
        });
    };

    const playerVolIcon = document.getElementById('player-vol-icon');
    const updateVolIcon = (val) => {
        if (!playerVolIcon) return;
        if (val === 0 || (window.tetAudio && window.tetAudio.isMuted)) {
            playerVolIcon.textContent = '🔇';
        } else if (val < 0.45) {
            playerVolIcon.textContent = '🔉';
        } else {
            playerVolIcon.textContent = '🔊';
        }
    };

    const updateMusicUI = (song = null) => {
        if (!window.tetAudio) return;
        const currentIdx = window.tetAudio.currentSongIndex;
        const isPlaying = window.tetAudio.bgmPlaying;
        if (!song) song = window.tetAudio.playlist[currentIdx];

        if (song) {
            if (musicModeLabel) {
                musicModeLabel.textContent = song.isDefault ? 'NHẠC TẾT CÓ LỜI' : (song.type === 'custom' ? 'NHẠC CỦA BẠN (CÓ LỜI)' : 'GIAI ĐIỆU XUÂN');
            }
            if (musicTitle) {
                const displayName = song.artist ? `${song.name} - ${song.artist}` : song.name;
                musicTitle.textContent = displayName;
                musicTitle.title = displayName;
            }
        }

        if (musicSongSelect) {
            musicSongSelect.value = String(currentIdx);
        }

        if (musicPlayBtn) {
            musicPlayBtn.innerHTML = isPlaying
                ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
                : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;"><path d="M8 5v14l11-7z"/></svg>`;
            musicPlayBtn.title = isPlaying ? 'Tạm dừng nhạc Tết' : 'Phát nhạc Tết';
        }
        if (vinylDisk) {
            vinylDisk.classList.toggle('spinning', isPlaying);
        }
    };

    // Bind audio engine callbacks
    if (window.tetAudio) {
        window.tetAudio.onPlaylistChange = (playlist) => {
            renderSongDropdown(playlist);
            renderCustomSongsSettingsList();
            updateMusicUI();
        };

        window.tetAudio.onSongChange = (song) => {
            updateMusicUI(song);
            renderCustomSongsSettingsList();
        };

        // Initial populate
        renderSongDropdown(window.tetAudio.playlist);
        renderCustomSongsSettingsList();
    }

    if (musicPlayBtn) {
        musicPlayBtn.addEventListener('click', () => {
            window.tetAudio.toggleBGM();
            updateMusicUI();
            renderCustomSongsSettingsList();
        });
    }

    if (musicNextBtn) {
        musicNextBtn.addEventListener('click', () => {
            const song = window.tetAudio.nextSong();
            updateMusicUI(song);
            renderCustomSongsSettingsList();
        });
    }

    if (musicPrevBtn) {
        musicPrevBtn.addEventListener('click', () => {
            const song = window.tetAudio.prevSong();
            updateMusicUI(song);
            renderCustomSongsSettingsList();
        });
    }

    if (musicSongSelect) {
        musicSongSelect.addEventListener('change', (e) => {
            const idx = parseInt(e.target.value, 10);
            const song = window.tetAudio.selectSong(idx);
            updateMusicUI(song);
            renderCustomSongsSettingsList();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            window.tetAudio.setVolume(val);
            updateVolIcon(val);
        });
    }

    if (playerVolIcon) {
        playerVolIcon.style.cursor = 'pointer';
        playerVolIcon.addEventListener('click', () => {
            const isMuted = window.tetAudio.toggleMute();
            if (muteBtn) {
                muteBtn.classList.toggle('active', isMuted);
                muteBtn.innerHTML = isMuted ? `<span>🔇</span> Tắt Âm` : `<span>🔊</span> Bật Âm`;
            }
            updateVolIcon(isMuted ? 0 : window.tetAudio.volume);
        });
    }

    // Custom MP3 File Upload from computer
    const modalUploadMusicBtn = document.getElementById('btn-modal-upload-music');
    if (modalUploadMusicBtn && userMusicInput) {
        modalUploadMusicBtn.addEventListener('click', () => {
            userMusicInput.click();
        });
    }

    if (uploadMusicBtn && userMusicInput) {
        uploadMusicBtn.addEventListener('click', () => {
            userMusicInput.click();
        });

        userMusicInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            const maxAudioBytes = 25 * 1024 * 1024;
            const validAudioExt = /\.(mp3|wav|ogg|m4a|aac)$/i.test(file.name);
            if ((!file.type.startsWith('audio/') && !validAudioExt) || file.size > maxAudioBytes) {
                showToast('⚠️ Vui lòng chọn tệp âm thanh hợp lệ (.mp3, .wav, .ogg, .m4a) tối đa 25MB.');
                userMusicInput.value = '';
                return;
            }

            const addedSong = await window.tetAudio.addUserAudioFile(file, true);
            updateMusicUI();
            renderSongDropdown(window.tetAudio.playlist);
            renderCustomSongsSettingsList();
            fireworks.explodeAt(window.innerWidth / 2, window.innerHeight * 0.35);
            showToast(`🎶 Đã thêm "${addedSong.name}" vào danh sách phát nhạc Tết!`);
            userMusicInput.value = ''; // Reset input to allow selecting same file again
        });
    }

    // 8. Global Mute Button
    const muteBtn = document.getElementById('btn-toggle-mute');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            const isMuted = window.tetAudio.toggleMute();
            muteBtn.classList.toggle('active', isMuted);
            muteBtn.innerHTML = isMuted ? `<span>🔇</span> Tắt Âm` : `<span>🔊</span> Bật Âm`;
            updateVolIcon(isMuted ? 0 : window.tetAudio.volume);
        });
    }

    // 9. Fireworks Frenzy Button (Đại Tiệc Pháo Hoa Giao Thừa Cực Hoành Tráng)
    const frenzyBtn = document.getElementById('btn-fireworks-frenzy');
    if (frenzyBtn) {
        frenzyBtn.addEventListener('click', () => {
            if (window.tetAudio) {
                window.tetAudio.init();
            }
            fireworks.triggerMegaFrenzy();
        });
    }

    // 10. Petals Mode Selector
    const petalSelector = document.getElementById('petal-flower-filter');
    if (petalSelector) {
        petalSelector.addEventListener('change', (e) => {
            petals.setMode(e.target.value);
        });
    }

    // 11. Mascot Goat Interaction
    const mascotBtn = document.getElementById('mascot-goat-btn');
    const mascotBubble = document.querySelector('.mascot-speech-bubble');
    if (mascotBtn || mascotBubble) {
        const mascotWishes = [
            "Chúc bạn năm Đinh Mùi 2027 vạn sự đại cát, tấn tài tấn lộc! 🌸",
            "Năm con Dê vàng: Sức khỏe dồi dào, tiền vào rủng rỉnh! 💰",
            "Tết đến trăm điều như ý, xuân sang vạn sự bình an! 🧧",
            "Công danh rạng rỡ, tình duyên phơi phới, cả năm ngập tràn tiếng cười! ✨",
            "Đắc thời đắc lợi, khai xuân đắc lộc, tấn tới bình an! 🎋",
            "Tết sum vầy đầm ấm, phát tài phát lộc, vạn sự hanh thông! 🏮"
        ];
        let wishIndex = 0;
        const triggerMascotWish = () => {
            if (window.tetAudio) window.tetAudio.playLuckyChime();
            fireworks.explodeAt(window.innerWidth / 2, window.innerHeight * 0.25);
            const bubble = document.querySelector('.mascot-speech-bubble');
            if (bubble) {
                wishIndex = (wishIndex + 1) % mascotWishes.length;
                bubble.textContent = mascotWishes[wishIndex];
                bubble.classList.remove('bubble-popping');
                void bubble.offsetWidth;
                bubble.classList.add('bubble-popping');
            }
        };

        if (mascotBtn) mascotBtn.addEventListener('click', triggerMascotWish);
        if (mascotBubble) mascotBubble.addEventListener('click', triggerMascotWish);
    }

    // 12. Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSettings();
            const fortuneModal = document.getElementById('fortune-modal');
            const lixiModal = document.getElementById('lixi-modal');
            const calendarModal = document.getElementById('lunar-calendar-modal');
            if (fortuneModal) fortuneModal.classList.add('hidden');
            if (lixiModal) lixiModal.classList.add('hidden');
            if (calendarModal) calendarModal.classList.add('hidden');
            return;
        }
        if (['input', 'textarea', 'select'].includes(document.activeElement.tagName.toLowerCase())) return;
        if (e.key === 'f' || e.key === 'F') {
            fireworks.explodeAt(Math.random() * window.innerWidth, window.innerHeight * 0.35);
        }
    });

    // 13. Tab Navigation
    const tabs = document.querySelectorAll('.nav-tab-btn');
    const sections = document.querySelectorAll('.app-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            if (!targetId) return;

            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            if (targetId === 'section-card' && window.cardMaker) {
                window.cardMaker.renderIfNeeded();
            }

            if (window.tetAudio) window.tetAudio.playLuckyChime();
        });
    });

    // ==========================================================
    // 14. TRADITIONAL TET COUPLETS ROTATION & CLICK INTERACTION
    // 12 Authentic 7-word Couplets • Auto-rotate every 10s • Click to cycle
    // ==========================================================
    const TET_COUPLETS = [
        {
            left: "MAI VÀNG NỞ RỘ MỪNG XUÂN MỚI",
            right: "ĐÀO THẮM KHOE SẮC ĐÓN TẾT SANG"
        },
        {
            left: "XUÂN AN KHANG ĐỨC TÀI NHƯ Ý",
            right: "NIÊN THỊNH VƯỢNG PHÚC THỌ VÔ BIÊN"
        },
        {
            left: "ĐÓN XUÂN SANG PHÚC LỘC ĐẦY NHÀ",
            right: "MỪNG NĂM MỚI VẠN SỰ HANH THÔNG"
        },
        {
            left: "TẾT SUM VẦY MUÔN NHÀ ÊM ẤM",
            right: "XUÂN HẠNH PHÚC VẠN CHỐN AN VUI"
        },
        {
            left: "HOA KHAI PHÚ QUÝ NGHÊNH TÂN LỘC",
            right: "TRÚC BÁO BÌNH AN HƯỞNG THÁI HÒA"
        },
        {
            left: "TẤN TÀI TẤN LỘC NIÊN NIÊN PHÁT",
            right: "ĐẮC THỜI ĐẮC LỢI NHẬT NHẬT THĂNG"
        },
        {
            left: "XUÂN ĐÁO BÌNH AN TÀI LỢI TIẾN",
            right: "MAI KHAI PHÚ QUÝ LỘC QUYỀN LAI"
        },
        {
            left: "NĂM MỚI THỪA HƯỞNG DUYÊN MAY MẮN",
            right: "TẾT ĐẾN RẠNG NGỜI ÁNH VINH QUANG"
        },
        {
            left: "ĐẤT SINH TÀI NGHIỆP CÔNG THÀNH ĐẠT",
            right: "TRỜI BAN PHÚC LỘC THỌ MIÊN TRƯỜNG"
        },
        {
            left: "MỪNG XUÂN MỚI TRĂM ĐIỀU NHƯ Ý",
            right: "ĐÓN TẾT SANG VẠN SỰ CÁT TƯỜNG"
        },
        {
            left: "XUÂN PHONG ĐẮC Ý TIỀN VÀO CỬA",
            right: "TUẾ NGUYỆT AN LÀNH LỘC ĐẾN NHÀ"
        },
        {
            left: "SƠN THỦY HỮU TÌNH XUÂN THẮM SẮC",
            right: "CÀN KHÔN TỤ HỘI PHÚC TRÙNG LAI"
        }
    ];

    let currentCoupletIndex = 0;
    let coupletAutoTimer = null;

    const coupletLeftCol = document.getElementById('couplet-left');
    const coupletRightCol = document.getElementById('couplet-right');
    const coupletWordsLeft = document.getElementById('couplet-words-left');
    const coupletWordsRight = document.getElementById('couplet-words-right');
    const mobileCoupletBar = document.getElementById('mobile-couplet-bar');
    const mobileVerse1 = document.getElementById('mobile-couplet-verse-1');
    const mobileVerse2 = document.getElementById('mobile-couplet-verse-2');

    const updateCoupletDOM = (idx) => {
        const item = TET_COUPLETS[idx];
        if (!item) return;

        // Desktop Left Couplet Words
        if (coupletWordsLeft) {
            const leftWords = item.left.split(' ');
            coupletWordsLeft.innerHTML = leftWords.map(w => `<div class="couplet-word">${w}</div>`).join('');
        }

        // Desktop Right Couplet Words
        if (coupletWordsRight) {
            const rightWords = item.right.split(' ');
            coupletWordsRight.innerHTML = rightWords.map(w => `<div class="couplet-word">${w}</div>`).join('');
        }

        // Mobile Couplet Bar
        if (mobileVerse1) {
            const sentenceLeft = item.left.charAt(0) + item.left.slice(1).toLowerCase();
            mobileVerse1.innerHTML = `🌸 ${sentenceLeft}`;
        }
        if (mobileVerse2) {
            const sentenceRight = item.right.charAt(0) + item.right.slice(1).toLowerCase();
            mobileVerse2.innerHTML = `🌺 ${sentenceRight}`;
        }
    };

    const renderCoupletWithTransition = (idx, animate = true) => {
        const targets = [coupletLeftCol, coupletRightCol, mobileCoupletBar].filter(Boolean);

        if (!animate) {
            updateCoupletDOM(idx);
            return;
        }

        targets.forEach(el => el.classList.add('fade-out'));

        setTimeout(() => {
            updateCoupletDOM(idx);
            targets.forEach(el => {
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
            });
            setTimeout(() => {
                targets.forEach(el => el.classList.remove('fade-in'));
            }, 350);
        }, 250);
    };

    const cycleNextCouplet = (fromUserClick = false) => {
        currentCoupletIndex = (currentCoupletIndex + 1) % TET_COUPLETS.length;
        renderCoupletWithTransition(currentCoupletIndex, true);

        if (fromUserClick) {
            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
            showToast(`🎋 Câu đối [${currentCoupletIndex + 1}/${TET_COUPLETS.length}]: Cung chúc tân xuân!`, 2200);
        }

        // Always reset the 10-second timer
        startCoupletTimer();
    };

    const startCoupletTimer = () => {
        if (coupletAutoTimer) clearInterval(coupletAutoTimer);
        coupletAutoTimer = setInterval(() => {
            cycleNextCouplet(false);
        }, 10000); // 10 seconds auto-rotation
    };

    // Attach click listeners to desktop couplets and mobile bar
    if (coupletLeftCol) {
        coupletLeftCol.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = coupletLeftCol.getBoundingClientRect();
            fireworks.explodeAt(rect.right + 25, rect.top + 70);
            cycleNextCouplet(true);
        });
    }

    if (coupletRightCol) {
        coupletRightCol.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = coupletRightCol.getBoundingClientRect();
            fireworks.explodeAt(rect.left - 25, rect.top + 70);
            cycleNextCouplet(true);
        });
    }

    if (mobileCoupletBar) {
        mobileCoupletBar.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = mobileCoupletBar.getBoundingClientRect();
            fireworks.explodeAt(rect.left + rect.width / 2, rect.top);
            cycleNextCouplet(true);
        });
    }

    // Initialize first couplet & start auto-timer
    updateCoupletDOM(currentCoupletIndex);
    startCoupletTimer();

    // ==========================================================
    // 14. CUSTOM BACKGROUND IMAGE MANAGER (Upload, URL, Fit, Overlay, Blur + IndexedDB)
    // ==========================================================
    const customBgLayer = document.getElementById('custom-bg-layer');
    const customBgImage = document.getElementById('custom-bg-image');
    const customBgOverlay = document.getElementById('custom-bg-overlay');

    const bgFileInput = document.getElementById('bg-image-file-input');
    const bgUploadBtn = document.getElementById('btn-upload-bg-image');
    const bgResetBtn = document.getElementById('btn-reset-bg-image');
    const bgUrlInput = document.getElementById('input-bg-image-url');
    const bgApplyUrlBtn = document.getElementById('btn-apply-bg-url');

    const bgPreviewWrap = document.getElementById('bg-image-preview-wrap');
    const bgPreviewThumb = document.getElementById('bg-preview-thumb');
    const bgPreviewName = document.getElementById('bg-preview-name');
    const bgClearActiveBtn = document.getElementById('btn-clear-active-bg');
    const bgControlsGrid = document.getElementById('bg-image-controls');

    const bgFitSelect = document.getElementById('select-bg-fit');
    const bgOverlaySlider = document.getElementById('slider-bg-overlay');
    const bgOverlayBadge = document.getElementById('badge-bg-overlay');
    const bgBlurSlider = document.getElementById('slider-bg-blur');
    const bgBlurBadge = document.getElementById('badge-bg-blur');

    const savedBgListWrap = document.getElementById('saved-bg-list-wrap');
    const savedBgGrid = document.getElementById('saved-bg-grid');

    const BG_DB_NAME = 'Tet2027_Bg_DB';
    const BG_STORE_NAME = 'backgrounds';
    const BG_KEY_ACTIVE = 'tet-custom-bg-active';
    const BG_KEY_FIT = 'tet-custom-bg-fit';
    const BG_KEY_OVERLAY = 'tet-custom-bg-overlay';
    const BG_KEY_BLUR = 'tet-custom-bg-blur';

    let savedBgItems = []; // [{ id, name, url, createdAt }]

    const openBgDb = () => {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.indexedDB) {
                resolve(null);
                return;
            }
            const req = indexedDB.open(BG_DB_NAME, 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(BG_STORE_NAME)) {
                    db.createObjectStore(BG_STORE_NAME, { keyPath: 'id' });
                }
            };
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror = (e) => reject(e.target.error);
        });
    };

    const saveBgToDb = async (id, name, blob) => {
        try {
            const db = await openBgDb();
            if (!db) return false;
            return await new Promise((resolve) => {
                const tx = db.transaction(BG_STORE_NAME, 'readwrite');
                const store = tx.objectStore(BG_STORE_NAME);
                store.put({ id, name, blob, createdAt: Date.now() });
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch (err) {
            console.warn('Lỗi lưu ảnh nền vào IndexedDB:', err);
            return false;
        }
    };

    const loadBgsFromDb = async () => {
        try {
            const db = await openBgDb();
            if (!db) return [];
            return await new Promise((resolve) => {
                const tx = db.transaction(BG_STORE_NAME, 'readonly');
                const store = tx.objectStore(BG_STORE_NAME);
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            });
        } catch (err) {
            console.warn('Lỗi đọc ảnh nền từ IndexedDB:', err);
            return [];
        }
    };

    const deleteBgFromDb = async (id) => {
        try {
            const db = await openBgDb();
            if (!db) return false;
            return await new Promise((resolve) => {
                const tx = db.transaction(BG_STORE_NAME, 'readwrite');
                const store = tx.objectStore(BG_STORE_NAME);
                store.delete(id);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch (err) {
            console.warn('Lỗi xóa ảnh nền khỏi IndexedDB:', err);
            return false;
        }
    };

    const applyBgDisplayStyles = () => {
        const fit = localStorage.getItem(BG_KEY_FIT) || 'cover';
        const overlay = Math.max(0, Math.min(85, parseInt(localStorage.getItem(BG_KEY_OVERLAY) ?? '35', 10) || 0));
        const blur = Math.max(0, Math.min(16, parseInt(localStorage.getItem(BG_KEY_BLUR) ?? '0', 10) || 0));

        if (customBgImage) {
            if (fit === 'repeat') {
                customBgImage.style.backgroundSize = 'auto';
                customBgImage.style.backgroundRepeat = 'repeat';
            } else if (fit === 'contain') {
                customBgImage.style.backgroundSize = 'contain';
                customBgImage.style.backgroundRepeat = 'no-repeat';
            } else {
                customBgImage.style.backgroundSize = 'cover';
                customBgImage.style.backgroundRepeat = 'no-repeat';
            }
            customBgImage.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
        }

        if (customBgOverlay) {
            customBgOverlay.style.background = `rgba(0, 0, 0, ${(overlay / 100).toFixed(2)})`;
        }

        if (bgFitSelect) bgFitSelect.value = fit;
        if (bgOverlaySlider) bgOverlaySlider.value = String(overlay);
        if (bgOverlayBadge) bgOverlayBadge.textContent = `${overlay}%`;
        if (bgBlurSlider) bgBlurSlider.value = String(blur);
        if (bgBlurBadge) bgBlurBadge.textContent = `${blur}px`;
    };

    const updateSavedBgActiveUI = (activeId) => {
        if (!savedBgGrid) return;
        const items = savedBgGrid.querySelectorAll('.saved-bg-thumb-item');
        items.forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-bg-id') === activeId);
        });
    };

    const setActiveCustomBg = (url, label, activeToken) => {
        if (!customBgLayer || !customBgImage) return;

        if (!url || activeToken === 'none') {
            customBgLayer.classList.add('hidden');
            customBgImage.style.backgroundImage = '';
            if (bgPreviewWrap) bgPreviewWrap.classList.add('hidden');
            if (bgControlsGrid) bgControlsGrid.classList.add('hidden');
            localStorage.setItem(BG_KEY_ACTIVE, 'none');
            updateSavedBgActiveUI('');
            return;
        }

        customBgImage.style.backgroundImage = `url("${url.replace(/"/g, '\\"')}")`;
        customBgLayer.classList.remove('hidden');

        if (bgPreviewThumb) bgPreviewThumb.src = url;
        if (bgPreviewName) bgPreviewName.textContent = label || 'Ảnh nền tùy chỉnh';
        if (bgPreviewWrap) bgPreviewWrap.classList.remove('hidden');
        if (bgControlsGrid) bgControlsGrid.classList.remove('hidden');

        localStorage.setItem(BG_KEY_ACTIVE, activeToken);
        const activeId = activeToken.startsWith('idb:') ? activeToken.slice(4) : '';
        updateSavedBgActiveUI(activeId);
        applyBgDisplayStyles();
    };

    const renderSavedBgGrid = () => {
        if (!savedBgListWrap || !savedBgGrid) return;

        if (savedBgItems.length === 0) {
            savedBgListWrap.classList.add('hidden');
            savedBgGrid.innerHTML = '';
            return;
        }

        savedBgListWrap.classList.remove('hidden');
        savedBgGrid.innerHTML = '';

        const activeToken = localStorage.getItem(BG_KEY_ACTIVE) || 'none';
        const activeId = activeToken.startsWith('idb:') ? activeToken.slice(4) : '';

        savedBgItems.forEach(item => {
            const card = document.createElement('div');
            card.className = `saved-bg-thumb-item${item.id === activeId ? ' active' : ''}`;
            card.setAttribute('data-bg-id', item.id);
            card.title = item.name;

            const img = document.createElement('img');
            img.src = item.url;
            img.alt = item.name;
            card.appendChild(img);

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'saved-bg-delete-btn';
            delBtn.title = 'Xóa ảnh nền này';
            delBtn.textContent = '×';
            delBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await deleteBgFromDb(item.id);
                URL.revokeObjectURL(item.url);
                savedBgItems = savedBgItems.filter(x => x.id !== item.id);

                if (localStorage.getItem(BG_KEY_ACTIVE) === `idb:${item.id}`) {
                    setActiveCustomBg(null, '', 'none');
                }
                renderSavedBgGrid();
                showToast('🗑️ Đã xóa ảnh nền khỏi thư viện!');
            });
            card.appendChild(delBtn);

            card.addEventListener('click', () => {
                setActiveCustomBg(item.url, item.name, `idb:${item.id}`);
                if (window.tetAudio) {
                    window.tetAudio.init();
                    window.tetAudio.playLuckyChime();
                }
                showToast(`🖼️ Đã đổi ảnh nền: "${item.name}"`);
            });

            savedBgGrid.appendChild(card);
        });
    };

    // Event bindings for Custom Background
    if (bgUploadBtn && bgFileInput) {
        bgUploadBtn.addEventListener('click', () => bgFileInput.click());

        bgFileInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            bgFileInput.value = '';
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showToast('⚠️ Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP, GIF).');
                return;
            }
            if (file.size > 15 * 1024 * 1024) {
                showToast('⚠️ Ảnh quá lớn (tối đa 15MB). Vui lòng chọn ảnh nhẹ hơn.');
                return;
            }

            const id = `bg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            const cleanName = file.name.replace(/\.[^/.]+$/, '') || 'Ảnh nền Tết';
            const saved = await saveBgToDb(id, cleanName, file);
            const objUrl = URL.createObjectURL(file);

            if (saved) {
                savedBgItems.unshift({ id, name: cleanName, url: objUrl, createdAt: Date.now() });
                renderSavedBgGrid();
                setActiveCustomBg(objUrl, cleanName, `idb:${id}`);
            } else {
                setActiveCustomBg(objUrl, cleanName, 'none');
            }

            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
            showToast(`🖼️ Đã đổi ảnh nền thành "${cleanName}"!`);
        });
    }

    const applyBgFromUrlInput = () => {
        if (!bgUrlInput) return;
        const rawUrl = bgUrlInput.value.trim();
        if (!rawUrl) {
            showToast('⚠️ Vui lòng nhập đường dẫn (URL) hình ảnh.');
            return;
        }
        if (!/^https?:\/\/|^data:image\//i.test(rawUrl)) {
            showToast('⚠️ Đường dẫn ảnh phải bắt đầu bằng https:// hoặc http://');
            return;
        }

        const testImg = new Image();
        testImg.onload = () => {
            setActiveCustomBg(rawUrl, 'Ảnh nền từ liên kết URL', `url:${rawUrl}`);
            if (window.tetAudio) {
                window.tetAudio.init();
                window.tetAudio.playLuckyChime();
            }
            showToast('🖼️ Đã áp dụng ảnh nền từ liên kết URL!');
        };
        testImg.onerror = () => {
            showToast('❌ Không thể tải ảnh từ liên kết này. Vui lòng kiểm tra lại URL.');
        };
        testImg.src = rawUrl;
    };

    if (bgApplyUrlBtn) {
        bgApplyUrlBtn.addEventListener('click', applyBgFromUrlInput);
    }
    if (bgUrlInput) {
        bgUrlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyBgFromUrlInput();
            }
        });
    }

    const resetToDefaultBg = () => {
        setActiveCustomBg(null, '', 'none');
        if (bgUrlInput) bgUrlInput.value = '';
        if (window.tetAudio) {
            window.tetAudio.init();
            window.tetAudio.playLuckyChime();
        }
        showToast('↺ Đã khôi phục nền màu mặc định theo giao diện!');
    };

    if (bgResetBtn) bgResetBtn.addEventListener('click', resetToDefaultBg);
    if (bgClearActiveBtn) bgClearActiveBtn.addEventListener('click', resetToDefaultBg);

    if (bgFitSelect) {
        bgFitSelect.addEventListener('change', (e) => {
            localStorage.setItem(BG_KEY_FIT, e.target.value);
            applyBgDisplayStyles();
        });
    }

    if (bgOverlaySlider) {
        bgOverlaySlider.addEventListener('input', (e) => {
            localStorage.setItem(BG_KEY_OVERLAY, e.target.value);
            applyBgDisplayStyles();
        });
    }

    if (bgBlurSlider) {
        bgBlurSlider.addEventListener('input', (e) => {
            localStorage.setItem(BG_KEY_BLUR, e.target.value);
            applyBgDisplayStyles();
        });
    }

    // Initialize saved backgrounds on load
    (async () => {
        applyBgDisplayStyles();
        const records = await loadBgsFromDb();
        records.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        savedBgItems = records.map(r => ({
            id: r.id,
            name: r.name || 'Ảnh nền Tết',
            url: URL.createObjectURL(r.blob),
            createdAt: r.createdAt || 0
        }));
        renderSavedBgGrid();

        const activeToken = localStorage.getItem(BG_KEY_ACTIVE) || 'none';
        if (activeToken.startsWith('idb:')) {
            const id = activeToken.slice(4);
            const found = savedBgItems.find(item => item.id === id);
            if (found) {
                setActiveCustomBg(found.url, found.name, activeToken);
            } else {
                localStorage.setItem(BG_KEY_ACTIVE, 'none');
            }
        } else if (activeToken.startsWith('url:')) {
            const savedUrl = activeToken.slice(4);
            if (bgUrlInput) bgUrlInput.value = savedUrl;
            setActiveCustomBg(savedUrl, 'Ảnh nền từ liên kết URL', activeToken);
        }
    })();

    console.log("🌸 Tết Đinh Mùi 2027: Font chữ đồng bộ 100% & Trình phát nhạc MP3 sẵn sàng! 🌸");
});
