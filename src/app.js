//const fs = require("fs")
//const colors = require ("colors")

//console.log ('Prueba de color rojo' .red)
//console.log ('Prueba de color multicolor' .rainbow)

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const { UserManager } = require("./dao/UserManager.js");
const productsRouter = require("./routes/products.mongo");
const cartsRouter = require("./routes/carts.mongo");
const viewsRouter = require("./routes/views.mongo");


const PORT = 8080;
const MONGO_URI = "mongodb://localhost:27017/ecommerce";
const mongoose = require("mongoose");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
module.exports.io = io;
UserManager.rutaDatos = "./data/usuarios.json";

// Conexión a MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error de conexión a MongoDB", err));


app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
const cartViewRouter = require("./routes/cartView.mongo");
app.use("/", cartViewRouter);


// WebSocket para productos en tiempo real
const { ProductManager } = require("./dao/ProductManager");
ProductManager.rutaDatos = "./src/data/products.json";
io.on("connection", (socket) => {
    socket.on("newProduct", async (data) => {
        await ProductManager.addProduct(data);
        const productos = await ProductManager.getProducts();
        io.emit("updateProducts", productos);
    });
    socket.on("deleteProduct", async (id) => {
        await ProductManager.deleteProduct(id);
        const productos = await ProductManager.getProducts();
        io.emit("updateProducts", productos);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server on line en puerto ${PORT}`);
});