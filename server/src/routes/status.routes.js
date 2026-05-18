const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('MediaVault API running');
});

module.exports = router;