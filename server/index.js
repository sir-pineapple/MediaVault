const express = require('express');
require('dotenv').config();

const { runScan } = require('./scanner');
const { runMetadataEnrichment } = require('./metadata');
const { getMovies, getShows } = require('./media');

const app = express();
app.use(express.json());

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

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
