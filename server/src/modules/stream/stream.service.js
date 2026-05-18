const fs = require('fs');

const db = require('../../config/db');
const getContentType = require('../../utils/contentType');

async function streamById(fileId, req, res) {
    const result = await db.query(
        `
        SELECT file_path
        FROM media_files
        WHERE id = $1
        `,
        [fileId]
    );
    if (result.rowCount === 0) {
        return res.status(404).send('File not found');
    }

    const filePath = result.rows[0].file_path;
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

module.exports = { streamById };