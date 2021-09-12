const { DataTypes } = require("sequelize");
const db = require("../config/connection");

// import models to define many-to-many relationship

const Accounts = db.define(
    "Accounts",
    {
        account_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
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
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        status: {
            // active is the default state for the account
            // locked is when the password is invalidated
            // deactivated is when the account is closed, but the associated employee is not deleted for record tracking purposes
            type: DataTypes.ENUM(["active", "locked", "deactivated"]),
            allowNull: false,
            defaultValue: "active"
        },
        admin_level: {
            // the admin level the employee has
            // 0 -> guest (No subscription)
            // 1 -> normal (Paid for subscription)
            // 2 -> client admin (Paid for subscription)
            // 3 -> platform admin (People who manage the system i.e. us)
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: "accounts",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);

module.exports = { Accounts };
