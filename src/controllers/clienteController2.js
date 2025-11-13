//importa 
const { promises } = require("dns"); // Importa o módulo 'promises' do módulo nativo 'dns' do Node.js.
                                      // NOTA: Esta importação é desnecessária e não usada no código.

const { clienteModel } = require("../models/clienteModel"); // Importa o objeto 'clienteModel' do arquivo 'clienteModel'
                                                            // localizado na pasta 'models'. Este objeto contém as funções
                                                            // de acesso e manipulação do banco de dados (BD).

const { error } = require("console"); // Importa a propriedade 'error' do módulo 'console'.
                                        // NOTA: Geralmente desnecessário, pois 'console.error' funciona diretamente.

const { default: Message } = require("tedious/lib/message"); // Importa o objeto 'Message' do driver 'tedious' (usado pelo 'mssql').
                                                            // NOTA: Esta importação também parece ser desnecessária para a lógica do controlador.


const clienteController = { // Define o objeto principal 'clienteController', que agrupa todas as funções de controle de rotas.

    // Bloco JSDoc: Documentação da função listarCliente
    /**
     * @async
     * @function listarCliente
     * @param {object} req - objeto recebido da resposta da requisicao http
     * @param {object} res - objeto recebido da resposta (enviado ao cliente http)
     * @returns {promises<void>}- retorna uma resposta JSON com a lista de clientes
     * @throws Mostra no console e retorna o erro 500 seo ocorrer uma falha ao buscar o produtos.
     */

    listarCliente: async (req, res) => { // Define a função assíncrona 'listarCliente' para lidar com requisições GET de clientes.

        try { // Início do bloco try para tratamento de erros durante a execução.
            const { idCliente } = req.query; // Extrai a variável 'idCliente' da query string da URL (ex: /clientes?idCliente=...).

            if (idCliente) { // Verifica se o parâmetro 'idCliente' foi fornecido na requisição.
                if (idCliente.length != 36) { // Verifica se o ID fornecido tem o tamanho de 36 caracteres (padrão de um GUID/UUID).
                    return res.status(400).json({ erro: "id do cliente invalido!" }); // Se o tamanho for inválido, retorna erro 400 (Bad Request).
                }

                const cliente = await clienteModel.buscarUm(idCliente); // Chama a função no modelo para buscar um cliente específico pelo ID.
                return res.status(200).json(cliente); // Retorna o cliente encontrado com status 200 (OK).
            }

            const clientes = await clienteModel.buscarTodos(); // Se 'idCliente' não foi fornecido, chama a função para buscar todos os clientes.
            res.status(200).json(clientes); // Retorna a lista completa de clientes com status 200 (OK).

        } catch (error) { // Bloco catch: executa se ocorrer qualquer erro durante o try.
            console.error('Erro ao listar o cliente:', error); // Loga o erro detalhado no console do servidor.
            res.status(500).json({ erro: 'Erro interno ao localizar o cliente.' }); // Retorna erro 500 (Internal Server Error) ao cliente.
        }

    }, // Fim da função listarCliente.

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
     * "cpfCliente": 12345678901
     * }
     */

    inserirCliente: async (req, res) => { // Define a função assíncrona 'inserirCliente' para lidar com requisições POST.

        try { // Início do bloco try para tratamento de erros.
            const { nomeCliente, cpfCliente } = req.body; // Extrai as variáveis 'nomeCliente' e 'cpfCliente' do corpo (body) da requisição HTTP (JSON).

            // Verifica se os campos obrigatórios estão ausentes (undefined) ou se o nome está vazio após remover espaços (trim()).
            if (nomeCliente == undefined || cpfCliente == undefined || nomeCliente.trim() == "") {
                return res.status(400).json({ erro: "Campos obrigatorios nao preenchido" }) // Retorna erro 400 (Bad Request) se faltar dados.
            }

            const cliente = await clienteModel.buscarCPF(cpfCliente); // Chama a função no modelo para verificar se o CPF já existe no BD.
            
            // se o cpf for maior que zero, ele busca na variavel cpfCliente se e o mesmo cpf
            if (cliente.length > 0) { // Verifica se a consulta retornou algum cliente (cliente.length > 0 indica que o CPF existe).
                return res.status(409).json({ erro: "CPF ja esta cadastrado" })   // Retorna erro 409 (Conflict), indicando que o recurso (CPF) já existe.
            }

            await clienteModel.inserirCliente(nomeCliente, cpfCliente); // Chama a função no modelo para inserir o novo cliente no BD.

            res.status(201).json({ message: " Cliente cadastrado com sucesso!" }); // Retorna status 201 (Created) e uma mensagem de sucesso.

        } catch (error) { // Bloco catch: executa se ocorrer qualquer erro interno.
            console.error('Erro ao cadastrar o sr cliente:', error); // Loga o erro detalhado no console do servidor.
            res.status(500).json({ erro: 'Erro ao cadastrar o sr cliente.' }); // Retorna erro 500 (Internal Server Error) ao cliente.
        }
    } // Fim da função inserirCliente.
};

module.exports = { clienteController }; // Exporta o objeto 'clienteController' para ser usado como módulo em outros arquivos (e.g., rotas).