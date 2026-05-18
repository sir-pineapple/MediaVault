const express = require('express');

const { streamById } = require('../modules/stream/stream.service');

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        await streamById(req.params.id, req, res);
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Streaming error');
    }
});

module.exports = router;