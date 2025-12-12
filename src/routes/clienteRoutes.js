//chamar o express
const express = require("express");
const router = express.Router();
const {clienteController} = require ("../controllers/clienteController");
const {authController} = require("../controllers/authController");
const {verify} = require("../middlewares/authMiddleware");


router.post("/clientes/login", authController.clienteLogin);

router.get("/clientes", verify.cliente, clienteController.listarCliente);

router.post("/clientes", clienteController.inserirCliente);

router.put("/clientes/:idCliente", clienteController.atualizarCliente);

router.delete("/clientes/:idCliente", clienteController.deletarCliente);

module.exports = {clienteRoutes: router};