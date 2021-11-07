const { DataTypes } = require('sequelize');
const db = require('../config/connection');

const Registrations = db.define(
    'Registrations',
    {
        registration_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: 'registrations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

module.exports = { Registrations };
