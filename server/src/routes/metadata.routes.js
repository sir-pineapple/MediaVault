const express = require('express');

const { runMetadataEnrichment } = require('../modules/metadata/metadata.service');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        await runMetadataEnrichment();
        res.send('Metadata fetched');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Metadata fetch failed');
    }
});

module.exports = router;