require('dotenv').config();
const validateEnv = require('./config/env');
validateEnv();

const app = require('./app');

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});