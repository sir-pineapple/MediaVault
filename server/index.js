const express = require('express');
require('dotenv').config();

const { runScan } = require('./scanner');
const { runMetadataEnrichment } = require('./metadata');

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

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
