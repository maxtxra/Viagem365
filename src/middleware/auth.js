const { verify } = require("jsonwebtoken");

async function auth(req, res, next) {
    try {
        const { authorization } = req.headers;

        // Check if the authorization header is present
        if (!authorization) {
            return res.status(401).json({
                message: "Falha na autentificação JWT",
                cause: "Token não fornecido",
            });
        }

        // Extract the token from the "Bearer <token>" format
        const token = authorization.split(" ")[1];

        // Verify the token
        req.payload = verify(token, process.env.SECRET_JWT);

        // Proceed to the next middleware
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Falha na autentificação JWT",
            cause: error.message,
        });
    }
}

module.exports = { auth };
