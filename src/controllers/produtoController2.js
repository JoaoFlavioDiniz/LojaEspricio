//importa 
const { promises } = require("dns"); // Importa o módulo 'promises' do módulo nativo 'dns' do Node.js.
                                      // NOTA: Esta importação é desnecessária, pois o 'dns' não é utilizado.

const { produtoModel } = require("../models/produtoModel"); // Importa o objeto 'produtoModel' do arquivo 'produtoModel.js'
                                                            // na pasta '../models'. Este objeto deve conter as funções
                                                            // de acesso e manipulação do banco de dados (ex: buscarTodos, buscarUm, inserirProduto).

const { error } = require("console"); // Importa a propriedade 'error' do módulo 'console'.
                                        // NOTA: Geralmente desnecessário, 'console.error' funciona diretamente.

const { default: Message } = require("tedious/lib/message"); // Importa um objeto 'Message' do driver 'tedious'.
                                                            // NOTA: Esta importação também parece ser desnecessária para a lógica do controlador.

const produtoController = { // Define o objeto 'produtoController' que agrupa todas as funções de controle (métodos HTTP) para a entidade Produto.

    // Bloco JSDoc: Documentação da função listarProdutos
    /**
     * controlador que lista todos os produtos do banco de dados
     * @async
     * @function listarProdutos
     * @param {object} req  - objeto recebido da resposta da requisicao http (Request)
     * @param {object} res - objeto recebido da resposta (enviado ao cliente http) (Response)
     * @returns {promises<void>} - retorna uma resposta JSON com a lista de produtos
     * @throws - Mostra no console e retorna o erro 500 seo ocorrer uma falha ao buscar o produtos.
     */

    listarProdutos: async (req, res) => { // Define a função assíncrona 'listarProdutos' (lida com requisições GET).
        
        try { // Início do bloco try para tentar executar o código e capturar exceções.
            const { idProduto } = req.query; // Extrai o parâmetro 'idProduto' da query string da URL (ex: /produtos?idProduto=...).

            if (idProduto){ // Verifica se um ID de produto foi fornecido.
                if(idProduto.length != 36){ // Valida se o ID tem o tamanho padrão de um GUID/UUID (36 caracteres).
                    return res.status(400).json({erro:"id do produto invalido!"}); // Se for inválido, retorna erro 400 (Bad Request).
                }

                const produto = await produtoModel.buscarUm(idProduto); // Chama a função no modelo para buscar um único produto pelo ID.

                return res.status(200).json(produto); // Retorna o produto encontrado com status 200 (OK).
            }

            const produtos = await produtoModel.buscarTodos(); // Se nenhum ID foi fornecido, chama a função para buscar todos os produtos.

            res.status(200).json(produtos); // Retorna a lista completa de produtos com status 200 (OK).

        } catch (error) { // Bloco catch: executa se ocorrer um erro durante o acesso ao BD ou outra falha.
            console.error('Erro ao listar o produto:', error); // Loga o erro detalhado no console do servidor.
            res.status(500).json({ erro: 'Erro ao buscar o produto.' }); // Retorna erro 500 (Internal Server Error) ao cliente.
        }

    }, // Fim da função listarProdutos.

    // Bloco JSDoc: Documentação da função criaProduto
    /**
     * controlador que cria um novo produto no banco de dados
     * @async
     * @function criaProduto
     * @param {object} req -  objeto de requisicao do cliente http
     * @param {object} res - objeto que recebe a resposta do cliente
     * @returns {promises<void>} - retorna uma mensagem de erro no formato json
     * @throws {400} - se algum campo obrigatorio nao for preenchido corretamente
     * @throws {500} - se ocorrer um erro interno do servidor
     * * @example
     * POST /produtos
     * BODY:
     * {
     * "nomeProduto": "camiseta",
     * "precoProduto": 49,40
     * }
     */
    criaProduto: async (req, res) => { // Define a função assíncrona 'criaProduto' (lida com requisições POST).

        try { // Início do bloco try para tratamento de erros.
            const { nomeProduto, precoProduto } = req.body; // Extrai 'nomeProduto' e 'precoProduto' do corpo (body) da requisição (geralmente JSON).
            
            // Valida se os campos obrigatórios estão ausentes ou inválidos.
            // Verifica: 1. nomeProduto ausente; 2. precoProduto ausente; 3. nomeProduto vazio; 4. precoProduto não é um número.
            if (nomeProduto == undefined || precoProduto == undefined || nomeProduto.trim() == "" || isNaN(precoProduto)) {
                return res.status(400).json({ erro: "Campos obrigatorios nao preenchido" }) // Retorna erro 400 (Bad Request).
            }

            await produtoModel.inserirProduto(nomeProduto, precoProduto); // Chama a função no modelo para inserir o novo produto no BD.

            res.status(201).json({ message: " Produto cadastrado com sucesso!" }); // Retorna status 201 (Created) e mensagem de sucesso.

        } catch (error) { // Bloco catch: executa se ocorrer um erro na inserção ou no processo.
            console.error('Erro ao cadastrar o produto:', error); // Loga o erro detalhado no console do servidor.
            res.status(500).json({ erro: 'Erro ao cadastrar o produto.' }); // Retorna erro 500 (Internal Server Error) ao cliente.

        }
    } // Fim da função criaProduto.

}

module.exports = { produtoController }; // Exporta o objeto 'produtoController' para ser usado em arquivos de rotas.