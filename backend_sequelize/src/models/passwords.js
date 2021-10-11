const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const E = require('../errors/Errors');
const { secret: jwtSecret } = require('../config/config').jwt;

const { Accounts, Passwords } = require('../schemas/Schemas');

module.exports.createResetToken = (account_id) =>
    jwt.sign({ account_id }, jwtSecret, { expiresIn: '5m' });

module.exports.updatePasswordAttempts = (attempts, password_id) =>
    Passwords.update({ attempts }, { where: { password_id } });

module.exports.changePassword = async (accountId, newPassword) => {
    const account = await Accounts.findByPk(accountId, {
        include: 'passwords',
        order: [[Accounts.associations.passwords, 'updated_at', 'ASC']]
    });

    // "ORDER BY updated_at ASC" orders the oldest password first

    const comparisons = await Promise.all(account.passwords.map((row) => bcrypt.compare(newPassword, row.password)));
    const usedBefore = comparisons.some((compare) => !!compare);
    if (usedBefore) throw new E.RepeatPasswordError();

    // find the current active p/w and set to not active
    await Passwords.update({ active: false }, { where: { fk_account_id: accountId, active: true } });

    const hash = bcrypt.hashSync(newPassword, 10);

    // add in the new password  
    if (account.passwords.length < 5) await Passwords.create({
        fk_account_id: accountId,
        password: hash,
        active: true
    });
    // take the oldest password and update it
    else await account.passwords[0].update({
        password: hash,
        active: true,
        attempts: 0
    });

    if (account.status === 'locked') await account.update({ status: 'active' });

    const { passwords, ...other } = account;
    return other;
};
