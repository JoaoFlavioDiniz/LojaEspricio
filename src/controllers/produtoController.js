//importa 
const { promises } = require("dns");
const { produtoModel } = require("../models/produtoModel");
const { error } = require("console");
const { default: Message } = require("tedious/lib/message");

const produtoController = {

    /**
     * controlador que lista todos os produtos do banco de dados
     * @async
     * @function listarProdutos
     * 
     * 
     * @param {object} req  - objeto recebido da resposta da requisicao http
     * @param {object} res - objeto recebido da resposta (enviado ao cliente http)
     * @returns {promises<void>} - retorna uma resposta JSON com a lista de produtos
     * @throws - Mostra no console e retorna o erro 500 seo ocorrer uma falha ao buscar o produtos.
     *  
     */

    listarProdutos: async (req, res) => {
        
        try {
            const { idProduto } = req.query;

            if (idProduto){
                if(idProduto.length != 36){
                    return res.status(400).json({erro:"id do produto invalido!"});


                }

                const produto = await produtoModel.buscarUm(idProduto);

                return res.status(200).json(produto);
            }


            const produtos = await produtoModel.buscarTodos();

            res.status(200).json(produtos);

        } catch (error) {
            console.error('Erro ao listar o produto:', error);
            res.status(500).json({ erro: 'Erro ao buscar o produto.' });

        }

    },

    /**
     * controlador que cria um novo produto no banco de dados
     * @async
     * @function criaProduto
     * @param {object} req -  objeto de requisicao do cliente http
     * @param {object} res - objeto que recebe a resposta do cliente
     * @returns {promises<void>} - retorna uma mensagem de erro no formato json
     * @throws {400} - se algum campo obrigatorio nao for preenchido corretamente
     * @throws {500} - se ocorrer um erro interno do servidor
     * 
     * @example
     * POST /produtos
     * BODY:
     * {
     * "nomeProduto": "camiseta",
     * "precoProduto": 49,40
     * }
     */
    criaProduto: async (req, res) => {


        try {
            const { nomeProduto, precoProduto } = req.body;
            
            if (nomeProduto == undefined || precoProduto == undefined || nomeProduto.trim() == "" || isNaN(precoProduto)) {
                return res.status(400).json({ erro: "Campos obrigatorios nao preenchido" })
            }

            await produtoModel.inserirProduto(nomeProduto, precoProduto);

            res.status(201).json({ message: " Produto cadastrado com sucesso!" });

        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar o produto.' });

        }
    }

}

module.exports = { produtoController };