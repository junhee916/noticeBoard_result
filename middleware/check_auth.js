const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    try{
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        console.log('decode 확인: ', decode)
        res.locals.user = decode;
        next();
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
}