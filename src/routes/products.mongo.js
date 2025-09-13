// POST /api/products - Crear producto
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;
        if (!title || !description || !code || price == null || stock == null || !category) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ error: "El precio debe ser un número positivo" });
        }
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: "El stock debe ser un número positivo" });
        }
        const exists = await Product.findOne({ code });
        if (exists) return res.status(400).json({ error: "El código ya existe" });
        const product = new Product({ title, description, code, price, stock, category, thumbnails, status });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/products/:pid - Actualizar producto
router.put("/:pid", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        if (code && code !== product.code) {
            const exists = await Product.findOne({ code });
            if (exists) return res.status(400).json({ error: "El código ya existe" });
        }
        if (price !== undefined && (typeof price !== 'number' || price < 0)) {
            return res.status(400).json({ error: "El precio debe ser un número positivo" });
        }
        if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
            return res.status(400).json({ error: "El stock debe ser un número positivo" });
        }
        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (code !== undefined) product.code = code;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (category !== undefined) product.category = category;
        if (thumbnails !== undefined) product.thumbnails = thumbnails;
        if (status !== undefined) product.status = status;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const express = require("express");
const Product = require("../dao/Product.model");
const router = express.Router();

// GET /api/products con paginación, filtros y ordenamiento
router.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        const filter = {};
        if (query) {
            // Buscar por categoría o disponibilidad
            if (query.startsWith("category:")) {
                filter.category = query.split(":")[1];
            } else if (query.startsWith("status:")) {
                filter.status = query.split(":")[1] === "true";
            } else {
                // Búsqueda general por título
                filter.title = { $regex: query, $options: "i" };
            }
        }
        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
        const result = await Product.paginate(filter, {
            limit,
            page,
            sort: sortOption
        });
        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

module.exports = router;
