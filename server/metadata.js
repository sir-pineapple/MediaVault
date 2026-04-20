require('dotenv').config();

const OMDB_KEY = process.env.OMDB_API_KEY;

async function fetchMovieMetadata(title, year) {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year || ''}&apikey=${OMDB_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
        return null;
    }
    return data;
}

const db = require('./db');

async function encrichMovies() {
    const res = await db.query(
        `SELECT * FROM movies WHERE metadata_fetched = FALSE`
    );

    for (const movie of res.rows) {
        const data = await fetchMovieMetadata(movie.parsed_title, movie.parsed_year);

        if (!data) {
            console.log("No metadata:", movie.parsed_title);
            continue;
        }

        await db.query(
            `UPDATE movies
            SET title = $1,
                year = $2,
                imdb_id = $3,
                poster_url = $4,
                metadata_fetched = TRUE
            WHERE id = $5`,
            [
                data.Title,
                data.Year,
                data.imdbID,
                data.Poster,
                movie.id
            ]
        );

        console.log("Updated movie:", data.Title);
    }
}

async function fetchShowMetadata(title) {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&type=series&apikey=${OMDB_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
        return null;
    }
    return data;
}

async function enrichShows() {
    const res = await db.query(
        `SELECT * FROM tv_shows WHERE metadata_fetched = FALSE`
    );

    for (const show of res.rows) {
        const data = await fetchShowMetadata(show.parsed_title);

        if (!data) {
            console.log("No metadata:", show.parsed_title);
            continue;
        }

        await db.query(
            `UPDATE tv_shows
            SET title = $1.
                imdb_id = $2,
                poster_url = $3,
                metadata_fetched = TRUE
            WHERE id = $4`,
            [
                data.Title,
                data.imdbID,
                data.Poster,
                show.id
            ]
        );

        console.log("Updated show:", data.Title);
    }
}


async function runMetadataEnrichment() {
    console.log("Fetching metadata...");

    await encrichMovies();
    await enrichShows();

    console.log("Metadata update complete");
}

module.exports = { runMetadataEnrichment };