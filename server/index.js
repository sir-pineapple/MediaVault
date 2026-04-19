const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const { runScan } = require('./scanner');

app.post('/scan', async (req, res) => {
    await runScan();
    res.send("Scan complete");
});

app.get('/', (req, res) => {
    res.send('MediaVault API running');
});

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
