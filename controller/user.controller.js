const userService = require('../services/user.services');
const jwtService = require('../services/jwt.services');
// const constantsParam = require('../constants/static.js');
// const errorHandler = require('../handlers/systemError.handler');
// const logger = require('../services/logger.services');
const userModel = require('../app/models/user.model');
// const communication = require('../services/communication.services');
var jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.registration = (req, res, next) => {
    var responseResult = {};
    try {
        req.checkBody('email', 'email is required').notEmpty();
        req.checkBody('password', 'password is required').notEmpty();
        console.log(req.body);

        var errors = req.validationErrors();
        if (errors) {
            responseResult.status = false;
            responseResult.message = errors[0].msg;
            return res.status(constantsParam.staticHTTPErrorMessages.BAD_REQUEST.errorResponseCode).send(responseResult);
        } else {
            userService.registration(req.body, (error, result) => {
                if (error) {
                    if (error.code == 11000) {
                        console.log(error);
                        responseResult.status = false;
                        responseResult.message = "Email id already exists";
                        return res.status(constantsParam.staticHTTPErrorMessages.CONFLICT.errorResponseCode).send(responseResult);
                    }
                    else if (error) {
                        console.log(error);
                        responseResult.status = false;
                        responseResult.message = "Something went wrong";
                        return res.status(constantsParam.staticHTTPErrorMessages.INTERNAL_SERVER_ERROR.errorResponseCode).send(responseResult);
                    } else {
                        responseResult.status = true;
                        responseResult.message = "Registered Successfully";
                        responseResult.data = result;
                        return res.status(constantsParam.staticHTTPSuccessMessages.CREATED.successResponseCode).send(responseResult);
                    }
                }
                else {
                    responseResult.status = true;
                    responseResult.message = "Registered Successfully";
                    responseResult.data = result;
                    return res.status(constantsParam.staticHTTPSuccessMessages.CREATED.successResponseCode).send(responseResult);
                }

            });
        }
    } catch (error) {
        responseResult.status = false;
        if (!errorHandler.checkSystemErrors(err)) {
            responseResult.message = err;
            if (typeof err === "object" && err.message) {
                responseResult.message = err.message;
            }
        }
        return res.status(constantsParam.staticHTTPErrorMessages.INTERNAL_SERVER_ERROR.errorResponseCode).send(responseResult);
    }
};

exports.login = (req, res, next) => {
    var responseResult = {};
    try {
        req.checkBody('email', 'email is required').notEmpty();
        req.checkBody('password', 'password is required').notEmpty();
        console.log(req.body);

        var errors = req.validationErrors();
        if (errors) {
            responseResult.status = false;
            responseResult.message = errors[0].msg;
            return res.status(constantsParam.staticHTTPErrorMessages.BAD_REQUEST.errorResponseCode).send(responseResult);
        } else {
            userService.login(req.body, (error, wrongPassword, result, notRegistered) => {
                if (error) {
                    responseResult.status = false;
                    responseResult.message = "Something went wrong";
                    return res.status(constantsParam.staticHTTPErrorMessages.INTERNAL_SERVER_ERROR.errorResponseCode).send(responseResult);
                } else if (wrongPassword) {
                    responseResult.status = false;
                    responseResult.message = "Wrong password";
                    return res.status(constantsParam.staticHTTPErrorMessages.UNAUTHORIZED.errorResponseCode).send(responseResult);
                } else if (result != null) {
                    jwtService.jwtGenerator({
                        _id: result._id
                    }, (errorJwt, resultJwt) => {
                        if (errorJwt) {
                            responseResult.status = false;
                            responseResult.message = "Token Generation Failed";
                            return res.status(constantsParam.staticHTTPErrorMessages.INTERNAL_SERVER_ERROR.errorResponseCode).send(responseResult);
                        } else {
                            var updateData = {
                                _id: result._id,
                                login_token: resultJwt
                            };
                            userService.updateLogin(updateData, (errorUpdate, resultUpdate) => {
                                if (errorUpdate) {
                                    responseResult.status = false;
                                    responseResult.message = "Token Updation Failed";
                                    return res.status(constantsParam.staticHTTPErrorMessages.INTERNAL_SERVER_ERROR.errorResponseCode).send(responseResult);
                                } else {
                                    responseResult.status = true;
                                    responseResult.message = "Logged in Successfully";
                                    responseResult.data = result;
                                    responseResult.token = resultJwt;
                                    res.status(constantsParam.staticHTTPSuccessMessages.OK.successResponseCode).send(responseResult);
                                }
                            })
                        }
                    });
                } else {
                    responseResult.status = false;
                    responseResult.message = notRegistered;
                    return res.status(constantsParam.staticHTTPErrorMessages.NOT_FOUND.errorResponseCode).send(responseResult);
                }
            });
        }
    } catch (error) {
        responseResult.status = false;
        if (!errorHandler.checkSystemErrors(err)) {
            responseResult.message = err;
            if (typeof err === "object" && err.message) {
                responseResult.message = err.message;
            }
        }
        return res.status(constantsParam.staticHTTPErrorMessages.INTERNAL_SERVER_ERROR.errorResponseCode).send(responseResult);
    }
};


exports.logout = (req, res, next) => {
    var responseResult = {};
    try {
        var token = req.headers["token"];
        if (token == undefined || token == null || token == '') {
            responseResult.status = false;
            responseResult.message = 'Token not provided';
            res.status(constantsParam.staticHTTPErrorMessages.BAD_REQUEST.errorResponseCode).send(responseResult);
        } else {
            // var jwt = require('jsonwebtoken');
            jwt.verify(token, secret, function (err, decoded) {
                // if (err) {
                //     return res.status(401).send(response);
                // } else {
                    var logoutData = {
                        decoded: decoded,
                        token: token
                    };
                    userService.logout(logoutData, (error, result) => {
                        if (error) {
                            responseResult.status = false;
                            responseResult.message = "Internal Server Error";
                            return res.status(constantsParam.staticHTTPErrorMessages.INTERNAL_SERVER_ERROR.errorResponseCode).send(responseResult);
                        } else {
                            responseResult.status = true;
                            responseResult.message = "Logged out successfully from the system";
                            res.status(constantsParam.staticHTTPSuccessMessages.OK.successResponseCode).send(responseResult);
                        }
                    });
                // }
            });
        }
    } catch (err) {
        responseResult.status = false;
        if (!errorHandler.checkSystemErrors(err)) {
            responseResult.message = err;
            if (typeof err === "object" && err.message) {
                responseResult.message = err.message;
            }
        }
        return res.status(constantsParam.staticHTTPErrorMessages.INTERNAL_SERVER_ERROR.errorResponseCode).send(responseResult);
    }
};