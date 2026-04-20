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

        const showResult = await db.query(
            `INSERT INTO media_files (file_path, parsed_title, parsed_year, parsed_season, parsed_episode)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (file_path) DO NOTHING
            RETURNING *`,
            [
                filePath,
                parsed.title || null,
                parsed.year || null,
                parsed.season || null,
                parsed.episode || null
            ]
        );

        if (showResult.rowCount > 0) {
            console.log("Added:", filePath);
            const media = showResult.rows[0];
            await linkMedia(media);
        }
    }
    catch (err) {
        console.error("Error:", filePath, err.message);
    }
}

async function linkMedia(media) {
    if (media.parsed_season && media.parsed_episode) {
        await handleTV(media);
    }
    else {
        await handleMovie(media);
    }
}

async function handleMovie(media) {
    let showRes = await db.query(
        `SELECT * FROM movies
        WHERE parsed_title = $1 AND parsed_year = $2`,
        [media.parsed_title, media.parsed_year]
    );

    let movie;

    if (showRes.rowCount === 0) {
        const insert  = await db.query(
            `INSERT INTO movies (parsed_title, parsed_year)
            VALUES ($1, $2)
            RETURNING *`,
            [media.parsed_title, media.parsed_year]
        );

        movie = insert.rows[0];
        console.log("Created movie:", movie.parsed_title);
    }
    else {
        movie = showRes.rows[0];
    }

    await db.query(
        `UPDATE media_files SET movie_id = $1 WHERE id = $2`,
        [movie.id, media.id]
    );
}

async function handleTV(media) {
    let showRes = await db.query(
        `SELECT * FROM tv_shows WHERE parsed_title = $1`,
        [media.parsed_title]
    );

    let show;

    if (showRes.rowCount === 0) {
        const insert = await db.query(
            `INSERT INTO tv_shows (parsed_title)
            VALUES ($1)
            RETURNING *`,
            [media.parsed_title]
        );

        show = insert.rows[0];
        console.log("Created show:", show.parsed_title);
    }
    else {
        show = showRes.rows[0];
    }

    let seasonRes = await db.query(
        `SELECT * FROM seasons
        WHERE show_id = $1 and season_number = $2`,
        [show.id, media.parsed_season]
    );

    let season;

    if (seasonRes.rowCount === 0) {
        const insert = await db.query(
            `INSERT INTO seasons (show_id, season_number)
            VALUES ($1, $2)
            RETURNING *`,
            [show.id, media.parsed_season]
        );

        season = insert.rows[0];
    }
    else {
        season = seasonRes.rows[0];
    }

    let epRes = await db.query(
        `SELECT * FROM episodes
        WHERE season_id = $1 and episode_number = $2`,
        [season.id, media.parsed_episode]
    );

    let episode;

    if (epRes.rowCount === 0) {
        const insert = await db.query(
            `INSERT INTO episodes (season_id, episode_number, parsed_title)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [season.id, media.parsed_episode, media.parsed_title]
        );

        episode = insert.rows[0];
    }
    else {
        episode = epRes.rows[0];
    }

    await db.query(
        `UPDATE media_files SET episode_id = $1 WHERE id = $2`,
        [episode.id, media.id]
    );
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