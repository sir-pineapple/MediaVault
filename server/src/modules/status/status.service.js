const fs = require('fs');
const path = require('path');

const db = require('../../config/db');

async function getStatus() {
    let database = false;
    let mediaDirectory = false;

    try {
        await db.query('SELECT 1');
        database = true;
    }
    catch (err) {
        databse = false;
    }

    try {
        mediaDirectory = fs.existsSync(path.join(__dirname, "..", "..", "..", "..", "media_dir"));
    }
    catch (err) {
        mediaDirectory = false;
    }

    const packageJson = require(path.join(process.cwd(), 'package.json'));

    return {
        status: database && mediaDirectory ? 'ok' : 'degraded',
        database,
        mediaDirectory,

        version: packageJson.version
    };
}

module.exports = { getStatus };