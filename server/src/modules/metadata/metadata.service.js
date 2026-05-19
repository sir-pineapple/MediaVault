const db = require('../../config/db');
const { fetchMovieMetadata, fetchShowMetadata } = require('./omdb.client');
const parallelProcessing = require('../../utils/parallelProcessor');

async function enrichMovies() {
    const res = await db.query(`SELECT * FROM movies WHERE metadata_fetched = FALSE`);

    await parallelProcessing(res.rows, 5, async movie => {
        const data = await fetchMovieMetadata(movie.parsed_title, movie.parsed_year);
        if (!data) {
            console.log('No metadata:', movie.parsed_title);
            return;
        }

        await db.query(
            `
                UPDATE movies
                SET title = $1,
                    year = $2,
                    imdb_id = $3,
                    poster_url = $4,
                    genre = $5,
                    runtime = $6,
                    plot = $7,
                    metadata_fetched = TRUE
                WHERE id = $8
            `, [
                data.Title,
                data.Year,
                data.imdbID,
                data.Poster,
                data.Genre,
                data.Runtime,
                data.Plot,
                movie.id
            ]
        );

        console.log('Updated movie:', data.Title);
    });
}

async function enrichShows() {
    const res = await db.query(
        `SELECT * FROM tv_shows WHERE metadata_fetched = FALSE`
    );
    
    await parallelProcessing(res.rows, 5, async show => {
        const data = await fetchShowMetadata(show.parsed_title);
        if (!data) {
            console.log('No metadata:', show.parsed_title);
            return;
        }
        await db.query(
            `
                UPDATE tv_shows
                SET title = $1,
                    imdb_id = $2,
                    poster_url = $3,
                    genre = $4,
                    plot = $5,
                    total_seasons = $6,
                    year = $7,
                    metadata_fetched = TRUE
                WHERE id = $8
            `, [
                data.Title,
                data.imdbID,
                data.Poster,
                data.Genre,
                data.Plot,
                data.totalSeasons,
                data.Year,
                show.id
            ]
        );

        console.log('Updated show:', data.Title);
    });
}

async function runMetadataEnrichment() {
    console.log("Fetching metadata...");

    await enrichMovies();
    await enrichShows();

    console.log("Metadata update complete");
}

module.exports = { runMetadataEnrichment };