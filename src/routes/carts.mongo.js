const express = require("express");
const Cart = require("../dao/Cart.model");
const Product = require("../dao/Product.model");
const router = express.Router();

// POST /api/carts - Crear nuevo carrito
router.post("/", async (req, res) => {
    try {
        const cart = new Cart({ products: [] });
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/carts/:cid - Listar productos de un carrito (populate)
router.get("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/carts/:cid/product/:pid - Agregar producto a carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        const prodInCart = cart.products.find(p => p.product.equals(product._id));
        if (prodInCart) {
            prodInCart.quantity += 1;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        cart.products = cart.products.filter(p => !p.product.equals(req.params.pid));
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/carts/:cid - Actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        const products = req.body.products;
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: "El cuerpo debe ser un array de productos" });
        }
        // Validar que todos los productos existan y tengan cantidad válida
        for (const item of products) {
            if (!item.product || typeof item.quantity !== 'number' || item.quantity < 1) {
                return res.status(400).json({ error: "Cada producto debe tener un id válido y cantidad mayor a 0" });
            }
            const exists = await Product.findById(item.product);
            if (!exists) {
                return res.status(404).json({ error: `Producto con id ${item.product} no existe` });
            }
        }
        cart.products = products;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/carts/:cid/products/:pid - Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        const prodInCart = cart.products.find(p => p.product.equals(req.params.pid));
        if (!prodInCart) return res.status(404).json({ error: "Producto no está en el carrito" });
        prodInCart.quantity = req.body.quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/carts/:cid - Vaciar carrito
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        cart.products = [];
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
