const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const E = require('../errors/Errors');
const { secret: jwtSecret } = require('../config/config').jwt;

const { Accounts, Passwords, Otps } = require('../schemas/Schemas').User;

module.exports.createResetToken = async (account_id) => {
    const token = jwt.sign({ account_id }, jwtSecret, { expiresIn: '5m' });
    const row = await Otps.create({ fk_account_id: account_id, token });
    return { token, row };
};

module.exports.validateResetToken = async (token) => {
    try {
        const decoded = jwt.verify(token, jwtSecret);

        const row = await Otps.findOne({
            where: { fk_account_id: decoded.account_id, token }
        });

        if (!row) throw new E.TokenNotFoundError();
    }
    catch (error) {
        // expired tokens should be removed from db
        if (error instanceof jwt.TokenExpiredError) {
            await Otps.destroy({ where: { token } });
            throw new E.TokenExpiredError();
        }

        if (error instanceof jwt.JsonWebTokenError)
            throw new E.TokenBrokenError();

        // other errors
        throw error;
    }
};

module.exports.useResetTokens = (fk_account_id) => Otps.destroy({
    where: { fk_account_id }
});

module.exports.updatePasswordAttempts = (password_id, attempts) => Passwords.update({ attempts }, { where: { password_id } });

module.exports.changePassword = async (accountId, newPassword) => {
    const { passwords, ...account } = await Accounts.findByPk(accountId, {
        include: 'passwords',
        order: [[Accounts.associations.passwords, 'updated_at', 'ASC']]
    });

    // "ORDER BY updated_at ASC" orders the oldest password first

    const comparisons = await Promise.all(passwords.map((row) => bcrypt.compare(newPassword, row.password)));
    const usedBefore = comparisons.some((compare) => !!compare);
    if (usedBefore) throw new E.RepeatPasswordError();

    // find the current active p/w and set to not active
    await Passwords.update({ active: false }, { where: { fk_account_id: accountId, active: true } });

    const hash = bcrypt.hashSync(newPassword, 10);

    // add in the new password  
    if (passwords.length < 5) await Passwords.create({
        fk_account_id: accountId,
        password: hash,
        active: true
    });
    // take the oldest password and update it
    else await passwords[0].update({
        password: hash,
        active: true,
        attempts: 0
    });

    if (account.status === 'locked') await account.update({ status: 'active' });

    return account;
};
