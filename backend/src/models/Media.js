const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: String,
        },
        season: {
            type: Number,
            default: null,
        },
        episode: {
            type: Number,
            default: null,
        },
        type: {
            type: String,
            enum: ["movie", "episode"],
            required: true,
        },
        filePath: {
            type: String,
            required: true,
            unique: true,
        },
        extension: {
            type: String,
            required: true,
        },
        folder: {
            type: String,
            required: true,
        },
        poster: {
            type: String,
        },
        imdbRating: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Media", MediaSchema);