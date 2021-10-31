const { Op } = require('sequelize');

const { Products } = require('../schemas/Schemas');

module.exports.findAllProducts = () => Products.findAll();

module.exports.findProducts = (productsArr) => Products.findAll({
    where: {
        product_id: { [Op.in]: productsArr }
    }
});
