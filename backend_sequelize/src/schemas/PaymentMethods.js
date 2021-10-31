const { DataTypes } = require('sequelize');
const db = require('../config/connection');

const Accounts = db.model('Accounts');

const PaymentMethods = db.define(
    'PaymentMethods',
    {
        payment_method_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        stripe_payment_method_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        stripe_payment_method_fingerprint: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        stripe_card_exp_date: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        stripe_card_last_four_digit: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        stripe_card_type: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: 'payment_methods',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at'
    }
);

// join table
const Accounts_PaymentMethods = db.define(
    'Accounts_PaymentMethods',
    {
        accounts_payment_methods_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        fk_account_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Accounts,
                key: 'account_id'
            }
        },
        fk_payment_methods_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: PaymentMethods,
                key: 'payment_method_id'
            }
        }
    },
    {
        tableName: 'accounts_pm',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Accounts.belongsToMany(PaymentMethods, {
    // an account can have many payment methods
    through: Accounts_PaymentMethods,
    foreignKey: 'fk_account_id',
    as: {
        singular: 'payment_account',
        plural: 'payment_accounts'
    }
});

PaymentMethods.belongsToMany(Accounts, {
    // a payment method can have many accounts
    through: Accounts_PaymentMethods,
    foreignKey: 'fk_payment_methods_id',
    as: {
        singular: 'payment_method',
        plural: 'payment_methods'
    }
});

module.exports = { PaymentMethods, Accounts_PaymentMethods };
