const { findAllAccounts, findOneAccount, updateAccount } = require("../models/accounts");
const jwt = require("jsonwebtoken");

const { Accounts } = require("../model_definitions/Accounts");
const { AccountsVerifications } = require("../model_definitions/AccountsVerifications");
const { findUserById } = require("../models/accounts");


const { register } = require("../models/AccountsVerifications");
const { frontend, jwt: { secret: jwtSecret } } = require("../config/config");
const { sendEmail, templates } = require("../utils/email");
const { responses: r } = require("../utils/response");

module.exports.sendVerificationLink = async (req, res) => {
    try {
        const {
            firstname, lastname,
            username, email, password,
            address = null
        } = req.body;

        const json = {
            firstname, lastname,
            username, email, password,
            address
        };

        const token = jwt.sign(json, jwtSecret, {
            expiresIn: "7d"
        });

        // Check if email exists on Accounts and AccountsVerifications table

        await AccountsVerifications.create({
            firstname, lastname,
            username, email, password,
            address, token,
        });

        try {
            await sendEmail(email, "You've been invited to join User Management System!", templates.inviteUser(token))
        }
        catch (error) {
            // here, the email failed to be sent
            console.log(error);

            // Why am i sending these back?
            return res.status(201).send(r.success201({
                email: false,
                token,
                link: `${frontend.baseUrl}/create-account/${token}`
            }));
        }

        return res.status(201).send(r.success201({
            email: true,
            token,
            link: `${frontend.baseUrl}/create-account/${token}`
        }));
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}

// ============================================================

module.exports.validateInvite = async (req, res) => {
    try {
        const {
            token,
            decoded: { admin_level, company_name, company_alias, title }
        } = res.locals.invite;

        const row = await AccountsVerifications.findOne({
            where: { token }
        });

        if (!row) res.status(404).send(r.error404({
            message: "Invitation does not exist"
        }));

        let json = {
            email: row.email,
            admin_level
        };

        if (row.fk_company_id !== null) {
            json.company_id = row.fk_company_id;
            json.company_name = company_name;
            json.company_alias = company_alias;
            json.title = title;
        }

        return res.status(200).send(r.success200(json));

        // when undefined is parsed into json, the key is lost
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}

// ============================================================

module.exports.registerInvite = async (req, res) => {
    try {
        const {
            firstname, lastname,
            username, email, password,
            address = null
        } = req.body;

        const { username } = await register.user(res.locals.invite, {
            firstname, lastname,
            username, email, password,
            address
        }, req.files?.avatar);

        res.status(201).send(r.success201({ username }));
    }
    catch (error) {
        if (error.original.code === "ER_DUP_ENTRY") return res.status(400).send(r.error400({
            message: "Username has been taken"
        }));
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}

module.exports.findAllAccounts = async (req, res) => {
    try {

        const accounts = await findAllAccounts();

        if (accounts.length === 0) return res.status(204).send(r.success204);

        return res.status(200).send(r.success200(accounts));

    } catch (error) {
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}

module.exports.findAccountByID = async (req, res) => {
    try {
        const accountID = parseInt(req.params.accountID)
        if (isNaN(accountID)) return res.status(400).send(r.error400({
            message: "Invalid parameter \"accountID\""
        }));

        let where = {
            account_id: accountID
        };

        const account = await findOneAccount(where);

        if (!account) return res.status(404).send(r.error404({
            message: `\"account_id\" ${accountID} not found`
        }));

        return res.status(200).send(r.success200(account));

    } catch (error) {
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}

// ============================================================

// UPDATE

// updates only account details and their address
// does not include updating account (username/password)
module.exports.editAccount = async (req, res) => {
    try {
        const { auth: { decoded }, companyId } = res.locals;

        const accountID = parseInt(req.params.accountID);
        if (isNaN(accountID)) return res.status(400).send(r.error400({
            message: "Invalid parameter \"accountID\""
        }));

        // If account is not admin and is trying to edit other accounts
        if (decoded.admin_level !== 2 && accountID !== decoded.account_id) return res.status(403).send(r.error403({
            message: "Forbidden access!"
        }));

        let { firstname, lastname, title, email, status, admin_level = null, account_status = null, address = null } = req.body; like
        // nobody should be manually locking an account
        if (account_status === "locked") account_status = null;

        let include = [];

        if (address) include.push("address");
        if (status !== null) include.push("account");

        let where = {
            account_id: accountID
        };

        const account = await findOneAccount(where);

        if (!account) return res.status(404).send(r.error404({
            message: `\"accountID\" ${accountID} not found`
        }));

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
                    if (isNaN(admin_level)) return res.status(400).send(r.error400({
                        message: "\"admin_level\" is NaN"
                    }));
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
            if (decoded.admin_level === 2 && employee.account.status !== "locked") {
                // prevent the admin from deactivating themself
                if (decoded.account_id !== accountID)
                    await account.update({ status: account_status });
                else return res.status(400).send(r.error400({
                    message: "Cannot deactivate oneself"
                }));
            }
        }

        return res.status(204).send(r.success204());
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}

// ============================================================

// DELETE

// i dont think there is such a thing as truly deleting an employee
// the employee's account should be terminated/deactivated, but the employee
// should still be represented in the system, for their past work
