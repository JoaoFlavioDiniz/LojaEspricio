// Este comentário está correto: chama a biblioteca do microsoft sql server
const { promises } = require("dns"); // Importa o módulo 'promises' do módulo nativo 'dns' do Node.js.
                                      // NOTA: Esta importação é desnecessária, pois o módulo 'dns' não é utilizado neste código.

const sql = require ("mssql");        // Importa o pacote 'mssql', o driver Node.js para comunicação com o Microsoft SQL Server.
                                      // A variável 'sql' é o objeto principal para gerenciamento de conexões e consultas.

//contante de configuracao do banco de dados
const config = { // Início do objeto de configuração contendo os parâmetros de acesso ao SQL Server.
    user: "sa",          // Nome de usuário para autenticação no SQL Server (neste caso, o System Administrator).
    password: "123456789", // Senha correspondente ao usuário 'sa'.
    server: "localhost", // Endereço do servidor SQL Server (neste caso, rodando na própria máquina).
    database: "LojaEspricio", // Nome do banco de dados ao qual a conexão será estabelecida.
    options: { // Sub-objeto para opções avançadas de conexão.
        //para nao exibir erro de certificado,...
        encrypt: true,           // Habilita a criptografia (SSL) na comunicação entre o Node.js e o SQL Server.
        trustServerCertificate: true, // Define que o driver deve confiar no certificado SSL do servidor,
                                      // evitando erros comuns em ambientes de desenvolvimento onde o certificado não é oficial.
    }
};

/**
 * cria e retorna uma conexao com o banco de dados sql server
 * * @async
 * @function getConnection
 * @returns {promises<object>} retorna um objeto de conexao (pool) com o banco de dados
 * @throws mostra no console se ocorrer erro na conexao.
 */


//funcao que coleta as informacoes do bd assincrona
async function getConnection() { // Declara a função assíncrona 'getConnection' para gerenciar a conexão.
    try { // Inicia um bloco try-catch para tentar a conexão e capturar erros.
        const pool = await sql.connect(config); // Tenta estabelecer a conexão com o SQL Server usando as credenciais do objeto 'config'.
                                                // O 'await' pausa a execução até que a conexão seja bem-sucedida ou falhe.
                                                // O resultado é um 'pool' (gerenciador de conexões).
        return pool; // Retorna o objeto 'pool' para quem chamou a função.
        
    } catch (error) { // Se a conexão falhar (catch), o erro é capturado aqui.
        console.error("Erro na conexao SQL SERVER:", error); // Exibe a mensagem de erro no console para diagnóstico.
        // A função retorna 'undefined' implicitamente se um erro ocorrer e não for re-lançado.
    }
    
};
/*
(async () => { // Bloco de código comentado que demonstra como a função seria usada:
    const pool = await getConnection(); // Tenta obter a conexão (o 'pool').

    const result = await pool.request().query("SELECT * FROM Produtos"); // Se a conexão for bem-sucedida, executa uma query SQL.

    console.log(result.recordset); // Exibe os resultados da consulta no console.
    
})()*/

module.exports = {sql, getConnection}; // Exporta o driver 'sql' e a função 'getConnection' para que possam
                                          // ser utilizados por outros arquivos que importarem este módulo.