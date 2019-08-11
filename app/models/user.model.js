const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT);
const enum_user_type = ['trucker', 'admin'];


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
    type: {
        type: String,
        required: [true, 'user type is required'],
        enum: enum_user_type
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
            callback(null, result);
        }
    });
};

// UserSchemaModel.prototype.checkUser = function (userObj, callback) {
//     User.findOne({
//         email: userObj.email,
//     }, function (err, result) {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     });
// };

// UserSchemaModel.prototype.loginByUsername = function (userObj, callback) {
//     var password = encrypt(userObj.password);
//     User.findOne({
//         email: userObj.email,
//         password: password
//     }, function (err, result) {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     });
// };

// UserSchemaModel.prototype.findByUserId = function (id, callback) {
//     User.findById(id, (err, data) => {
//         if (err) {
//             callback(err);
//         }
//         callback(null, data);
//     });
// };

// UserSchemaModel.prototype.checkByUserName = function (Obj, callback) {
//     // var password = encrypt(Obj.password);
//     var search = {
//         'email': Obj.email
//     };
//     User.findOne(search, function (err, result) {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     });
// };

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