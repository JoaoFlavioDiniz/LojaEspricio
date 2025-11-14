//chamar o express
const express = require("express");
const router = express.Router();
const {produtoController} = require ("../controllers/produtoController");

router.get("/produtos", produtoController.listarProdutos);

router.post("/produtos", produtoController.criaProduto);

router.put("/produtos/:idProduto", produtoController.atualizarProduto);

module.exports = {produtoRoutes: router};

