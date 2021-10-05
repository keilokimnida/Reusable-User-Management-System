// USED FOR STORING INVITATIONS SENT OUT

const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const Invitations = db.define(
    "Invitations",
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
        tableName: "invitations",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
);

// TODO r/s on FKs
// but i doubt there is a need since it is unlikely that a join query is necessary

module.exports = { Invitations };