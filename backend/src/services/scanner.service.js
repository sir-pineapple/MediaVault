const fs = require("fs");
const path = require("path");

const Media = require("../models/Media");
const filenameParser = require("../utils/filenameParser");

const VIDEO_EXTENSIONS = new Set([
    ".mp4",
    ".mkv",
    ".avi",
    ".mov",
    ".wmv",
    ".flv",
]);

const scanDirectory = async (dirPath, rootFolder=null) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            const folderName = rootFolder ?? entry.name;
            await scanDirectory(fullPath, folderName);
            continue;
        }

        const extension = path.extname(entry.name).toLowerCase();
        if (!VIDEO_EXTENSIONS.has(extension)) continue;

        const parsed = filenameParser(entry.name);
        if (!parsed.title) continue;

        await Media.findOneAndUpdate(
            { filePath: fullPath },
            {
                title: parsed.title,
                year: parsed.year,
                season: parsed.season,
                episode: parsed.episode,
                type: parsed.type,
                extension: parsed.extension,
                folder: rootFolder || "Unknown"
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );
    }
};

const scanMediaLibrary = async () => {
    const mediaRoot = process.env.MEDIA_ROOT;

    if (!mediaRoot) {
        throw new Error("MEDIA_ROOT is not defined in environment variables");
    }

    const resolvedRoot = path.resolve(mediaRoot);

    if (!fs.existsSync(resolvedRoot)) {
        throw new Error(`Media directory does not exist ${resolvedRoot}`);
    }

    console.log(`[MediaVault] Scanning media directory: ${resolvedRoot}`);

    await scanDirectory(resolvedRoot);

    console.log("[MediaVault] Media scan completed successfully");
};

module.exports = { scanMediaLibrary };