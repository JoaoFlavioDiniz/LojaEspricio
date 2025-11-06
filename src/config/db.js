// chama a biblioteca do microsoft sql server
const { promises } = require("dns");
const sql = require ("mssql");
//contante de configuracao do banco de dados
const config = {
    user: "sa",
    password: "123456789",
    server: "localhost",
    database: "LojaEspricio",
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
};

/**
 * cria e retorna uma conexao com o banco de dados sql server
 * 
 * @async
 * @function getConnection
 * @returns {promises<object>} retorna um objeto de conexao (pool) com o banco de dados
 * @throws mostra no console se ocorrer erro na conexao.
 */


//funcao que coleta as informacoes do bd assincrona
async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
        
    } catch (error) {
        console.error("Erro na conexao SQL SERVER:", error);
    }
    
};
/*
(async () => {
    const pool = await getConnection();

    const result = await pool.request().query("SELECT * FROM Produtos");

    console.log(result.recordset);
    
})()*/

module.exports = {sql, getConnection};
