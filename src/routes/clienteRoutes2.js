//chamar o express
const express = require("express"); // Importa o framework Express para dentro da aplicação.

const router = express.Router(); // Cria uma nova instância de um objeto Router do Express.
                                  // Este objeto é usado para definir rotas modulares e independentes.

const {clienteController} = require ("../controllers/clienteController"); // Importa o objeto 'clienteController'
                                                                        // que contém a lógica de manipulação de clientes (listagem, inserção, etc.)
                                                                        // a partir do diretório '../controllers'.

// Define uma rota GET. Quando a aplicação recebe uma requisição HTTP GET para o caminho '/clientes',
// ela executa a função 'listarCliente' contida no objeto 'clienteController'.
router.get("/clientes", clienteController.listarCliente);

// Define uma rota POST. Quando a aplicação recebe uma requisição HTTP POST para o caminho '/clientes',
// ela executa a função 'inserirCliente' contida no objeto 'clienteController'.
router.post("/clientes", clienteController.inserirCliente);

module.exports = {clienteRoutes: router}; // Exporta o objeto Router recém-configurado (com as rotas de cliente)
                                          // sob o nome 'clienteRoutes', para que possa ser importado e usado pelo arquivo principal da aplicação (geralmente 'server.js' ou 'app.js').