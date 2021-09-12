const { Op } = require("sequelize");

const { Accounts } = require("../model_definitions/Accounts");
const { Invitations } = require("../model_definitions/Invitations");

const bcrypt = require("bcryptjs");

const usedInvite = async (token) => {
    const row = await Invitations.findOne({
        where: { token }
    });

    const { email } = row;

    // delete all the invite tokens that has been sent to the person
    // from the same source

    // for platform admins, they dont have company fk
    let where = {
        [Op.and]: [{ email }]
    };

    await Invitations.destroy({ where });
};

// ============================================================

const register = async ({ token, decoded }, meta, avatar = null) => {
    let {
        firstname, lastname,
        username, password,
        // address = null
    } = meta;

    const hash = bcrypt.hashSync(password, 10);

    let newAccount;
    try {
        newAccount = await Accounts.create({
            firstname, lastname,
            username,
            status: "active",
            passwords: [{ password: hash }]
        }, { include: "passwords" });
    }
    catch (error) {
        throw error;
    }

    await usedInvite(token);

    if (avatar) {
        // TODO avatar file upload
    };

    return newAccount;
}

// ============================================================

const user = (token, meta, avatar = null) => register(token, meta, 0, avatar);

const platformAdmin = (token, meta, avatar = null) => register(token, meta, 1, avatar);

const systemAdmin = (token, meta, avatar = null) => register(token, meta, 2, avatar)

const secondaryAdmin = (token, meta, avatar = null) => register(token, meta, 3, avatar);

// ============================================================

module.exports = {
    register: {
        platformAdmin,
        systemAdmin,
        secondaryAdmin,
        user
    },
    usedInvite
}
