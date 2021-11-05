const { findProducts } = require('../models/product');

const E = require('../errors/Errors');

// This middleware double checks the total price before creating a payment intent
module.exports.calculateProductsTotalPrice = async (req, res, next) => {
    try {
        // Get all the items 
        const { items } = req.body;
        if (!items || items.length === 0) {
            // TODO STRIPE (not really) ERROR
            return res.status(400).json({ message: 'No items in cart' });
        }

        const products = await findProducts(items);

        // Calculate products total price
        // let totalPrice = 0;
        // products.forEach((product) => totalPrice += parseFloat(product.price));

        const totalPrice = products.reduce((total, product) => total += parseFloat(product.price), 0);

        // save total price in res.locals
        res.locals.totalPrice = parseInt((totalPrice * 100).toFixed(2));

        return next();
    }
    catch (error) {
        return next(error);
    }
};
