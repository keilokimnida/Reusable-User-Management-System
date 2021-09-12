const jwt = require("jsonwebtoken");

const { Accounts } = require("../model_definitions/Accounts");
const { Invitations } = require("../model_definitions/Invitations");

const { register } = require("../models/invitation");
const { frontend, jwt: { secret: jwtSecret } } = require("../config/config");
const { sendEmail, templates } = require("../utils/email");
const { responses: r } = require("../utils/response");


module.exports.createInvite = async (req, res,) => {
    try {
        const { email } = req.body;
        const json = { email };

        const token = jwt.sign(json, jwtSecret, {
            expiresIn: "7d"
        });

        await Invitations.create({
            email, token,
        });

        const jumpContentTemplates = {
            0: templates.inviteUser,
            1: templates.invitePlatformAdmin,
            2: templates.inviteSystemAdmin,
        }

        try {
            await sendEmail(email, "You've been invited to join eISO", jumpContentTemplates[0](token))
        }
        catch (error) {
            // here, the email failed to be sent
            console.log(error);
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

        const row = await User.Invitations.findOne({
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

        const jumpRegister = {
            0: register.user,
            1: register.platformAdmin,
            2: register.systemAdmin,
            3: register.secondaryAdmin
        };

        const { username } = await jumpRegister[0](res.locals.invite, {
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

// ============================================================

module.exports.findUserById = async (req, res) => {
    try {
        // if this controller is on the admin endpoint but for some reason
        // the token says the user is not a platform admin

        const account_id = parseInt(req.params.account_id);
        if (isNaN(account_id)) return res.status(400).send(r.error400({
            message: "Invalid parameter \"account_id\""
        }));

        let where = {
            account_id: account_id,
        };

        const account = await Accounts.findOne({ where });
        if (!account) return res.status(404).send(r.error404({
            message: `\"account_id\" ${account_id} not found`
        }));

        return res.status(200).send(r.success200(account));
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}

// ============================================================

// UPDATE

// updates only employee details and their address
// does not include updating account (username/password)
module.exports.editEmployee = async (req, res, platformAdmin = false) => {
    try {
        const { auth: { decoded }, companyId } = res.locals;

        const employeeId = parseInt(req.params.employeeId);
        if (isNaN(employeeId)) return res.status(400).send(r.error400({
            message: "Invalid parameter \"employeeId\""
        }));

        // if this controller is on the admin endpoint but for some reason
        // the token says the user is not a platform admin
        if (platformAdmin && decoded.admin_level !== 1) return res.status(403).send(r.error403({
            message: "Client user on wrong endpoint"
        }));

        let { firstname, lastname, title, email, status, admin_level = null, account_status = null, address = null } = req.body;
        // nobody should be manually locking an account
        if (account_status === "locked") account_status = null;

        let include = [];

        if (address) include.push("address");
        if (status !== null) include.push("account");

        let where = {
            employee_id: employeeId,
            fk_company_id: companyId
        };

        if (platformAdmin) where = {
            employee_id: employeeId,
            fk_company_id: null,
            admin_level: 1
        }

        const employee = await Employees.findOne({ where, include });
        if (!employee) return res.status(404).send(r.error404({
            message: `\"employeeId\" ${employeeId} not found`
        }));

        let details = { firstname, lastname, email };

        // as a system admin...
        if (decoded.admin_level === 2) {
            details.title = title;
            details.status = status;

            // dont allow the system admin to change their own admin_level
            if (decoded.employee_id !== employeeId) {
                // just admin_level is from req.body
                if (admin_level !== null) {
                    admin_level = parseInt(admin_level);
                    if (isNaN(admin_level)) return res.status(400).send(r.error400({
                        message: "\"admin_level\" is NaN"
                    }));
                    if (admin_level === 1 || admin_level === 2) return res.status(400).send(r.error400({
                        message: "\"admin_level\" invalid value"
                    }));
                    details.admin_level = admin_level;
                }
            }
        }

        if (platformAdmin) {
            details.title = title;
            details.status = status;
        }

        await employee.update(details);

        // update the address if necessary
        if (address) await employee.address.update(address);

        // update the account status only when its necessary
        if (account_status !== null) {
            // as a system admin...
            // can only change the status when the account status is not locked
            // should only be either active or deactivated
            if (decoded.admin_level === 2 && employee.account.status !== "locked") {
                // prevent the system admin from deactivating themself
                if (decoded.employee_id !== employeeId)
                    await employee.account.update({ status: account_status });
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
