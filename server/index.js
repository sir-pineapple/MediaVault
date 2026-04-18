const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MediaVault API running');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});