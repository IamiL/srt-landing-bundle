const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3002;

http.createServer((req, res) => {
    const serveFile = (filePath, contentType, responseCode = 200) => {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Error');
            } else {
                res.writeHead(responseCode, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    };

    const mimeTypes = {
        '.html': 'text/html',
        '.txt': 'text/plain',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.manifest': 'application/manifest+json',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf'
    };

    const requestedUrl = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, requestedUrl);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    if (requestedUrl === '/en') {
        serveFile(path.join(__dirname, 'en.html'), 'text/html');
    } else {
        fs.exists(filePath, (exists) => {
            if (exists) {
                serveFile(filePath, contentType);
            } else {
                serveFile(path.join(__dirname, '404.html'), 'text/html', 404);
            }
        });
    }
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});