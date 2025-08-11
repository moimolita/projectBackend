//const fs = require("fs")
//const colors = require ("colors")

//console.log ('Prueba de color rojo' .red)
//console.log ('Prueba de color multicolor' .rainbow)

const express = require("express");
const { UserManager } = require("./dao/UserManager.js");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const PORT = 8080;
const app = express();
UserManager.rutaDatos = "./data/usuarios.json";

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
    res.send("Bienvenidos al server...!!!");
});

app.listen(PORT, () => {
    console.log(`Server on line en puerto ${PORT}`);
});