//chamar o express
const express = require("express");
const router = express.Router();
const {clienteController} = require ("../controllers/clienteController");

router.get("/clientes", clienteController.listarCliente);

router.post("/clientes", clienteController.inserirCliente);

router.put("/clientes/:idCliente", clienteController.atualizarCliente);

module.exports = {clienteRoutes: router};