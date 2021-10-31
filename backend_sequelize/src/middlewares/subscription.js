const { findPlan } = require('../models/plan');

const E = require('../errors/Errors');

// This middleware checks if plan exists
module.exports.checkIfPlanExist = async (req, res, next) => {
    try {
        const { type } = req.params;
        if (!type) return next();

        // Check if plan exists
        const plan = await findPlan(type);
        if (!plan) throw new E.ParamMissingError('plan');
        res.locals.plan = plan;

        return next();
    }
    catch (error) {
        return next(error);
    }
};
