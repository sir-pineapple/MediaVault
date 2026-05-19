const express = require('express');

const { getStatus } = require('../modules/status/status.service');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const health = await getStatus();
        const statusCode = health.status === 'ok' ? 202 : 503;
        res.status(statusCode).json(health);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error' });
    }
});

module.exports = router;