const { STRIPE_STATUS } = require('../config/enums');

const { DataTypes } = require('sequelize');
const db = require('../config/connection');

const Accounts = db.model('Accounts');
const PaymentMethods = db.model('PaymentMethods');
const Plans = db.model('Plans');

const Subscriptions = db.define(
    'Subscriptions',
    {
        subscription_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: false
        },
        stripe_subscription_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        fk_plan_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Plans,
                key: 'plan_id'
            }
        },
        fk_account_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Accounts,
                key: 'account_id'
            }
        },
        // Default payment method
        fk_payment_method: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: PaymentMethods,
                key: 'payment_method_id'
            }
        },
        stripe_status: {
            type: DataTypes.ENUM(Object.values(STRIPE_STATUS)),
            allowNull: true
        },
        trial_end: {
            type: 'TIMESTAMP',
            allowNull: true
        },
        current_period_start: {
            type: 'TIMESTAMP',
            allowNull: true
        },
        current_period_end: {
            type: 'TIMESTAMP',
            allowNull: true
        }
    },
    {
        tableName: 'subscriptions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Accounts.hasMany(Subscriptions, {
    foreignKey: 'fk_account_id',
    as: 'subscription'
});

Subscriptions.belongsTo(Accounts, {
    foreignKey: 'fk_account_id',
    as: 'account'
});

Plans.hasMany(Subscriptions, {
    foreignKey: 'fk_plan_id',
    as: 'subscription'
});

Subscriptions.belongsTo(Plans, {
    foreignKey: 'fk_plan_id',
    as: 'plan'
});

PaymentMethods.hasMany(Subscriptions, {
    foreignKey: 'fk_payment_method',
    as: 'subscription'
});

Subscriptions.belongsTo(PaymentMethods, {
    foreignKey: 'fk_payment_method',
    as: 'payment_method'
});


module.exports = { Subscriptions };
