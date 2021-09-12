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