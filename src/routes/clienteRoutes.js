//chamar o express
const express = require("express");
const router = express.Router();
const {clienteController} = require ("../controllers/clienteController");

router.get("/clientes", clienteController.listarCliente);

router.post("/clientes", clienteController.inserirCliente);

router.put("/clientes/:idCliente", clienteController.atualizarCliente);

router.delete("/clientes/:idCliente", clienteController.deletarCliente);

module.exports = {clienteRoutes: router};