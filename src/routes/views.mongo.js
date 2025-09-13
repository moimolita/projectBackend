const express = require("express");
const Product = require("../dao/Product.model");
const router = express.Router();

// Vista paginada de productos
router.get("/products", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        const filter = {};
        if (query) {
            if (query.startsWith("category:")) {
                filter.category = query.split(":")[1];
            } else if (query.startsWith("status:")) {
                filter.status = query.split(":")[1] === "true";
            } else {
                filter.title = { $regex: query, $options: "i" };
            }
        }
        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
        const result = await Product.paginate(filter, {
            limit,
            page,
            sort: sortOption
        });
        res.render("index", {
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}` : null
        });
    } catch (error) {
        res.status(500).send("Error al cargar productos");
    }
});

// Vista detalle de producto
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).send("Producto no encontrado");
        res.render("productDetail", { product });
    } catch (error) {
        res.status(500).send("Error al cargar producto");
    }
});

module.exports = router;
