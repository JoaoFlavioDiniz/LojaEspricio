//importa 
const { promises } = require("dns");
const {produtoModel} = require ("../models/produtoModel");

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
            const produtos = await produtoModel.buscarTodos();

            res.status(200).json(produtos);

        } catch (error) {
            console.error('Erro ao listar o produto:', error);
            res.status(500).json({erro: 'Erro ao buscar o produto.'});
            
        }
        
    }

}

module.exports = {produtoController};