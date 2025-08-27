const express = require('express');
const router = express.Router();
const { ProductManager } = require('../dao/ProductManager');

ProductManager.rutaDatos = "./src/data/products.json";

router.get('/', async (req, res) => {
    const productos = await ProductManager.getProducts();
    res.render('home', { products: productos });
});

router.get('/realtimeproducts', async (req, res) => {
    const productos = await ProductManager.getProducts();
    res.render('realTimeProducts', { products: productos });
});

module.exports = router;
