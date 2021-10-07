require("dotenv").config();

module.exports = {
    port: parseInt(process.env.PORT),
    db: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    nodemailer: {
        hostname: process.env.NODEMAILER_HOSTNAME,
        port: process.env.NODEMAILER_PORT,
        domain: process.env.NODEMAILER_DOMAIN,
        username: process.env.NODEMAILER_USERNAME,
        password: process.env.NODEMIALER_PASSWORD,
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        baseFolderPath: process.env.CLOUDINARY_BASE_FOLDER_PATH ?? "eISO"
    },
    frontend: {
        baseUrl: "http://localhost:3000"
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    cors: {
        origin: "*",
        optionsSuccessStatus: 200,
    }
}
