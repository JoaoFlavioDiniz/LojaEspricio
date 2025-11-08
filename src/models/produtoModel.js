//module.exports = {sql, getConnection}; e a forma correta de exportar para que o sql e o getconnection aparecam caixinha
const { promises } = require("dns");
const {sql, getConnection} = require("../config/db");

const produtoModel = {
    /**
     * busca todos os produtos
     * @async
     * @function buscarTodos
     * @returns {promises<Array>} retorna uma lista com todos os produtos
     * @throws mostra no console e propaga o erro caso a busca falhe.
     */


//fazeer uma busca
    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Produtos';
            const result = await pool.request()
            .query(querySQL);

            return result.recordset;
        } catch (error) {
            
            console.error("Erro ao buscar o produto:", error);
            throw error; // reverberar o erro para a funcao que o chamar.
        }
    },

    buscarUm: async (idProduto) => {
        try {
            const pool = await getConnection(); //evitar sql injection @idProduto
            const querySQL = `
            SELECT * FROM Produtos 
            WHERE idProduto = @idProduto 
            `;
            
            const result = await pool.request()
            .input(`idProduto`, sql.UniqueIdentifier, idProduto)
            .query(querySQL);

        return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar o produto:", error);
            throw error; // reverberar o erro para a funcao que o chamar.
            
        }
        
    },

    /**
     * 
     * @async
     * @function inserirProduto
     * @param {string} nomeProduto 
     * @param {number} precoProduto 
     * @returns {promises<void>} //nao reotorna nada apenas executa a insercao
     * @throws // mostra no console e propaga o erro caso a funcao falhe
     */
    inserirProduto:async (nomeProduto, precoProduto) => {

        //inserir dados no Produtos
        try {
            const pool = await getConnection();

            const querySQL = `INSERT INTO Produtos (nomeProduto, precoProduto)
            VALUES (@nomeProduto, @precoProduto)
            `
              await pool.request()
                .input("nomeProduto", sql.VarChar(100), nomeProduto)
                .input("precoProduto", sql.Decimal(10,2), precoProduto)
                .query(querySQL);

        } catch (error) {
             console.error("Erro ao inserir o produto:", error);
            throw error; //
        }
        
    }
};

module.exports = {produtoModel};