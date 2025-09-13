// Rutas para carritos
const express = require("express");
const router = express.Router();
const { CartManager } = require("../dao/CartManager");

CartManager.rutaDatos = "./src/data/carts.json";

// POST /api/carts/ - Crear nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevo = await CartManager.addCart();
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: "Error al crear carrito", details: error.message });
    }
});

// GET /api/carts/:cid - Listar productos de un carrito
router.get("/:cid", async (req, res) => {
    try {
        const carrito = await CartManager.getCartById(req.params.cid);
        if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(carrito.products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener carrito", details: error.message });
    }
});

// POST /api/carts/:cid/product/:pid - Agregar producto a carrito
const { ProductManager } = require("../dao/ProductManager");
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        // Validar que exista el carrito
        const carrito = await CartManager.getCartById(req.params.cid);
        if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });
        // Validar que exista el producto
        const producto = await ProductManager.getProductById(req.params.pid);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
        // Agregar producto al carrito
        const actualizado = await CartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito", details: error.message });
    }
});

module.exports = router;
