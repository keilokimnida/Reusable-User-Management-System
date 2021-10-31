const { ACCOUNT_STATUS } = require('../config/enums');

const { DataTypes } = require('sequelize');
const db = require('../config/connection');

const Accounts = db.define(
    'Accounts',
    {
        account_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        account_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        firstname: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM(Object.values(ACCOUNT_STATUS)),
            allowNull: false,
            defaultValue: 'active'
        },
        admin_level: {
            // see config/enums.js
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        // Stripe
        has_trialed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        stripe_customer_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        stripe_payment_intent_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        stripe_payment_intent_client_secret: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        }
    },
    {
        tableName: 'accounts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at'
    }
);

module.exports = { Accounts };
