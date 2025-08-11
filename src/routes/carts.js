// Rutas para carritos
const express = require("express");
const router = express.Router();
const { CartManager } = require("../dao/CartManager");

CartManager.rutaDatos = "./src/data/carts.json";

// POST /api/carts/ - Crear nuevo carrito
router.post("/", async (req, res) => {
    const nuevo = await CartManager.addCart();
    res.status(201).json(nuevo);
});

// GET /api/carts/:cid - Listar productos de un carrito
router.get("/:cid", async (req, res) => {
    const carrito = await CartManager.getCartById(req.params.cid);
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(carrito.products);
});

// POST /api/carts/:cid/product/:pid - Agregar producto a carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const carrito = await CartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(carrito);
});

module.exports = router;
