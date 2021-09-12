// CLAUSE 4.2

const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const { Accounts } = require("./Accounts");

const CompanyParties = db.define(
    "CompanyParties",
    {
        party_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Accounts,
                key: "account_id"
            }
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        approved_by: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Accounts,
                key: "account_id"
            }
        },
        status: {
            // ENUM data type maps each valid string value to an index starting at 1
            // 1 = active, 2 = pending, ...
            // Only the specified values below are valid in string
            type: DataTypes.ENUM(["active", "pending", "rejected", "archived"]),
            allowNull: false
        },
        approved_on: {
            type: "TIMESTAMP",
            allowNull: true
        },
        expired_on: {
            type: "TIMESTAMP",
            allowNull: true
        }
    },
    {
        tableName: "company_parties",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);

const PartyItems = db.define(
    "PartyItems",
    {
        party_item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        fk_party_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: CompanyParties,
                key: "party_id"
            }
        },
        interested_party: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        expectations: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        display_order: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        parent_item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: null,
            references: {
                model: this,
                key: "party_item_id"
            }
        }
    },
    {
        tableName: "company_party_items",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);


CompanyParties.hasMany(PartyItems, {
    foreignKey: "fk_party_id",
    as: "items"
});

PartyItems.belongsTo(CompanyParties, {
    foreignKey: "fk_party_id",
    as: "party"
});

Accounts.hasMany(CompanyParties, {
    foreignKey: "created_by",
    as: "submitted_parties"
});

CompanyParties.belongsTo(Accounts, {
    foreignKey: "created_by",
    as: "author"
});

Accounts.hasMany(CompanyParties, {
    foreignKey: "approved_by",
    as: "approved_parties"
});

CompanyParties.belongsTo(Accounts, {
    foreignKey: "approved_by",
    as: "approver"
});


// optional self-reference r/s
// for swot items that have a parent
PartyItems.hasOne(PartyItems, {
    foreignKey: "parent_item_id",
    as: "child"
});

PartyItems.belongsTo(PartyItems, {
    foreignKey: "parent_item_id",
    as: "parent"
});

module.exports = { CompanyParties, PartyItems };
