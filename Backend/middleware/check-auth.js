const HttpError = require("../models/http-error")
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS')
        return next()
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token)
            throw new Error('Authentication failed')
        const decodedToken = jwt.verify(token, 'supersecret_dont_share')
        req.userData = { userId: decodedToken.userId }
        next()
    }
    catch (error) {
        return next(new HttpError(error.message, 401))

    }



}