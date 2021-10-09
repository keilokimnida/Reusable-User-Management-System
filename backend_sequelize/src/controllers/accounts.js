const { findAllAccounts, findOneAccount, updateAccount } = require('../models/accounts');
const { responses: r } = require('../utils/response');
const { createAccount } = require('../models/accounts');
const E = require('../errors/Errors');

module.exports.createAccount = async (req, res) => {
    try {
        const { username } = await createAccount(req.body);
        res.status(201).send(r.success201({ username }));
    } catch (error) {
        if (error.original.code === 'ER_DUP_ENTRY')
            return res.status(400).send(
                r.error400({
                    message: 'Username has been taken'
                })
            );
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
};

// ============================================================

module.exports.findAllAccounts = async (req, res) => {
    try {
        const accounts = await findAllAccounts();

        if (accounts.length === 0) return res.status(204).send(r.success204);

        return res.status(200).send(r.success200(accounts));
    } catch (error) {
        // custom errors
        if (error instanceof E.BaseError) res.status(error.code).send(error.toJSON());
        // other errors
        else {
            console.log(error);
            res.status(500).send(r.error500(error));
        }
    }
};

// ============================================================

module.exports.findAccountByID = async (req, res) => {
    try {
        const accountID = parseInt(req.params.accountID);
        if (isNaN(accountID)) throw new E.ParamTypeError('accountID', req.params.accountID, 1);

        let where = {
            account_id: accountID
        };

        const account = await findOneAccount(where);

        if (!account) throw new E.AccountNotFound();

        return res.status(200).send(r.success200(account));
    } catch (error) {
        // custom errors
        if (error instanceof E.BaseError) res.status(error.code).send(error.toJSON());
        // other errors
        else {
            console.log(error);
            res.status(500).send(r.error500(error));
        }
    }
};

// ============================================================

// UPDATE

// updates only account details and their address
// does not include updating account (username/password)
module.exports.editAccount = async (req, res) => {
    try {
        const {
            auth: { decoded },
            companyId
        } = res.locals;

        const accountID = parseInt(req.params.accountID);
        if (isNaN(accountID)) throw new E.ParamTypeError('accountID', req.params.accountID, 1);

        // If account is not admin and is trying to edit other accounts
        if (decoded.admin_level !== 2 && accountID !== decoded.account_id)
            throw new E.PermissionError();

        let {
            firstname,
            lastname,
            title,
            email,
            status,
            admin_level = null,
            account_status = null,
            address = null
        } = req.body;

        // nobody should be manually locking an account
        if (account_status === 'locked') account_status = null;

        let include = [];

        if (address) include.push('address');
        if (status !== null) include.push('account');

        let where = {
            account_id: accountID
        };

        const account = await findOneAccount(where);

        if (!account) throw new E.AccountNotFound();

        let details = { firstname, lastname, email };

        // as an admin...
        if (decoded.admin_level === 2) {
            details.title = title;
            details.status = status;

            // dont allow admin to change their own admin_level
            if (decoded.account_id !== accountID) {
                // just admin_level is from req.body
                if (admin_level !== null) {
                    admin_level = parseInt(admin_level);
                    if (isNaN(admin_level))
                        throw new E.ParamTypeError('admin_level', admin_level, 1);
                    // if (admin_level === 1 || admin_level === 2) return res.status(400).send(r.error400({
                    //     message: "\"admin_level\" invalid value"
                    // }));
                    details.admin_level = admin_level;
                }
            }
        }

        await updateAccount(account, details);

        // update the address if necessary
        if (address) await account.address.update(address);

        // update the account status only when its necessary
        if (account_status !== null) {
            // as an admin...
            // can only change the status when the account status is not locked
            // should only be either active or deactivated
            if (decoded.admin_level === 2 && employee.account.status !== 'locked') {
                // prevent the admin from deactivating themself
                if (decoded.account_id !== accountID)
                    await account.update({ status: account_status });
                else
                    return res.status(400).send(
                        r.error400({
                            message: 'Cannot deactivate oneself'
                        })
                    );
            }
        }

        return res.status(204).send(r.success204());
    } catch (error) {
        // custom errors
        if (error instanceof E.BaseError) res.status(error.code).send(error.toJSON());
        // other errors
        else {
            console.log(error);
            res.status(500).send(r.error500(error));
        }
    }
};
