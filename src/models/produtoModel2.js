//module.exports = {sql, getConnection}; e a forma correta de exportar para que o sql e o getconnection aparecam caixinha
// Este comentário é um lembrete sobre a sintaxe correta para exportar múltiplos itens de um módulo (que seria usado no arquivo '../config/db').

const { promises } = require("dns"); // Importa o módulo 'promises' do módulo nativo 'dns' do Node.js.
                                      // NOTA: Esta importação é desnecessária e não usada no código.

const {sql, getConnection} = require("../config/db"); // Importa o objeto 'sql' (o driver mssql) e a função 'getConnection' 
                                                      // de um arquivo de configuração de banco de dados localizado em '../config/db'.

const produtoModel = { // Define o objeto principal 'produtoModel', que contém todas as funções de interação com o BD para a tabela 'Produtos'.

    // Bloco JSDoc: Documentação da função buscarTodos
    /**
     * busca todos os produtos
     * @async
     * @function buscarTodos
     * @returns {promises<Array>} retorna uma lista com todos os produtos
     * @throws mostra no console e propaga o erro caso a busca falhe.
     */


    //fazeer uma busca
    buscarTodos: async () => { // Define a função assíncrona para buscar todos os produtos.
        try { // Início do bloco try-catch.
            const pool = await getConnection(); // Aguarda e obtém uma pool de conexão ativa do SQL Server.

            const querySQL = 'SELECT * FROM Produtos'; // Define a consulta SQL para buscar todos os registros.
            
            const result = await pool.request() // Inicia uma nova requisição na pool.
            .query(querySQL); // Executa a consulta SQL.

            return result.recordset; // Retorna o array de registros (produtos) resultante da consulta.
        } catch (error) { // Bloco catch: Captura erros na conexão ou consulta.
            
            console.error("Erro ao buscar o produto:", error); // Loga o erro detalhado no console do servidor.
            throw error; // Propaga o erro para a função chamadora (geralmente o Controller).
        }
    }, // Fim da função buscarTodos.

    // Início da função buscarUm (Busca por ID)
    buscarUm: async (idProduto) => { // Define a função assíncrona para buscar um produto pelo seu ID.
        try {
            const pool = await getConnection(); // Obtém a conexão.
            
            //evitar sql injection @idProduto (Comentário correto, a prevenção é feita na próxima linha via .input)
            const querySQL = ` // Define a consulta SQL usando um placeholder (@idProduto).
            SELECT * FROM Produtos 
            WHERE idProduto = @idProduto 
            `;
            
            const result = await pool.request()
            .input(`idProduto`, sql.UniqueIdentifier, idProduto) // Define o parâmetro de entrada (@idProduto) usando o tipo SQL 'UniqueIdentifier' para segurança.
            .query(querySQL); // Executa a consulta.

        return result.recordset; // Retorna o registro do produto encontrado.

        } catch (error) {
            console.error("Erro ao buscar o produto:", error); // Loga o erro.
            throw error; // Propaga o erro.
            
        }
        
    }, // Fim da função buscarUm.

    // Bloco JSDoc: Documentação da função inserirProduto
    /**
     * @async
     * @function inserirProduto
     * @param {string} nomeProduto 
     * @param {number} precoProduto 
     * @returns {promises<void>} //nao reotorna nada apenas executa a insercao
     * @throws // mostra no console e propaga o erro caso a funcao falhe
     */
    inserirProduto:async (nomeProduto, precoProduto) => { // Define a função assíncrona para inserir um novo produto.

        //inserir dados no Produtos
        try {
            const pool = await getConnection(); // Obtém a conexão.

            const querySQL = `INSERT INTO Produtos (nomeProduto, precoProduto) // Define a instrução SQL INSERT.
            VALUES (@nomeProduto, @precoProduto) // Usa placeholders seguros (@) para os valores.
            `
              await pool.request() // Inicia a requisição.
                .input("nomeProduto", sql.VarChar(100), nomeProduto) // Define o parâmetro @nomeProduto com o tipo VarChar(100).
                .input("precoProduto", sql.Decimal(10,2), precoProduto) // Define o parâmetro @precoProduto com o tipo Decimal(10,2).
                .query(querySQL); // Executa a inserção no banco de dados.

        } catch (error) {
             console.error("Erro ao inserir o produto:", error); // Loga o erro.
            throw error; // Propaga o erro para o controlador.
        }
        
    } // Fim da função inserirProduto.
};

module.exports = {produtoModel}; // Exporta o objeto 'produtoModel' para que ele possa ser importado e utilizado por Controllers.