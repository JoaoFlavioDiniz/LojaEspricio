const { promises } = require("dns");
const { sql, getConnection } = require("../config/db");

const clienteModel = {
    /**
     * busca todos os clientes
     * @async
     * @function buscarTodos
     * @returns {promises<Array>} retorna uma lista com todos os clientes
     * @throws mostra no console e propaga o erro caso a busca falhe.
     */

    //fazer uma busca completa em clientes
    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Clientes';
            const result = await pool.request()
                .query(querySQL);

            return result.recordset;
        } catch (error) {

            console.error("Erro ao buscar o Cliente:", error);
            throw error; // reverberar o erro para a funcao que o chamar.
        }
    },

     buscarUm: async (idCliente) => {
        try {
            const pool = await getConnection(); //evitar sql injection @idProduto
            const querySQL = `
            SELECT * FROM Clientes 
            WHERE idCliente = @idCliente 
            `;
            
            const result = await pool.request()
            .input(`idCliente`, sql.UniqueIdentifier, idCliente)
            .query(querySQL);

        return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar o cliente:", error);
            throw error; // reverberar o erro para a funcao que o chamar.
            
        }
        
    },

    /**
     * 
     * @async
     * @function inserirCliente
     * @param {string} nomeCliente 
     * @param {number} cpfCliente 
     * @returns {promises<void>} //nao reotorna nada apenas executa a insercao
     * @throws // mostra no console e propaga o erro caso a funcao falhe
     */

    inserirCliente: async (nomeCliente, cpfCliente) => {

        //inserir dados do cliente
        try {
            const pool = await getConnection();

            const querySQL = `INSERT INTO Clientes (nomeCliente, cpfCliente)
            VALUES (@nomeCliente, @cpfCliente)
            `
            await pool.request()
                .input("nomeCliente", sql.VarChar(100), nomeCliente)
                .input("cpfCliente", sql.Char(11), cpfCliente)
                .query(querySQL);

        } catch (error) {
            console.error("Erro ao inserir do cliente:", error);
            throw error; //
        }

    }

};

module.exports = {clienteModel};
