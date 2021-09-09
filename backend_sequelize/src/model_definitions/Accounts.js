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
