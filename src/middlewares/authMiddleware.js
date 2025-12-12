//passar pelo middleware antes de chegar no controller
const jwt = require("jsonwebtoken");
//todas as fun;oes devem estar dentro das chaves
const verify = {
    cliente: async (req, res, next) => {
        try {
            const {token} = req.cookies;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded.tipoUsuario || decoded.tipoUsuario !== "cliente") {
                return res.status(403).json({erro: "Acesso permitido somente a clientes!"});
                
                }
                next();
            
        } catch (error) {
            return res.status(401).json({erro: "Token invalido ou expirado!"});
            
        }
        
    }

};

module.exports = {verify};