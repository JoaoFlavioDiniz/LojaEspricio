const express = require("express");
const app = express();

require('dotenv').config(); //fazer injecao de dependencia

const { produtoRoutes } = require("./src/routes/produtoRoutes");
const { clienteRoutes } = require("./src/routes/clienteRoutes");

const PORT = process.env.PORT; //SUBSTITUIR A PORTA 8081...E;LA ESTA DECLARADA NO .ENV

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use('/', produtoRoutes);
app.use('/', clienteRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});