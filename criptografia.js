const bcrypt = require("bcrypt");

let senha = 'Senha-123';

const saltRounds = 10;

const senhaCriptografada = bcrypt.hashSync(senha, saltRounds); //hashSync gera o hash

console.log('Senha original: ', senha)
console.log('Senha criptografada ', senhaCriptografada);

const senhaValida = bcrypt.compareSync(senha, senhaCriptografada); // compareSync compara o hash

if (senhaValida){
    console.log('senha valilda!');
    
} else {
    console.log('senha invalida!');
}

