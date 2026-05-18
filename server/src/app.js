const express = require('express');
const cors = require('cors');

const statusRoutes = require('./routes/status.routes');
const scanRoutes = require('./routes/scan.routes');
const metadataRoutes = require('./routes/metadata.routes');
const mediaRoutes = require('./routes/media.routes');
const streamRoutes = require('./routes/stream.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', statusRoutes);
app.use('/scan', scanRoutes);
app.use('/metadata', metadataRoutes);
app.use('/media', mediaRoutes);
app.use('/stream', streamRoutes);

module.exports = app;