function validateEnv() {
    const requiredVars = ['SERVER_PORT', 'DATABASE_URL', 'OMDB_API_KEY'];

    const missing = requiredVars.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('Missing environment variables:');
        missing.forEach(variable => {
            console.error(`- ${variable}`);
        });
        process.exit(1);
    }
}

module.exports = validateEnv;