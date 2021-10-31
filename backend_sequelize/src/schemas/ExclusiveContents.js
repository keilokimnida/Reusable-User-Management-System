const { DataTypes } = require('sequelize');
const db = require('../config/connection');

const ExclusiveContents = db.define(
    'ExclusiveContents',
    {
        exclusive_content_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        access_level: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at'
    }
);

module.exports = { ExclusiveContents };
