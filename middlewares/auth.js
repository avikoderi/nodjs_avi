const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "you need a token" })
    }
    try {
        
        let decodeToken = jwt.verify(token, config.TokenSecret);
        req.userToken = decodeToken;
        next()

    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "Token invalid or token expired" })
    }
}


