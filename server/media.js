const db = require('./db');

async function getMovies() {
    const res = await db.query(`
        SELECT
            m.id,
            COALESCE(m.title, m.parsed_title) AS title,
            COALESCE(m.year, m.parsed_year) AS year,
            m.poster_url,
            m.imdb_id,
            mf.id AS file_id,
            mf.file_path
        FROM movies m
        JOIN media_files mf ON mf.movie_id = m.id
    `);

    return res.rows.map(row =>({
        id: row.id,
        title: row.title,
        year: row.year,
        poster: row.poster_url,
        imdbID: row.imdb_id,
        file: {
            id: row.file_id,
            path: row.file_path
        }
    }));
}

async function getShows() {
    const res = await db.query(`
        SELECT
            s.id AS show_id,
            COALESCE(s.title, s.parsed_title) AS show_title,
            s.poster_url,
            s.imdb_id,

            se.season_number,
            e.id AS episode_id,
            e.episode_number,

            mf.id AS file_id,
            mf.file_path
        
        FROM tv_shows s
        JOIN seasons se ON se.show_id = s.id
        JOIN episodes e ON e.season_id = se.id
        JOIN media_files mf ON mf.episode_id = e.id

        ORDER BY s.id, se.season_number, e.episode_number
    `);

    const showsMap = {};
    for (const row of res.rows) {
        if (!showsMap[row.show_id]) {
            showsMap[row.show_id] = {
                id: row.show_id,
                title: row.show_title,
                poster: row.poster_url,
                imdbID: row.imdb_id,
                seasons: {}
            };
        }

        const show = showsMap[row.show_id];

        if (!show.seasons[row.season_number]) {
            show.seasons[row.season_number] = {
                season: row.season_number,
                episodes: []
            };
        }

        show.seasons[row.season_number].episodes.push({
            id: row.episode_id,
            episode: row.episode_number,
            file: {
                id: row.file_id,
                path: row.file_path
            }
        });
    }

    return Object.values(showsMap).map(show => ({
        id: show.id,
        title: show.title,
        poster: show.poster,
        imdbID: show.imdbID,
        seasons: Object.values(show.seasons)
    }));
}

module.exports = { getMovies, getShows };