//chamar o express
const express = require("express"); // Importa o framework Express, a biblioteca principal para construir a aplicação web.

const router = express.Router(); // Cria uma nova instância de um objeto Router do Express.
                                  // Este objeto permite definir rotas de forma modular, que serão anexadas à aplicação principal.

const {produtoController} = require ("../controllers/produtoController"); // Importa o objeto 'produtoController',
                                                                        // que contém as funções de manipulação de produtos (listar, criar, etc.),
                                                                        // a partir do diretório '../controllers'.

// Define uma rota GET. Quando a aplicação recebe uma requisição HTTP GET para o caminho '/produtos',
// o Express executa a função 'listarProdutos' contida no 'produtoController'.
router.get("/produtos", produtoController.listarProdutos);

// Define uma rota POST. Quando a aplicação recebe uma requisição HTTP POST para o caminho '/produtos',
// o Express executa a função 'criaProduto' contida no 'produtoController'.
router.post("/produtos", produtoController.criaProduto);

module.exports = {produtoRoutes: router}; // Exporta o objeto Router configurado (agora chamado 'produtoRoutes')
                                          // para que possa ser importado e usado pelo arquivo de inicialização da aplicação (app.js ou server.js).