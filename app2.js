const express = require("express"); // Importa o framework Express, a biblioteca principal para construir a API.

const app = express(); // Cria uma instância da aplicação Express. 'app' é o objeto central para configurar rotas, middlewares e o servidor.

const { produtoRoutes } = require("./src/routes/produtoRoutes"); // Importa o módulo de rotas específico para a entidade 'Produto',
                                                                 // localizado em './src/routes/produtoRoutes'.

const { clienteRoutes } = require("./src/routes/clienteRoutes"); // Importa o módulo de rotas específico para a entidade 'Cliente',
                                                                 // localizado em './src/routes/clienteRoutes'.

const PORT = 8081; // Define uma constante para a porta de rede em que o servidor irá escutar as requisições (neste caso, 8081).

// --- Configuração de Middlewares ---

app.use(express.json()); // Configura o Express para usar o middleware 'express.json()'.
                          // Isso garante que o corpo (body) de requisições POST ou PUT com formato JSON seja
                          // corretamente parseado e disponibilizado em 'req.body'.

app.use('/', produtoRoutes); // Anexa as rotas do módulo 'produtoRoutes' ao caminho base '/'.
                             // Por exemplo, a rota GET "/produtos" definida no router será acessível em http://localhost:8081/produtos.

app.use('/', clienteRoutes); // Anexa as rotas do módulo 'clienteRoutes' ao caminho base '/'.
                             // Por exemplo, a rota GET "/clientes" definida no router será acessível em http://localhost:8081/clientes.

// --- Inicialização do Servidor ---

app.listen(PORT, () => { // Inicia o servidor Express para que ele comece a escutar requisições na porta definida (8081).
    console.log(`Servidor rodando em http://localhost:${PORT}`); // Função de callback executada assim que o servidor é iniciado com sucesso.
});