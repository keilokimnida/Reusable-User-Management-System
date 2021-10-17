const { DataTypes } = require('sequelize');
const db = require('../config/connection');

const Accounts = db.model('Accounts');

const Passwords = db.define(
    'Passwords',
    {
        password_id: {
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
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        attempts: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: 'passwords',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Accounts.hasMany(Passwords, {
    foreignKey: 'fk_account_id',
    as: 'passwords'
});

Passwords.belongsTo(Accounts, {
    foreignKey: 'fk_account_id',
    as: 'account'
});

const Otps = db.define(
    'Otps',
    {
        otp_id: {
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
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'password_otps',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Accounts.hasMany(Otps, {
    foreignKey: 'fk_account_id',
    as: 'password_resets'
});

Otps.belongsTo(Accounts, {
    foreignKey: 'fk_account_id',
    as: 'account'
});

module.exports = { Passwords, Otps };
