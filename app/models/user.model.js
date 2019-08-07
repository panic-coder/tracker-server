const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT);
// const logger = require('../../services/logger.services');

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    // var textPassword = text.toString();
    logger.info(text, "passwordModel");

    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        useCreateIndex: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    reset_password_token: {
        type: String
    },
    reset_password_link_expiry_time: {
        type: String
    },
    login_token: {
        type: String
    },
    creator_stamp: {
        type: Date,
        default: Date.now
    },
    update_stamp: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('user', UserSchema);

bcryptSave = (password, callback) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                callback(err);
            } else {
                callback(null, hash);
            }
        });
    });
};

bcryptCompare = (password, hashedPassword, callback) => {
    bcrypt.compare(password, hashedPassword, function (err, res) {
        if (err) {
            callback(err);
        } else if (res) {
            callback(null, res);
        } else if (!res) {
            callback(null, res);
        } else {
            callback("Something went wrong");
        }
    });
};


function UserSchemaModel() {

}

UserSchemaModel.prototype.save = (data, callback) => {
    bcryptSave(data.password, (err, hashedPassword) => {
        if (err) {
            callback(err);
        } else {
            data.password = hashedPassword;
            console.log('data', data);
            var newUserData = new User(data);
            newUserData.save((error, result) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
        }
    });
};

UserSchemaModel.prototype.login = (data, callback) => {
    User.findOne({
        email: data.email
    }, { login_token: 0 }, (error, result) => {
        if (error) {
            callback(error);
        } else if (result != null) {
            bcryptCompare(data.password, result.password, (errorPassword, resultPassword) => {
                if (errorPassword) {
                    callback(errorPassword);
                } else if (resultPassword) {
                    delete result.password;
                    callback(null, null, result);
                } else {
                    callback(null, "Wrong password", null);
                }
            })
        } else {
            callback(null, null, null, "Not a registered user")
        }
    });
};

UserSchemaModel.prototype.UpdateOne = (Obj, callback) => {
    Obj.update_stamp = Date.now();
    User.updateOne({
        _id: Obj._id
    }, Obj, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            logger.info(result);
            callback(null, result);
        }
    });
};

UserSchemaModel.prototype.checkUser = function (userObj, callback) {
    // console.log(userObj);

    User.findOne({
        email: userObj.email,
    }, function (err, result) {
        logger.info(err, 'res ', result);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

UserSchemaModel.prototype.loginByUsername = function (userObj, callback) {
    var password = encrypt(userObj.password);
    User.findOne({
        email: userObj.email,
        password: password
    }, function (err, result) {
        logger.info(err, 'res ', result);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

UserSchemaModel.prototype.changePassword = function (data, callback) {
    var password = encrypt(data.new_password);
    data.update_stamp = Date.now();
    User.updateOne({
        _id: data.user_id
    }, {
            password: password,
            reset_password_token: '',
            reset_password_link_expiry_time: ''
        }, (err, result) => {
            logger.info('m result ', result);
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
};

UserSchemaModel.prototype.findByUserId = function (id, callback) {
    User.findById(id, (err, data) => {
        if (err) {
            callback(err);
        }
        callback(null, data);
    });
};

UserSchemaModel.prototype.checkByUserName = function (Obj, callback) {
    // var password = encrypt(Obj.password);
    var search = {
        'email': Obj.email
    };
    User.findOne(search, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

UserSchemaModel.prototype.findToken = function (Obj, callback) {
    var search = {
        _id: Obj.decoded.data._id
    }
    User.findOne(search, (err, result) => {
        if (err) {
            callback(err, null);
        } else if (result != null) {
            if (result.login_token != undefined && result.login_token != null && result.login_token != '') {
                if (result.login_token === Obj.token) {
                    callback(null, result);
                } else {
                    callback('Token miss match')
                }
            }
        } else {
            callback('Not a registered user');
        }
    })
}

UserSchemaModel.prototype.logout = function (Obj, callback) {
    var search = {
        _id: Obj.decoded.data._id,
        login_token: Obj.token
    }
    User.findOneAndUpdate(search, { $set: { login_token: '' } }, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

module.exports = new UserSchemaModel();