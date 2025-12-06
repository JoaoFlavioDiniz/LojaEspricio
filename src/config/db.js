// chama a biblioteca do microsoft sql server
const { promises } = require("dns");
const sql = require ("mssql");
//contante de configuracao do banco de dados
const config = {
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    server: process.env.SERVER_DB,
    database: process.env.NAME_DB,
    options: { //para nao exibir erro de certificado,...
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

//testar o banco de dados ao iniciar
(async () => {
    const pool = await getConnection();
if(pool){

    console.log("conexao com banco de dados estabelecida com sucesso");
}
    
})();

module.exports = {sql, getConnection};
