//importa 
const { promises } = require("dns");
const { clienteModel } = require("../models/clienteModel");
const { error } = require("console");
const { default: Message } = require("tedious/lib/message");


const clienteController = {

    /**
     * @async
     * @function listarCliente
     * @param {object} req - objeto recebido da resposta da requisicao http
     * @param {object} res - objeto recebido da resposta (enviado ao cliente http)
     * @returns {promises<void>}- retorna uma resposta JSON com a lista de clientes
     * @throws Mostra no console e retorna o erro 500 seo ocorrer uma falha ao buscar o produtos.
     */

    listarCliente: async (req, res) => {

        try {
            const { idCliente } = req.query;

            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: "id do cliente invalido!" });

                }

                const cliente = await clienteModel.buscarUm(idCliente);

                return res.status(200).json(cliente);
            }

            const clientes = await clienteModel.buscarTodos();

            res.status(200).json(clientes);

        } catch (error) {
            console.error('Erro ao listar o cliente:', error);
            res.status(500).json({ erro: 'Erro ao localizar o cliente.' });

        }

    },

    /**
     * controlador que insere um novo cliente no banco de dados
     * @async
     * @function inserirCliente
     * @param {object} req -  objeto de requisicao do cliente http
     * @param {object} res - objeto que recebe a resposta do cliente
     * @returns {promises<void>} - retorna uma mensagem de erro no formato json
     * @throws {400} - se algum campo obrigatorio nao for preenchido corretamente
     * @throws {500} - se ocorrer um erro interno do servidor
     * 
     * @example
     * POST /clientes
     * BODY:
     * {
     * "nomeCliente": "Joao Flavio",
     * "cpfCliente": 12345678901
     * }
     */


    inserirCliente: async (req, res) => {


        try {
            const { nomeCliente, cpfCliente } = req.body;
            
            if (nomeCliente == undefined || cpfCliente == undefined || nomeCliente.trim() == "" || isNaN(cpfCliente)) {
                return res.status(400).json({ erro: "Campos obrigatorios nao preenchido" })
            }

            await clienteModel.inserirCliente(nomeCliente, cpfCliente);

            res.status(201).json({ message: " Cliente cadastrado com sucesso!" });

        } catch (error) {
            console.error('Erro ao cadastrar o  cliente:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar o cliente.' });

        }
    }

};

module.exports = { clienteController };