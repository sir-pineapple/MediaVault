const path = require('path');

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

module.exports = parseFileName;