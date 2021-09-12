const { findOneAccount } = require("../models/accounts");

module.exports.checkAccountStatus = async (req, res, next) => {
    try {
        const { decoded: { account_id, admin_level } } = res.locals.auth;

        // platform admin can bypass this check
        if (admin_level === 1) return next();

        let where = { account_id };
        let attributes = ["status", "admin_level"];

        const account = await findOneAccount(where, null, attributes);

        // Check if account is active
        if (account.status !== "active") return res.status(403).send(r.error403({
            message: `The account is ${account.status}`,
            account_status: account.status
        }));

        return next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};