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

async function fetchShowMetadata(title) {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&type=series&apikey=${OMDB_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
        return null;
    }
    return data;
}

module.exports = { fetchMovieMetadata, fetchShowMetadata };