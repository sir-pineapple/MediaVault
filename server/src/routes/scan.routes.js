const express = require('express');

const { runScan } = require('../modules/scanner/scanner.service');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        await runScan();

        res.send('Scan complete');
    }
    catch(err) {
        console.error(err);

        res.status(500).send('Scan failed');
    }
});

module.exports = router;