const { STRIPE_PAYMENT_INTENT_STATUS } = require('../config/enums');

const { DataTypes } = require('sequelize');
const db = require('../config/connection');

const Subscriptions = db.model('Subscriptions');

const Invoices = db.define(
    'Invoices',
    {
        invoice_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        stripe_invoice_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        amount: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        paid_on: {
            type: 'TIMESTAMP',
            allowNull: true
        },
        fk_subscription_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Subscriptions,
                key: 'subscription_id'
            }
        },
        stripe_reference_number: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        stripe_payment_intent_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        stripe_client_secret: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        stripe_payment_intent_status: {
            type: DataTypes.ENUM(Object.values(STRIPE_PAYMENT_INTENT_STATUS)),
            allowNull: true
        },
        stripe_payment_method_fingerprint: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        stripe_card_exp_date: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        stripe_card_last_four_digit: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        stripe_card_type: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    },
    {
        tableName: 'invoices',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at'
    }
);

Subscriptions.hasMany(Invoices, {
    foreignKey: 'fk_subscription_id',
    as: 'invoice'
});

Invoices.belongsTo(Subscriptions, {
    foreignKey: 'fk_subscription_id',
    as: 'subscription'
});

module.exports = { Invoices };
