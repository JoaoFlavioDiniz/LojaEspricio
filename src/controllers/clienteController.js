//importa 
const { promises } = require("dns");
const { clienteModel } = require("../models/clienteModel");
const { error } = require("console");
const { default: Message } = require("tedious/lib/message");

const bcrypt = require('bcrypt'); 

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
            res.status(500).json({ erro: 'Erro interno ao localizar o cliente.' });
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
            const { nomeCliente, cpfCliente, emailCliente, senhaCliente } = req.body;

            if (nomeCliente == undefined || cpfCliente == undefined || nomeCliente.trim() == "" || emailCliente == undefined || emailCliente.trim() == "" || 
             senhaCliente == undefined || senhaCliente.trim() == "" ) {
                return res.status(400).json({ erro: "Campos obrigatorios nao preenchido" })
            }

            const cliente = await clienteModel.buscarCPF(cpfCliente);
// se o cpf for maior que zero, ele busca na variavel cpfCliente se e o mesmo cpf
            if (cliente.length > 0) {
                return res.status(409).json({ erro: "CPF ja esta cadastrado" })   //409 recurso existente neste caso o cpf
            }

            // 3. CRIPTOGRAFIA DA SENHA (HASH)
                        const saltRounds = 10; // Custo do processamento (segurança padrão)
                        const hashSenha = await bcrypt.hash(senhaCliente, saltRounds);

            await clienteModel.inserirCliente(nomeCliente, cpfCliente, emailCliente, hashSenha);// guadar o hash e n'ao a senha

            res.status(201).json({ message: " Cliente cadastrado com sucesso!" });

        } catch (error) {
            console.error('Erro ao cadastrar o sr cliente:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar o sr cliente.' });
        }
    },

    atualizarCliente: async (req, res) => {

        try {
            const { idCliente } = req.params;
            const { nomeCliente, cpfCliente, emailCliente, senhaCliente } = req.body;

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: 'id do cliente invalido' });
            }

       
            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(401).json({ erro: 'Cliente nao encontrado!' });
            }

            const clienteAtual = cliente[0];

            const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente;
            const cpfAtualizado = cpfCliente ?? clienteAtual.cpfCliente;
            const emailAtualizado = emailCliente ?? clienteAtual.emailCliente;
            const senhaAtualizada = senhaCliente ?? clienteAtual.senhaCliente;

                  // 3. CRIPTOGRAFIA DA SENHA (HASH)
                        const saltRounds = 10; // Custo do processamento (segurança padrão)
                        const hashSenha = await bcrypt.hash(senhaCliente, saltRounds);

            await clienteModel.atualizarCliente(idCliente, nomeAtualizado, cpfAtualizado, emailAtualizado, hashSenha);

            res.status(200).json({ mensagem: 'Cliente atualizado com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar o cliente:', error);
            res.status(500).json({ erro: 'Erro ao atualizar o cliente.' });
        }

    },

    deletarCliente: async (req, res) => {

        try {

            const { idCliente } = req.params;

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: 'id do cliente é invalido' });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(401).json({ erro: 'cliente nao encontrado!' });
            }
            
            await clienteModel.deletarCliente(idCliente);

             res.status(200).json({ mensagem: 'cliente deletado com sucesso!' });

        } catch (error) {
            console.error('Erro ao deletar o cliente:', error);
            res.status(500).json({ erro: 'Erro ao deletar o cliente.' });
        }

    }

};

module.exports = { clienteController };