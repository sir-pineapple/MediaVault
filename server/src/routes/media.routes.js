const express = require('express');

const { getMovies, getShows } = require('../modules/media/media.service');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const movies = await getMovies();
        const shows = await getShows();

        res.json({ movies, shows });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching media');
    }
});

module.exports = router;