const { verify } = require("jsonwebtoken")

async function auth(req, res, next){
    try {
        const { authorization } = req.headers
        console.log("Here in the middle")
        req['payload'] = verify(authorization, process.env.SECRET_JWT)
        
        next()
        
    } catch (error) {
        return res.status(401).send({
            message: "Falha na autentificação ( ͡° ͜ʖ ͡°)  ",
            cause: error.message 
        })
    }
}

module.exports = { auth }