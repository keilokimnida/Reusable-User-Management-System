// USED FOR STORING INVITATIONS SENT OUT

const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const AccountsVerifications = db.define(
    "AccountsVerifications",
    {
        invitation_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        token: {
            type: DataTypes.STRING(512),
            allowNull: false
        },
    },
    {
        tableName: "accounts_verifications",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
);

// TODO r/s on FKs
// but i doubt there is a need since it is unlikely that a join query is necessary

module.exports = { AccountsVerifications };