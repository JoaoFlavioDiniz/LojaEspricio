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
    }
};

module.exports = {produtoModel};