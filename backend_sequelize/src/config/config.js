require('dotenv').config();

module.exports = {
    port: process.env.PORT || 8000,
    db: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    nodemailer: {
        hostname: process.env.NODEMAILER_HOSTNAME,
        port: process.env.NODEMAILER_PORT,
        domain: process.env.NODEMAILER_DOMAIN,
        username: process.env.NODEMAILER_USERNAME,
        password: process.env.NODEMIALER_PASSWORD
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        baseFolderPath: process.env.CLOUDINARY_BASE_FOLDER_PATH || 'User Management System'
    },
    stripe: {
        test: {
            secretKey: process.env.STRIPE_TEST_SECRET_KEY,
            webhookSecret: process.env.STRIPE_TEST_WEBHOOK_SECRET,
            subscriptions: {
                standard: [
                    process.env.STRIPE_PLAN_STANDARD_PRODUCT_ID,
                    process.env.STRIPE_PLAN_STANDARD_PRICE_ID
                ],
                premium: [
                    process.env.STRIPE_PLAN_PREMIUM_PRODUCT_ID,
                    process.env.STRIPE_PLAN_PREMIUM_PRICE_ID
                ]
            }
        }
    },
    frontend: {
        baseUrl: 'http://localhost:4001'
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    cookie: {
        secret: process.env.COOKIE_SECRET
    },
    cors: {
        origin: 'http://localhost:4001',
        credentials: true,
        optionsSuccessStatus: 200
    },
    aws: {
        region: process.env.AWS_DEFAULT_REGION,
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
};
