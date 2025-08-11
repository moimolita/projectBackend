// ProductManager para manejar productos con persistencia en products.json
const fs = require("fs");

class ProductManager {
    static rutaDatos = "";

    static async getProducts() {
        if (fs.existsSync(this.rutaDatos)) {
            return JSON.parse(await fs.promises.readFile(this.rutaDatos, "utf-8"));
        } else {
            return [];
        }
    }

    static async getProductById(id) {
        const productos = await this.getProducts();
        return productos.find(p => p.id == id) || null;
    }

    static async addProduct(producto) {
        const productos = await this.getProducts();
        let id = 1;
        if (productos.length > 0) {
            id = Math.max(...productos.map(p => Number(p.id))) + 1;
        }
        const nuevoProducto = { id, ...producto };
        productos.push(nuevoProducto);
        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(productos, null, 2));
        return nuevoProducto;
    }

    static async updateProduct(id, campos) {
        const productos = await this.getProducts();
        const idx = productos.findIndex(p => p.id == id);
        if (idx === -1) return null;
        const producto = productos[idx];
        const actualizado = { ...producto, ...campos };
        actualizado.id = producto.id; // No se actualiza el id
        productos[idx] = actualizado;
        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(productos, null, 2));
        return actualizado;
    }

    static async deleteProduct(id) {
        let productos = await this.getProducts();
        const inicial = productos.length;
        productos = productos.filter(p => p.id != id);
        if (productos.length === inicial) return false;
        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(productos, null, 2));
        return true;
    }
}

module.exports = { ProductManager };
