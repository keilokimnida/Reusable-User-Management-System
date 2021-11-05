const { findExclusiveContent } = require('../models/exclusiveContent');

const E = require('../errors/Errors');
const r = require('../utils/response').responses;

// Get exclusive content
module.exports.findExclusiveContent = async (req, res, next, accessLevel) => {
    try {
        const exclusiveContent = await findExclusiveContent(accessLevel);

        if (!exclusiveContent)
            throw new E.NotFoundError('exclusive content');

        res.status(200).send(r.success200(exclusiveContent));
        return next();
    }
    catch (error) {
        return next(error);
    }
};
