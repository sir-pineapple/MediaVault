const express = require('express');
require('dotenv').config();

const { runScan } = require('./scanner');
const { runMetadataEnrichment } = require('./metadata');
const { getMovies, getShows } = require('./media');
const db = require('./db');
const streamVideo = require('./stream');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.send('MediaVault API running');
});

app.post('/scan', async (req, res) => {
    await runScan();
    res.send("Scan complete");
});

app.post('/metadata', async(req, res) => {
    await runMetadataEnrichment();
    res.send("Metadata fetched");
});

app.get('/media', async(req, res) => {
    try {
        const movies = await getMovies();
        const shows = await getShows();

        res.json({ movies, shows });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error fetching media");
    }
});

app.get('/stream/:id', async (req, res) => {
    try {
        const fileId = req.params.id;

        const result = await db.query(
            `SELECT file_path FROM media_files WHERE id = $1`,
            [fileId]
        );

        if (result.rowCount === 0) {
            return res.status(400).send("File not found");
        }

        const filePath = result.rows[0].file_path;

        streamVideo(filePath, req, res);
    }
    catch(err) {
        console.error(err);
        res.status(500).send("Streaming error");
    }
});

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
