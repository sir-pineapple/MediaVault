const path = require('path');

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.mp4') return 'video/mp4';
    if (ext === '.mkv') return 'video/x-matroska';
    if (ext === '.avi') return 'video/x-msvideo';

    return 'application/octet-stream';
}

module.exports = getContentType;