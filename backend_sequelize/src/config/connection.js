const { db: { name, user, password, host, port } } = require('./config');
const { Sequelize } = require('sequelize');

const db = new Sequelize(name, user, password, {
    host, port, dialect: 'mysql'
});

module.exports = db;
