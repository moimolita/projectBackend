// CartManager para manejar carritos con persistencia en carts.json
const fs = require("fs");

class CartManager {
    static rutaDatos = "";

    static async getCarts() {
        if (fs.existsSync(this.rutaDatos)) {
            return JSON.parse(await fs.promises.readFile(this.rutaDatos, "utf-8"));
        } else {
            return [];
        }
    }

    static async getCartById(id) {
        const carritos = await this.getCarts();
        return carritos.find(c => c.id == id) || null;
    }

    static async addCart() {
        const carritos = await this.getCarts();
        let id = 1;
        if (carritos.length > 0) {
            id = Math.max(...carritos.map(c => Number(c.id))) + 1;
        }
        const nuevoCarrito = { id, products: [] };
        carritos.push(nuevoCarrito);
        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(carritos, null, 2));
        return nuevoCarrito;
    }

    static async addProductToCart(cid, pid) {
        const carritos = await this.getCarts();
        const idx = carritos.findIndex(c => c.id == cid);
        if (idx === -1) return null;
        const carrito = carritos[idx];
        const prodIdx = carrito.products.findIndex(p => p.product == pid);
        if (prodIdx === -1) {
            carrito.products.push({ product: pid, quantity: 1 });
        } else {
            carrito.products[prodIdx].quantity += 1;
        }
        carritos[idx] = carrito;
        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(carritos, null, 2));
        return carrito;
    }
}

module.exports = { CartManager };
