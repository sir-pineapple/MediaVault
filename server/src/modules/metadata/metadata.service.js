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
                    metadata_fetched = TRUE
                WHERE id = $5
            `, [
                data.Title,
                data.Year,
                data.imdbId,
                data.Poster,
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
                    metadata_found = TRUE
                WHERE id = $4
            `, [
                data.Title,
                data.imdbId,
                data.Poster,
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