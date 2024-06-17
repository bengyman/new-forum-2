require('dotenv').config(); // Load environment variables from .env file

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: "mysql",
    port: process.env.DB_PORT,
    app_port: process.env.APP_PORT
};
    