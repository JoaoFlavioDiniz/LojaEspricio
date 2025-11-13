const { promises } = require("dns"); // Importa o módulo 'promises' do módulo nativo 'dns' do Node.js.
                                      // NOTA: Esta importação é desnecessária e não utilizada.

const { sql, getConnection } = require("../config/db"); // Importa o objeto 'sql' (o driver mssql) e a função 'getConnection' 
                                                        // do arquivo de configuração do banco de dados (provavelmente em '../config/db').

const { query } = require("mssql"); // Importa a propriedade 'query' do módulo 'mssql'.
                                    // NOTA: Esta importação é redundante, pois a função 'query' é acessada via pool.request().

const clienteModel = { // Define o objeto 'clienteModel', que contém as funções de acesso ao banco de dados (CRUD).

    // Bloco JSDoc: Documentação da função buscarTodos
    /**
     * busca todos os clientes
     * @async
     * @function buscarTodos
     * @returns {promises<Array>} retorna uma lista com todos os clientes
     * @throws mostra no console e propaga o erro caso a busca falhe.
     */

    //fazer uma busca completa em clientes
    buscarTodos: async () => { // Define a função assíncrona para buscar todos os clientes.
        try { // Início do bloco try-catch.
            const pool = await getConnection(); // Aguarda e obtém uma pool de conexão ativa do SQL Server.

            const querySQL = 'SELECT * FROM Clientes'; // Define a consulta SQL para selecionar todos os registros da tabela Clientes.
            
            const result = await pool.request() // Inicia uma nova requisição na pool de conexões.
                .query(querySQL); // Executa a consulta SQL definida.

            return result.recordset; // Retorna o array de registros (dados dos clientes) resultantes da consulta.
        } catch (error) { // Bloco catch: Captura erros na execução da conexão ou consulta.

            console.error("Erro ao buscar o Cliente:", error); // Loga o erro detalhado no console do servidor.
            throw error; // Propaga o erro (reverte) para a função que chamou 'buscarTodos', permitindo que o Controller trate a exceção.
        }
    }, // Fim da função buscarTodos.

    // Início da função buscarUm (Busca por ID)
    buscarUm: async (idCliente) => { // Define a função assíncrona que recebe o ID do cliente como argumento.
        try {
            const pool = await getConnection(); // Obtém a conexão.
            
            //evitar sql injection @idProduto (Comentário correto, a prevenção é feita na próxima linha via .input)
            const querySQL = ` // Define a consulta SQL usando um placeholder (@idCliente) para o parâmetro.
            SELECT * FROM Clientes 
            WHERE idCliente = @idCliente 
            `;

            const result = await pool.request()
                .input(`idCliente`, sql.UniqueIdentifier, idCliente) // Define o parâmetro de entrada (@idCliente) com o valor e o tipo de dado SQL (UniqueIdentifier, que geralmente é um GUID).
                .query(querySQL); // Executa a consulta, substituindo @idCliente pelo valor seguro.

            return result.recordset; // Retorna o registro do cliente encontrado.

        } catch (error) {
            console.error("Erro ao buscar o cliente:", error); // Loga o erro.
            throw error; // Propaga o erro.
        }

    }, // Fim da função buscarUm.

    // Início da função buscarCPF (Busca por CPF)
    buscarCPF: async (cpfCliente) => { // Define a função assíncrona que recebe o CPF do cliente.

        try {
            const pool = await getConnection();// Obtém a conexão.
            
            //evitar sql injection @cpfCliente (Comentário correto)
            const querySQL = ` // Define a consulta SQL usando placeholder para o CPF.
            SELECT * FROM Clientes
            WHERE cpfCliente = @cpfCliente         
            `;
            
            const result = await pool.request()
                .input(`cpfCliente`, sql.Char(11), cpfCliente) // Define o parâmetro de entrada (@cpfCliente) com o tipo de dado SQL Char(11).
            .query(querySQL); // Executa a consulta.

            return result.recordset; // Retorna o(s) registro(s) do cliente com o CPF encontrado.
        } catch (error) {
            console.error("Erro ao buscar o cliente:", error); // Loga o erro.
            throw error; // Propaga o erro.
        }
    }, // Fim da função buscarCPF.

    // Bloco JSDoc: Documentação da função inserirCliente
    /**
     * * @async
     * @function inserirCliente
     * @param {string} nomeCliente 
     * @param {number} cpfCliente 
     * @returns {promises<void>} //nao retorna nada apenas executa a insercao
     * @throws // mostra no console e propaga o erro caso a funcao falhe
     */

    inserirCliente: async (nomeCliente, cpfCliente) => { // Define a função assíncrona para inserir um novo cliente.

        //inserir dados do cliente
        try {
            const pool = await getConnection(); // Obtém a conexão.

            const querySQL = `INSERT INTO Clientes (nomeCliente, cpfCliente) // Define a instrução INSERT.
            VALUES (@nomeCliente, @cpfCliente) // Usa placeholders para os valores a serem inseridos de forma segura.
            `
            await pool.request()
                .input("nomeCliente", sql.VarChar(100), nomeCliente) // Define o parâmetro @nomeCliente com o tipo VarChar(100).
                .input("cpfCliente", sql.Char(11), cpfCliente) // Define o parâmetro @cpfCliente com o tipo Char(11).
                .query(querySQL); // Executa a inserção. Como é um INSERT, não há retorno de dados (recordset).

        } catch (error) {
            console.error("Erro ao inserir do cliente:", error); // Loga o erro.
            throw error; // Propaga o erro para o controlador.
        }

    } // Fim da função inserirCliente.

};

module.exports = { clienteModel }; // Exporta o objeto 'clienteModel' para que ele possa ser usado por Controllers.