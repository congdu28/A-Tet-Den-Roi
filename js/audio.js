/**
 * Advanced Multi-Song Tet Audio Engine (Web Audio API & Custom MP3 Player)
 * Supports synthesized offline melody loops AND custom user MP3 audio files with vocals!
 */
class TetAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.bgmGain = null;
        this.currentSongIndex = 0;
        this.volume = 0.6;

        // Custom HTML5 Audio element for user-uploaded MP3 songs (Có lời)
        this.customAudio = new Audio();
        this.customAudio.preload = 'metadata';
        this.customAudio.loop = false;
        this.customAudio.volume = this.volume;
        this.isCustomTrack = false;
        this.customTrackName = '';

        this.onPlaylistChange = null;
        this.onSongChange = null;

        // Auto-advance to next song in playlist when finished
        this.customAudio.addEventListener('ended', () => {
            this.nextSong();
            if (typeof this.onSongChange === 'function') {
                this.onSongChange(this.playlist[this.currentSongIndex]);
            }
        });

        // 3 default songs with vocals (Nhạc Tết tuyển chọn có lời)
        this.playlist = [
            {
                id: 'tam-biet-nam-cu-qua',
                name: 'Tạm Biệt Năm Cũ Qua',
                artist: 'DuUyên ft Nguyễn Thương',
                type: 'mp3',
                url: 'assets/audio/tam-biet-nam-cu-qua.mp3',
                isDefault: true
            },
            {
                id: 'tet-nay-con-se-ve',
                name: 'Tết Này Con Sẽ Về (Lofi Ver.)',
                artist: 'Bùi Công Nam x Ness',
                type: 'mp3',
                url: 'assets/audio/tet-nay-con-se-ve.mp3',
                isDefault: true
            },
            {
                id: 'di-de-tro-ve-2',
                name: 'Đi Để Trở Về 2 - Chuyến Đi Của Năm',
                artist: 'Soobin Hoàng Sơn',
                type: 'mp3',
                url: 'assets/audio/di-de-tro-ve-2.mp3',
                isDefault: true
            }
        ];

        // Load saved user songs from IndexedDB
        this.loadSavedCustomSongs();
    }

    init() {
        if (!this.ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.ctx.destination);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.9;
            this.sfxGain.connect(this.masterGain);

            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = 0.45;
            this.bgmGain.connect(this.masterGain);
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && !this.isMuted) {
            this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
        }
        if (this.customAudio) {
            this.customAudio.volume = this.isMuted ? 0 : this.volume;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
        }
        if (this.customAudio) {
            this.customAudio.muted = this.isMuted;
        }
        return this.isMuted;
    }

    // ==========================================
    // INDEXEDDB PERSISTENCE FOR USER UPLOADED SONGS
    // ==========================================
    async openDB() {
        if (typeof window === 'undefined' || !window.indexedDB) return null;
        return new Promise((resolve) => {
            const req = indexedDB.open('Tet2027_Audio_DB', 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('custom_songs')) {
                    db.createObjectStore('custom_songs', { keyPath: 'id' });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    }

    async saveSongToDB(songItem) {
        try {
            const db = await this.openDB();
            if (!db) return false;
            return new Promise((resolve) => {
                const tx = db.transaction('custom_songs', 'readwrite');
                const store = tx.objectStore('custom_songs');
                store.put({
                    id: songItem.id,
                    name: songItem.name,
                    artist: songItem.artist,
                    blob: songItem.blob,
                    addedAt: songItem.addedAt || Date.now()
                });
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch (e) {
            console.warn('Lỗi lưu bài hát vào IndexedDB:', e);
            return false;
        }
    }

    async getAllSongsFromDB() {
        try {
            const db = await this.openDB();
            if (!db) return [];
            return new Promise((resolve) => {
                const tx = db.transaction('custom_songs', 'readonly');
                const store = tx.objectStore('custom_songs');
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            });
        } catch (e) {
            return [];
        }
    }

    async deleteSongFromDB(id) {
        try {
            const db = await this.openDB();
            if (!db) return false;
            return new Promise((resolve) => {
                const tx = db.transaction('custom_songs', 'readwrite');
                const store = tx.objectStore('custom_songs');
                store.delete(id);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch (e) {
            return false;
        }
    }

    async loadSavedCustomSongs() {
        if (typeof window === 'undefined' || !window.indexedDB) return;
        try {
            const saved = await this.getAllSongsFromDB();
            if (Array.isArray(saved) && saved.length > 0) {
                let hasAdded = false;
                saved.forEach(item => {
                    const itemName = (item.name || '').toLowerCase();
                    // Prevent duplicate if this song is already in the default playlist
                    const isAlreadyDefault = this.playlist.some(p => {
                        const pName = p.name.toLowerCase();
                        return itemName.includes(pName) || pName.includes(itemName);
                    });
                    if (isAlreadyDefault) return;

                    try {
                        const url = URL.createObjectURL(item.blob);
                        this.playlist.push({
                            id: item.id,
                            name: item.name,
                            artist: item.artist || 'Nhạc có lời của bạn',
                            type: 'custom',
                            url: url,
                            blob: item.blob,
                            addedAt: item.addedAt || Date.now()
                        });
                        hasAdded = true;
                    } catch (err) {
                        console.warn('Lỗi khôi phục bài hát từ blob:', err);
                    }
                });
                if (hasAdded && typeof this.onPlaylistChange === 'function') {
                    this.onPlaylistChange(this.playlist);
                }
            }
        } catch (err) {
            console.warn('Lỗi tải danh sách bài hát đã lưu:', err);
        }
    }

    // ==========================================
    // CUSTOM MP3 VOCAL AUDIO (NHẠC CÓ LỜI DO NGƯỜI DÙNG ĐƯA VÀO)
    // ==========================================
    async addUserAudioFile(file, autoPlay = true) {
        if (!file) return null;
        this.init();

        const songId = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const songName = file.name.replace(/\.[^/.]+$/, "");
        const songUrl = URL.createObjectURL(file);

        const songItem = {
            id: songId,
            name: songName,
            artist: 'Nhạc có lời của bạn',
            type: 'custom',
            url: songUrl,
            blob: file,
            addedAt: Date.now()
        };

        // Append to playlist
        this.playlist.push(songItem);

        // Persist to browser IndexedDB
        await this.saveSongToDB(songItem);

        // Notify UI to re-render dropdown & custom song list
        if (typeof this.onPlaylistChange === 'function') {
            this.onPlaylistChange(this.playlist);
        }

        // Auto select newly uploaded song
        const newIndex = this.playlist.length - 1;
        this.selectSong(newIndex);

        if (autoPlay) {
            this.startBGM();
        }

        return songItem;
    }

    loadUserAudioFile(file) {
        return this.addUserAudioFile(file, true);
    }

    async removeCustomSong(id) {
        const idx = this.playlist.findIndex(s => s.id === id);
        if (idx === -1) return false;

        const song = this.playlist[idx];
        if (song.isDefault) {
            console.warn('Không thể xóa bài hát mặc định của hệ thống.');
            return false;
        }

        if (song.url && song.type === 'custom') {
            try { URL.revokeObjectURL(song.url); } catch (e) {}
        }

        const wasCurrent = (this.currentSongIndex === idx);
        const wasPlaying = this.bgmPlaying;

        if (wasCurrent) {
            this.stopBGM();
        }

        this.playlist.splice(idx, 1);
        await this.deleteSongFromDB(id);

        if (this.currentSongIndex >= this.playlist.length) {
            this.currentSongIndex = Math.max(0, this.playlist.length - 1);
        }

        if (typeof this.onPlaylistChange === 'function') {
            this.onPlaylistChange(this.playlist);
        }

        if (wasCurrent && wasPlaying && this.playlist.length > 0) {
            this.selectSong(this.currentSongIndex);
            this.startBGM();
        }

        return true;
    }

    playCustomAudio() {
        this.isCustomTrack = true;
        this.bgmPlaying = true;
        if (this.customAudio) {
            this.customAudio.volume = this.isMuted ? 0 : this.volume;
            return this.customAudio.play().then(() => {
                return true;
            }).catch(err => {
                console.warn("Lỗi phát audio:", err);
                return false;
            });
        }
        return Promise.resolve(false);
    }

    pauseCustomAudio() {
        this.bgmPlaying = false;
        if (this.customAudio) {
            this.customAudio.pause();
        }
    }

    stopAudioPlayback() {
        if (this.customAudio) {
            this.customAudio.pause();
        }
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    // ==========================================
    // SOUND EFFECTS (Web Audio API)
    // ==========================================
    playFireworkExplode() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        const boomOsc = this.ctx.createOscillator();
        const boomGain = this.ctx.createGain();
        boomOsc.type = 'triangle';
        boomOsc.frequency.setValueAtTime(140, now);
        boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

        boomGain.gain.setValueAtTime(0.7, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        boomOsc.connect(boomGain);
        boomGain.connect(this.sfxGain);

        boomOsc.start(now);
        boomOsc.stop(now + 0.4);

        const bufferSize = Math.floor(this.ctx.sampleRate * 0.3);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 0.3);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.45, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.sfxGain);

        whiteNoise.start(now);
        whiteNoise.stop(now + 0.32);
    }

    playFireworkLaunch() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1050, now + 0.35);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.36);
    }

    playLuckyChime() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [1046.50, 1318.51, 1567.98, 2093.00];

        notes.forEach((freq, idx) => {
            const startTime = now + idx * 0.05;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.18, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(startTime);
            osc.stop(startTime + 0.52);
        });
    }

    playBambooShake() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Âm thanh lắc ống xăm tre tự nhiên: chuỗi va chạm lách cách sống động
        const totalClicks = 16;
        for (let i = 0; i < totalClicks; i++) {
            const time = now + i * 0.052 + (Math.random() * 0.015);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = Math.random() > 0.4 ? 'square' : 'triangle';
            // Tần số vang đặc trưng của thanh tre dày rỗng
            osc.frequency.setValueAtTime(450 + Math.random() * 280, time);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(750 + Math.random() * 250, time);
            filter.Q.value = 6;

            const clickGain = 0.22 + Math.random() * 0.12;
            gain.gain.setValueAtTime(clickGain, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(time);
            osc.stop(time + 0.05);
        }
    }

    playLionDrum(type = 'tung') {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        if (type === 'tung') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(170, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

            gain.gain.setValueAtTime(0.85, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now);
            osc.stop(now + 0.32);
        } else if (type === 'cac') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(780, now);

            gain.gain.setValueAtTime(0.55, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'cheng') {
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const highpass = this.ctx.createBiquadFilter();
            highpass.type = 'highpass';
            highpass.frequency.setValueAtTime(4500, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            noise.connect(highpass);
            highpass.connect(gain);
            gain.connect(this.sfxGain);

            noise.start(now);
            noise.stop(now + 0.37);
        }
    }

    // ==========================================
    // UNIFIED PLAYLIST CONTROLS (SYNTH & CUSTOM SONGS)
    // ==========================================
    selectSong(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentSongIndex = index;
            const song = this.playlist[index];
            const wasPlaying = this.bgmPlaying;

            this.stopAudioPlayback();

            if (song.url) {
                this.isCustomTrack = true;
                this.customTrackName = song.name;
                if (this.customAudio) {
                    this.customAudio.src = song.url;
                    this.customAudio.volume = this.isMuted ? 0 : this.volume;
                }
                if (wasPlaying) {
                    this.playCustomAudio();
                }
            } else {
                this.isCustomTrack = false;
                this.customTrackName = '';
                if (wasPlaying) {
                    this.startBGM();
                }
            }
        }
        return this.playlist[this.currentSongIndex];
    }

    nextSong() {
        if (this.playlist.length === 0) return null;
        const wasPlaying = this.bgmPlaying;
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.stopAudioPlayback();

        const song = this.playlist[this.currentSongIndex];
        if (song.url) {
            this.isCustomTrack = true;
            this.customTrackName = song.name;
            if (this.customAudio) {
                this.customAudio.src = song.url;
                this.customAudio.volume = this.isMuted ? 0 : this.volume;
            }
        } else {
            this.isCustomTrack = false;
            this.customTrackName = '';
        }

        if (wasPlaying) {
            this.startBGM();
        }
        return this.playlist[this.currentSongIndex];
    }

    prevSong() {
        if (this.playlist.length === 0) return null;
        const wasPlaying = this.bgmPlaying;
        this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
        this.stopAudioPlayback();

        const song = this.playlist[this.currentSongIndex];
        if (song.url) {
            this.isCustomTrack = true;
            this.customTrackName = song.name;
            if (this.customAudio) {
                this.customAudio.src = song.url;
                this.customAudio.volume = this.isMuted ? 0 : this.volume;
            }
        } else {
            this.isCustomTrack = false;
            this.customTrackName = '';
        }

        if (wasPlaying) {
            this.startBGM();
        }
        return this.playlist[this.currentSongIndex];
    }

    toggleBGM() {
        if (this.bgmPlaying) {
            this.stopBGM();
            return false;
        } else {
            this.startBGM();
            return true;
        }
    }

    startBGM() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const song = this.playlist[this.currentSongIndex];
        if (!song) return;

        if (song.url) {
            this.isCustomTrack = true;
            this.customTrackName = song.name;
            if (this.customAudio) {
                const currentSrc = this.customAudio.getAttribute('src') || this.customAudio.src;
                if (!currentSrc || !currentSrc.includes(song.url)) {
                    this.customAudio.src = song.url;
                }
            }
            this.playCustomAudio();
        } else {
            this.isCustomTrack = false;
            this.customTrackName = '';
            if (this.customAudio) {
                this.customAudio.pause();
            }
            if (this.bgmPlaying && this.bgmTimer) return;
            this.bgmPlaying = true;
            this.scheduleMelodyLoop();
        }
    }

    stopBGM() {
        this.bgmPlaying = false;
        this.stopAudioPlayback();
    }

    scheduleMelodyLoop() {
        if (!this.bgmPlaying || this.isCustomTrack) return;

        const currentSong = this.playlist[this.currentSongIndex];
        const melody = currentSong.melody;
        let totalTime = 0;
        const now = this.ctx.currentTime + 0.05;

        melody.forEach(item => {
            const startTime = now + totalTime;
            this.playSynthNote(item.f, startTime, item.d * 0.92);

            if (item.f > 0 && totalTime % 0.8 < 0.1) {
                this.playBassNote(item.f * 0.5, startTime, 0.35);
            }

            totalTime += item.d + 0.04;
        });

        this.bgmTimer = setTimeout(() => {
            if (this.bgmPlaying && !this.isCustomTrack) {
                this.scheduleMelodyLoop();
            }
        }, totalTime * 1000);
    }

    playSynthNote(freq, startTime, duration) {
        if (!this.ctx || this.isMuted || freq <= 0) return;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.16, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + duration + 0.03);
        osc2.stop(startTime + duration + 0.03);
    }

    playBassNote(freq, startTime, duration) {
        if (!this.ctx || this.isMuted || freq <= 0) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.07, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
    }

    getMelodyNgayTetQueEm() {
        const C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392.00, A4 = 440.00;
        const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880.00;

        return [
            { f: G4, d: 0.2 }, { f: G4, d: 0.2 }, { f: A4, d: 0.2 }, { f: C5, d: 0.2 },
            { f: D5, d: 0.4 }, { f: C5, d: 0.4 },
            { f: G4, d: 0.2 }, { f: G4, d: 0.2 }, { f: A4, d: 0.2 }, { f: C5, d: 0.2 },
            { f: E5, d: 0.4 }, { f: D5, d: 0.4 },
            { f: G4, d: 0.2 }, { f: G4, d: 0.2 }, { f: A4, d: 0.2 }, { f: C5, d: 0.2 },
            { f: D5, d: 0.4 }, { f: C5, d: 0.3 }, { f: A4, d: 0.2 },
            { f: G4, d: 0.3 }, { f: A4, d: 0.3 }, { f: C5, d: 0.3 }, { f: D5, d: 0.3 },
            { f: C5, d: 0.6 },
            { f: E5, d: 0.25 }, { f: E5, d: 0.25 }, { f: D5, d: 0.25 }, { f: C5, d: 0.25 },
            { f: A4, d: 0.3 }, { f: C5, d: 0.5 },
            { f: D5, d: 0.25 }, { f: D5, d: 0.25 }, { f: C5, d: 0.25 }, { f: A4, d: 0.25 },
            { f: G4, d: 0.3 }, { f: A4, d: 0.5 },
            { f: C5, d: 0.25 }, { f: C5, d: 0.25 }, { f: D5, d: 0.25 }, { f: E5, d: 0.25 },
            { f: G5, d: 0.3 }, { f: E5, d: 0.4 },
            { f: D5, d: 0.25 }, { f: C5, d: 0.25 }, { f: A4, d: 0.25 }, { f: D5, d: 0.35 },
            { f: C5, d: 0.7 }
        ];
    }

    getMelodyMuaXuanOi() {
        const C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392.00, A4 = 440.00;
        const C5 = 523.25, D5 = 587.33, E5 = 659.25;

        return [
            { f: G4, d: 0.3 }, { f: G4, d: 0.3 }, { f: E4, d: 0.3 }, { f: G4, d: 0.5 },
            { f: A4, d: 0.3 }, { f: C5, d: 0.3 }, { f: A4, d: 0.3 }, { f: G4, d: 0.6 },
            { f: C5, d: 0.3 }, { f: D5, d: 0.3 }, { f: E5, d: 0.3 }, { f: D5, d: 0.4 },
            { f: C5, d: 0.3 }, { f: A4, d: 0.3 }, { f: C5, d: 0.6 },
            { f: G4, d: 0.3 }, { f: G4, d: 0.3 }, { f: E4, d: 0.3 }, { f: G4, d: 0.5 },
            { f: A4, d: 0.3 }, { f: C5, d: 0.3 }, { f: A4, d: 0.3 }, { f: G4, d: 0.6 },
            { f: E5, d: 0.3 }, { f: D5, d: 0.3 }, { f: C5, d: 0.3 }, { f: A4, d: 0.3 },
            { f: G4, d: 0.3 }, { f: A4, d: 0.3 }, { f: C5, d: 0.7 }
        ];
    }

    getMelodyDiepKhucMuaXuan() {
        const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00;
        const B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25;

        return [
            { f: C4, d: 0.25 }, { f: E4, d: 0.25 }, { f: G4, d: 0.3 }, { f: G4, d: 0.4 },
            { f: A4, d: 0.25 }, { f: G4, d: 0.25 }, { f: E4, d: 0.4 },
            { f: D4, d: 0.25 }, { f: E4, d: 0.25 }, { f: G4, d: 0.3 }, { f: A4, d: 0.4 },
            { f: C5, d: 0.3 }, { f: B4, d: 0.25 }, { f: A4, d: 0.25 }, { f: G4, d: 0.5 },
            { f: C5, d: 0.3 }, { f: C5, d: 0.3 }, { f: B4, d: 0.25 }, { f: A4, d: 0.25 },
            { f: G4, d: 0.3 }, { f: E4, d: 0.3 }, { f: D4, d: 0.5 },
            { f: C4, d: 0.25 }, { f: E4, d: 0.25 }, { f: G4, d: 0.3 }, { f: D4, d: 0.3 },
            { f: C4, d: 0.7 }
        ];
    }

    getMelodyHappyNewYear() {
        const F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16;
        const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46;

        return [
            { f: A4, d: 0.35 }, { f: Bb4, d: 0.35 }, { f: C5, d: 0.45 },
            { f: C5, d: 0.35 }, { f: Bb4, d: 0.35 }, { f: A4, d: 0.45 },
            { f: G4, d: 0.35 }, { f: A4, d: 0.35 }, { f: Bb4, d: 0.45 },
            { f: A4, d: 0.35 }, { f: G4, d: 0.35 }, { f: F4, d: 0.6 },
            { f: F5, d: 0.45 }, { f: E5, d: 0.35 }, { f: D5, d: 0.4 }, { f: C5, d: 0.6 },
            { f: D5, d: 0.4 }, { f: C5, d: 0.35 }, { f: Bb4, d: 0.35 }, { f: A4, d: 0.6 },
            { f: Bb4, d: 0.35 }, { f: C5, d: 0.35 }, { f: D5, d: 0.4 }, { f: G4, d: 0.5 },
            { f: C5, d: 0.35 }, { f: Bb4, d: 0.35 }, { f: A4, d: 0.35 }, { f: G4, d: 0.35 },
            { f: F4, d: 0.8 }
        ];
    }
}

window.tetAudio = new TetAudioEngine();
