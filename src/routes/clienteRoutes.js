//chamar o express
const express = require("express");
const router = express.Router();
const {clienteController} = require ("../controllers/clienteController");

router.get("/clientes", clienteController.listarCliente);

router.post("/clientes", clienteController.inserirCliente);

module.exports = {clienteRoutes: router};