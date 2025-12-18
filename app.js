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
// ... outras importações
app.use(express.static('public')); // Serve a pasta 'public'
app.use(express.json());
// ... resto do código

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});