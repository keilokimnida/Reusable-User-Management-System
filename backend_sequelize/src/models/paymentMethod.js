const db = require('../config/connection');
const { Op } = require('sequelize');

const {
    User: { Accounts, PaymentMethods, Accounts_PaymentMethods }
} = require('../schemas/Schemas');

// Insert Payment Method
module.exports.insertPaymentMethod = async (accountID, paymentMethodID, cardFingerprint, cardLastFourDigit, cardType, cardExpDate) => {
    const transaction = await db.transaction();
    try {
        const { payment_method_id } = await PaymentMethods.create({
            stripe_payment_method_id: paymentMethodID,
            stripe_payment_method_fingerprint: cardFingerprint,
            stripe_card_last_four_digit: cardLastFourDigit,
            stripe_card_type: cardType,
            stripe_card_exp_date: cardExpDate
        }, { transaction });

        await Accounts_PaymentMethods.create({
            fk_account_id: accountID,
            fk_payment_methods_id: payment_method_id
        }, { transaction });

        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};


// Update Payment Method
module.exports.updatePaymentMethod = (paymentMethodID, cardFingerprint, cardLastFourDigit, cardType, cardExpDate) =>
    PaymentMethods.update({
        stripe_payment_method_fingerprint: cardFingerprint,
        stripe_last_four_digit: cardLastFourDigit,
        stripe_card_type: cardType,
        stripe_card_exp_date: cardExpDate
    }, { where: { stripe_payment_method_id: paymentMethodID } });


// Remove Payment method
module.exports.removePaymentMethod = (paymentMethodID) =>
    PaymentMethods.destroy({
        where: { stripe_payment_method_id: paymentMethodID }
    });


// Find Payment Method by ID
module.exports.findPaymentMethod = (paymentMethodID) =>
    PaymentMethods.findOne({
        where: { stripe_payment_method_id: paymentMethodID },
        include: 'payment_methods'
    });


// Find Duplicate Payment Method
module.exports.findDuplicatePaymentMethod = (accountID, cardFingerprint, stripePaymentMethodID) =>
    Accounts.findOne({
        where: { account_id: accountID },
        include: {
            model: PaymentMethods,
            as: 'payment_accounts',
            where: {
                stripe_payment_method_fingerprint: cardFingerprint,
                stripe_payment_method_id: {
                    [Op.ne]: stripePaymentMethodID
                }
            }
        }
    });
