const path = require("path");

const filenameParser = (filename) => {
    const originalName = path.parse(filename).name;

    let name = originalName.replace(/[._]/g, " ");

    const episodeMatch = name.match(/\b[sS](\d{1,2})[eE](\d{1,2})\b/);
    const season = episodeMatch ? parseInt(episodeMatch[1], 10) : null;
    const episode = episodeMatch ? parseInt(episodeMatch[2], 10) : null;

    const yearMatch = name.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? yearMatch[0] : null;

    name = name
        .replace(/\b[sS](\d{1,2})[eE](\d{1,2})\b/g, "")
        .replace(/\b(19|20)\d{2}\b/g, "");
    
    const junkPatterns = [
        /\b\d{3,4}p\b/gi,
        /\bx264\b/gi,
        /\bx265\b/gi,
        /\bbluray\b/gi,
        /\bweb[- ]?dl\b/gi,
        /\bwebrip\b/gi,
        /\bhdr\b/gi,
        /\bremastered\b/gi,
        /\bdvdrip\b/gi,
        /\bhd\b/gi,
        /\buhd\b/gi,
    ];

    junkPatterns.forEach((pattern) => {
        name = name.replace(pattern, "");
    });

    const title = name.replace(/\s+/g, " ").trim();
    const type = season && episode ? "episode" : "movie";

    return {
        title,
        year,
        season,
        episode,
        type,
    };
};

module.exports = filenameParser;