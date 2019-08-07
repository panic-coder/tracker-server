var jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const userService = require('../services/user.services');

var auth = function (req, res, next) {

    var token = req.headers["token"];

    var response = {
        'message': "Unauthorised Login"
    };
    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            return res.status(401).send(response);
        } else {
            var searchTokenData = {
                decoded: decoded,
                token: token
            };
            userService.findToken(searchTokenData, (errorToken, resultToken) => {
                if (errorToken) {
                    return res.status(401).send(response);
                } else {
                    if (resultToken != null) {
                        next();
                    } else {
                        return res.status(401).send(response);
                    }
                }
            });
        }
    });
};

module.exports = auth;