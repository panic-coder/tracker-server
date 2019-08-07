var jwt = require('jsonwebtoken');
var secret = process.env.SECRET;
// console.log("3 jwt-services : ",secret);


exports.jwtGenerator = (payload, callback) => {
    var token = jwt.sign({
        data: payload
    }, secret, {
        expiresIn: '24h'
    });
    if (token != null || token != undefined || token != '') {
        callback(null, token);
    } else {
        callback('Token generation failed', null);
    }
};

// exports.jwtChecker = (callback) => {
//     jwt.verify(token, secret, function (error, decoded) {
//         if (error) {
//             return res.status(constantParams.staticHTTPErrorMessages.UNAUTHORIZED.errorResponseCode).send(response);
//         } else {
//             // console.log(decoded.foo) 

//             callback(null, decod)
//         }
//     });
// }