const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Accounts } = require("../model_definitions/Accounts");
const { Passwords } = require("../model_definitions/Passwords");

const { jwt: { secret: jwtSecret } } = require("../config/config");
const { responses: r } = require("../utils/response");

// PLATFORM CLIENT LOGIN
module.exports.clientLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const account = await Accounts.findOne({
            where: { username },
            include: [{
                model: Employees,
                as: "employee",
                include: "company"
            }, {
                model: Passwords,
                as: "passwords",
                where: { active: true },
                limit: 1
            }]
        });

        // no account matching username
        if (!account) return res.status(404).json({
            message: "Account not found",
            found: false,
            locked: null,
            token: null,
            data: null
        });

        if (account.employee.admin_level === 1) return res.status(403).json({
            message: "Incorrect login endpoint"
        });

        // check if company is suspended
        if (account.employee.company.status === "suspended") return res.status(403).json({
            message: "Company has been suspended"
        });

        // because of the one-to-many r/s btw account and passwords,
        // passwords is an array even though theres only one active password
        const { password_id, password: hash, attempts: passwordAttempts } = account.passwords[0];

        // if the account is locked or
        // the password has been attempted for more than 5 times
        if (account.status === "locked" || passwordAttempts > 5) return res.status(403).json({
            message: "Account is locked",
            found: true,
            locked: true,
            token: null,
            data: null
        });

        if (account.status === "deactivated") return res.status(403).json({
            message: "Account is deactivated"
        });

        const valid = bcrypt.compareSync(password, hash);

        if (!valid) {
            const attempts = passwordAttempts + 1;
            await Passwords.update({
                attempts,
            }, { where: { password_id } });

            // lock the account
            if (attempts >= 5) {
                await account.update({
                    status: "locked"
                });
                return res.status(403).json({
                    message: "Account is now locked",
                    found: true,
                    locked: true,
                    token: null,
                    data: null
                });
            }

            // incorrect password
            return res.status(401).json({
                message: "Invalid password",
                found: true,
                locked: false,
                token: null,
                data: null
            });
        }

        // valid password below

        // reset password attempts
        // avoid unnecessary writing to database
        if (passwordAttempts > 0) await Passwords.update({
            attempts: 0
        }, { where: { password_id } });

        // generate token
        const token = jwt.sign({
            account_id: account.account_id,
            username: account.username,
            company_id: account.employee.fk_company_id,
            employee_id: account.employee.employee_id,
            email: account.employee.email,
            admin_level: account.employee.admin_level
        }, jwtSecret, { expiresIn: "12h" });

        return res.status(200).json({
            message: "Success",
            found: true,
            locked: false,
            token,
            data: {
                display_name: `${account.employee.firstname} ${account.employee.lastname}`,
                display_title: account.employee.title,
                username: account.username,
                email: account.employee.email,
                company_id: account.employee.fk_company_id,
                company_name: account.employee.company.name,
                company_alias: account.employee.company.alias
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}

// ============================================================

// PLATFORM ADMIN LOGIN
module.exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const account = await Accounts.findOne({
            where: { username },
            include: [{
                model: Employees,
                as: "employee"
                // platform admins are not tied to a company
                // so does not include company
            }, {
                model: Passwords,
                as: "passwords",
                where: { active: true },
                limit: 1
            }]
        });

        // no account matching username
        if (!account) return res.status(404).json({
            message: "Account not found",
            found: false,
            locked: null,
            token: null,
            data: null
        });

        if (account.employee.admin_level !== 1) return res.status(403).json({
            message: "Incorrect login endpoint"
        });

        // because of the one-to-many r/s btw account and passwords,
        // passwords is an array even though theres only one active password
        const { password_id, password: hash, attempts: passwordAttempts } = account.passwords[0];

        // if the account is locked or
        // the password has been attempted for more than 5 times
        if (account.status === "locked" || passwordAttempts > 5) return res.status(403).json({
            message: "Account is locked",
            found: true,
            locked: true,
            token: null,
            data: null
        });

        if (account.status === "deactivated") return res.status(403).json({
            message: "Account is deactivated"
        });

        const valid = bcrypt.compareSync(password, hash);

        if (!valid) {
            const attempts = passwordAttempts + 1;
            await Passwords.update({
                attempts,
            }, { where: { password_id } });

            // lock the account
            if (attempts >= 5) {
                await account.update({
                    status: "locked"
                });
                return res.status(403).json({
                    message: "Account is now locked",
                    found: true,
                    locked: true,
                    token: null,
                    data: null
                });
            }

            // incorrect password
            return res.status(401).json({
                message: "Invalid password",
                found: true,
                locked: false,
                token: null,
                data: null
            });
        }

        // valid password below

        // reset password attempts
        // avoid unnecessary writing to database
        if (passwordAttempts > 0) await Passwords.update({
            attempts: 0
        }, { where: { password_id } });

        // generate token
        const token = jwt.sign({
            account_id: account.account_id,
            username: account.username,
            company_id: null,
            employee_id: account.employee.employee_id,
            email: account.employee.email,
            admin_level: account.employee.admin_level
        }, jwtSecret, { expiresIn: "12h" });

        return res.status(200).json({
            message: "Success",
            found: true,
            locked: false,
            token,
            data: {
                display_name: `${account.employee.firstname} ${account.employee.lastname}`,
                display_title: account.employee.title,
                username: account.username,
                email: account.employee.email,
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
}
