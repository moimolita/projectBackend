const express = require("express");
const Cart = require("../dao/Cart.model");
const router = express.Router();

// Vista de carrito
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.render("cart", { products: cart.products, cartId: cart._id });
    } catch (error) {
        res.status(500).send("Error al cargar carrito");
    }
});

module.exports = router;
