const { findAllProducts } = require('../models/product');

const r = require('../utils/response').responses;

// READ
module.exports.findAllProducts = async (req, res, next) => {
    try {
        const products = await findAllProducts();
        const results = products.length === 0 ? undefined : products;
        res.status(200).send(r.success200(results));
        return next();
    }
    catch (error) {
        return next(error);
    }
};
