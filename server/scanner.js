const fs = require('fs').promises;
const path = require('path');
const db = require('./db');

const MEDIA_DIR = path.join(__dirname, '..', 'media');

function parseFileName(filename) {
    const name = path.basename(filename).replace(/\.[^/.]+$/, "");

    const tvMatch = name.match(/(.+)[. ]S(\d{1,2})E(\d{1,2})/i);
    if (tvMatch) {
        return {
            title:tvMatch[1].replace(/\./g, " ").trim(),
            season: parseInt(tvMatch[2]),
            episode: parseInt(tvMatch[3])
        };
    }

    const movieMatch = name.match(/(.+)[. ]\(?(\d{4})\)?/);
    if (movieMatch) {
        return {
            title: movieMatch[1].replace(/\./g, " ").trim(),
            year: parseInt(movieMatch[2])
        };
    }

    return { title: name };
}

async function processFile(filePath) {
    try {
        const parsed = parseFileName(filePath);

        const result = await db.query(
            `INSERT INTO media_files (file_path, parsed_title, parsed_year, parsed_season, parsed_episode)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (file_path) DO NOTHING`,
            [
                filePath,
                parsed.title || null,
                parsed.year || null,
                parsed.season || null,
                parsed.episode || null
            ]
        );

        if (result.rowCount > 0) {
            console.log("Added:", filePath);
        }
    }
    catch (err) {
        console.error("Error:", filePath, err.message);
    }
}

async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await scanDirectory(fullPath);
        }
        else {
            await processFile(fullPath);
        }
    }
}

async function runScan() {
    console.log("Scanning media folder...");
    await scanDirectory(MEDIA_DIR);
    console.log("Scan complete");
}

module.exports = { runScan };