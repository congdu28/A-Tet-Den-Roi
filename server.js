const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Resource-Policy': 'same-origin'
};

function isAllowedPublicPath(relPath) {
    const normalized = relPath.split(path.sep).join('/');
    // Deny dotfiles (.git, .gitignore, .env) and server/config/markdown files
    if (normalized.split('/').some(seg => seg.startsWith('.'))) return false;
    if (normalized === 'index.html') return true;
    return (
        normalized.startsWith('css/') ||
        normalized.startsWith('js/') ||
        normalized.startsWith('assets/')
    ) && !normalized.endsWith('.md');
}

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('405 Method Not Allowed');
        return;
    }

    let decodedPath;
    try {
        const rawUrlPath = (req.url || '/').split('?')[0];
        decodedPath = decodeURIComponent(rawUrlPath);
    } catch {
        res.writeHead(400, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('400 Bad Request');
        return;
    }

    if (decodedPath.includes('\0')) {
        res.writeHead(400, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('400 Bad Request');
        return;
    }

    const relativeTarget = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
    const filePath = path.resolve(ROOT_DIR, relativeTarget);
    const relFromRoot = path.relative(ROOT_DIR, filePath);

    // Strict root confinement & public allowlist check
    if (
        !relFromRoot ||
        relFromRoot.startsWith('..') ||
        path.isAbsolute(relFromRoot) ||
        !isAllowedPublicPath(relFromRoot)
    ) {
        res.writeHead(403, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const cacheControl = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
        const baseHeaders = {
            ...SECURITY_HEADERS,
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Cache-Control': cacheControl
        };

        // Support bounds-checked HTTP Range requests for audio seeking
        const range = req.headers.range;
        if (range) {
            const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
            if (!match || (match[1] === '' && match[2] === '')) {
                res.writeHead(416, { ...SECURITY_HEADERS, 'Content-Range': `bytes */${stats.size}` });
                res.end();
                return;
            }

            let start = match[1] === '' ? 0 : parseInt(match[1], 10);
            let end = match[2] === '' ? stats.size - 1 : parseInt(match[2], 10);
            if (match[1] === '' && match[2] !== '') {
                const suffixLen = parseInt(match[2], 10);
                start = Math.max(0, stats.size - suffixLen);
                end = stats.size - 1;
            }

            if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end >= stats.size || start > end) {
                res.writeHead(416, { ...SECURITY_HEADERS, 'Content-Range': `bytes */${stats.size}` });
                res.end();
                return;
            }

            const chunksize = (end - start) + 1;
            res.writeHead(206, {
                ...baseHeaders,
                'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                'Content-Length': chunksize
            });
            if (req.method === 'HEAD') {
                res.end();
            } else {
                fs.createReadStream(filePath, { start, end }).pipe(res);
            }
        } else {
            res.writeHead(200, {
                ...baseHeaders,
                'Content-Length': stats.size
            });
            if (req.method === 'HEAD') {
                res.end();
            } else {
                fs.createReadStream(filePath).pipe(res);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`🌸 Server Tết 2027 đang chạy tại: http://localhost:${PORT}`);
});
