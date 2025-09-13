// Rutas para productos
const express = require("express");
const router = express.Router();
const { ProductManager } = require("../dao/ProductManager");
const { io } = require("../app");

ProductManager.rutaDatos = "./src/data/products.json";

// GET /api/products/ - Listar todos los productos
router.get("/", async (req, res) => {
    try {
        const productos = await ProductManager.getProducts();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos", details: error.message });
    }
});

// GET /api/products/:pid - Traer producto por id
router.get("/:pid", async (req, res) => {
    try {
        const producto = await ProductManager.getProductById(req.params.pid);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener producto", details: error.message });
    }
});

// POST /api/products/ - Agregar producto
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || price == null || status == null || stock == null || !category) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
        const nuevo = await ProductManager.addProduct({ title, description, code, price, status, stock, category, thumbnails: thumbnails || [] });
        // Emitir actualización a todos los clientes
        const productos = await ProductManager.getProducts();
        io.emit("updateProducts", productos);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto", details: error.message });
    }
});

// PUT /api/products/:pid - Actualizar producto
router.put("/:pid", async (req, res) => {
    try {
        const actualizado = await ProductManager.updateProduct(req.params.pid, req.body);
        if (!actualizado) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar producto", details: error.message });
    }
});

// DELETE /api/products/:pid - Eliminar producto
router.delete("/:pid", async (req, res) => {
    try {
        const eliminado = await ProductManager.deleteProduct(req.params.pid);
        if (!eliminado) return res.status(404).json({ error: "Producto no encontrado" });
        // Emitir actualización a todos los clientes
        const productos = await ProductManager.getProducts();
        io.emit("updateProducts", productos);
        res.json({ status: "ok" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar producto", details: error.message });
    }
});

module.exports = router;
