// Importa a biblioteca de criptografia
// Necessário instalar antes: npm install bcrypt
const bcrypt = require('bcrypt'); 
const { promises } = require("dns");

const { clienteModel } = require("../models/clienteModel");

const { error } = require("console");
const { default: Message } = require("tedious/lib/message");

const clienteController = {

    /**
     * @async
     * @function listarCliente
     * ... (código do listarCliente permanece igual) ...
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



// Bloco JSDoc: Documentação da função inserirCliente
    /**
     * controlador que insere um novo cliente no banco de dados
     * @async
     * @function inserirCliente
     * @param {object} req -  objeto de requisicao do cliente http
     * @param {object} res - objeto que recebe a resposta do cliente
     * @returns {promises<void>} - retorna uma mensagem de erro no formato json
     * @throws {400} - se algum campo obrigatorio nao for preenchido corretamente
     * @throws {500} - se ocorrer um erro interno do servidor
     * * @example
     * POST /clientes
     * BODY:
     * {
     * "nomeCliente": "Joao Flavio",
     * "cpfCliente": 12345678901,
	 * "emailCliente": "jfdz@hotmail.com",
	 * "senhaEmail": "seila@123"
     * }
     */
	 	 	 
	 
    /**
     * Controlador que insere um novo cliente no banco de dados com senha criptografada
     */
    inserirCliente: async (req, res) => {

        try {
            // 1. Recebe email e senha do corpo da requisição
            const { nomeCliente, cpfCliente, emailCliente, senhaCliente } = req.body;

            // 2. Validação: Garante que senha e email foram enviados
            if (!nomeCliente || !cpfCliente || !emailCliente || !senhaCliente) {
                return res.status(400).json({ erro: "Campos obrigatorios (nome, cpf, email, senha) não preenchidos" });
            }

            // Verifica se o CPF já existe
            const clienteExistente = await clienteModel.buscarCPF(cpfCliente);
            if (clienteExistente.length > 0) {
                return res.status(409).json({ erro: "CPF ja esta cadastrado" });
            }

            // 3. CRIPTOGRAFIA DA SENHA (HASH)
            const saltRounds = 10; // Custo do processamento (segurança padrão)
            const hashSenha = await bcrypt.hash(senhaCliente, saltRounds);

            // 4. Envia para o Model (Passando o HASH, não a senha pura)
            // Nota: O Model deve estar preparado para receber 4 argumentos.
            await clienteModel.inserirCliente(nomeCliente, cpfCliente, emailCliente, hashSenha);

            res.status(201).json({ message: "Cliente cadastrado com sucesso!" });

        } catch (error) {
            console.error('Erro ao cadastrar o cliente:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar o cliente.' });
        }
    }
};

module.exports = { clienteController };