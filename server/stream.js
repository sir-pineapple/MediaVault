const fs = require('fs');
const path = require('path');

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.mp4') return 'video/mp4';
    if (ext === '.mkv') return 'video/x-matroska';
    if (ext === '.avi') return 'video/x-msvideo';

    return 'application/octet-stream';
}

function streamVideo(filePath, req, res) {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-type': getContentType(filePath),
        });

        fs.createReadStream(filePath).pipe(res);
        return;
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = (end - start) + 1;

    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': `bytes`,
        'Content-Length': chunkSize,
        'Content-Type': getContentType(filePath),
    });

    file.pipe(res);
}

module.exports = { streamVideo };