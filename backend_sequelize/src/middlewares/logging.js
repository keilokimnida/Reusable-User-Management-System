const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    format: format.combine(format.timestamp(), format.simple()),
    transports: [
        new transports.File({
            filename: 'error.log',
            level: 'error'
        }),
        new transports.File({
            filename: 'access.log',
            level: 'info'
        })
    ]
});

const convertToLiteral = (e) => ({ name: e.name, message: e.message, stack: e.stack });

module.exports.accessLogger = (req, res, next) => {
    const log = JSON.stringify({
        ip: req.ip,
        url: req.originalUrl
    });

    logger.info(log);
    return next();
};

module.exports.errorLogger = (error, req, res, next) => {
    const err = error instanceof Error
        ? convertToLiteral(error)
        : { name: 'unknown', message: error, stack: null };

    logger.error(JSON.stringify(err));
    return next(error);
};
