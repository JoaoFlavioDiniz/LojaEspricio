const { promises } = require("dns");
const { sql, getConnection } = require("../config/db");
const { query } = require("mssql");

const bcrypt = require("bcrypt");

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

    buscarCPF: async (cpfCliente) => {

        try {
            const pool = await getConnection();//evitar sql injection @cpfCliente
            const querySQL = `
            SELECT * FROM Clientes
            WHERE cpfCliente = @cpfCliente           
            `;
            const result = await pool.request()
                .input(`cpfCliente`, sql.Char(11), cpfCliente)
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
     * @param {string} emailCliente  // NOVO
     * @param {string} senhaCliente  // NOVO 
     * @returns {promises<void>} //nao reotorna nada apenas executa a insercao
     * @throws // mostra no console e propaga o erro caso a funcao falhe
     */

    inserirCliente: async (nomeCliente, cpfCliente, emailCliente, senhaCliente) => {

        //inserir dados do cliente
        try {
            const pool = await getConnection();

            const querySQL = `INSERT INTO Clientes (nomeCliente, cpfCliente, emailCliente, senhaCliente)
            VALUES (@nomeCliente, @cpfCliente, @emailCliente, @senhaCliente)
            `
            await pool.request()
                .input("nomeCliente", sql.VarChar(100), nomeCliente)
                .input("cpfCliente", sql.Char(11), cpfCliente)
                .input("emailCliente", sql.VarChar(200), emailCliente)
                .input("senhaCliente", sql.VarChar(255), senhaCliente)
                .query(querySQL);

        } catch (error) {
            console.error("Erro ao inserir do cliente:", error);
            throw error; //
        }

    },

    atualizarCliente: async (idCliente, nomeCliente, cpfCliente, emailCliente, senhaCliente) => {

        try {
            const pool = await getConnection();
// update e delete nunca se faz sem WHERE
            const querySQL = `
            UPDATE Clientes 
            SET nomeCliente = @nomeCliente,
                cpfCliente = @cpfCliente,
                emailCliente = @emailCliente,
                senhaCliente = @senhaCliente,
            WHERE idCliente = @idCliente 
            `;

            await pool.request()
            .input('nomeCliente', sql.VarChar(100), nomeCliente)
            .input('cpfCliente', sql.Char(11), cpfCliente)
            .input('emailCliente', sql.VarChar(200), emailCliente)
            .input('senhaCliente', sql.VarChar(255), senhaCliente)
            .input('idCliente', sql.UniqueIdentifier, idCliente)
            .query(querySQL);
            
        } catch (error) {
            console.error("Erro ao atualizar o Cliente", error);
            throw error;            
        }
        
    },

    deletarCliente: async (idCliente) => {

        try {

            const pool = await getConnection();

            const querySQL = `
            DELETE from Clientes
                WHERE idCliente = @idCliente            
            `;

            await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .query(querySQL);
            
        } catch (error) {            
            console.error("Erro ao deletar o cliente", error);
            throw error;
        }
        
    }

};

module.exports = { clienteModel };
