const { DataTypes } = require('sequelize');
const db = require('../config/connection');

const Accounts = db.define(
    'Accounts',
    {
        account_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
            // active is the default state for the account
            // locked is when the password is invalidated
            // deactivated is when the account is closed, but the associated account is not deleted for record tracking purposes
            type: DataTypes.ENUM(['active', 'locked', 'deactivated']),
            allowNull: false,
            defaultValue: 'active'
        },
        admin_level: {
            // the admin level the accounts has
            // 0 -> normal (Cannot manage system)
            // 1 -> super admin (Manage system, admin users, and normal users)
            // 2 -> admin (manage normal users)
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0
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
