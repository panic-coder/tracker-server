const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const http = require('http');
const server = http.Server(app);
const socketIO = require('socket.io');
const io = socketIO(server);
require('dotenv').config();
const userRoutes = require('./routes/user.routes');

var env = process.env.NODE_ENV || "local";
var config = require("./config/" + env);

app.use(cors());
app.use(bodyParser.json({
    limit: '10mb'
}));
// app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));
app.use(expressValidator());
app.use('/', userRoutes);

mongoose.Promise = global.Promise;

app.use(function (err, req, res, next) {
    console.error(err);
    var error = {
        status: false,
        status_code: 500,
        message: "Something bad happened. Please contact system administrator or try again"
    };
    res.send(error);
});

function startMongo(mongoObj) {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(mongoObj.url, mongoObj.options);
    mongoose.connection.on("connected", () => {
        console.log("connected to mongodb on %s", mongoObj.url);
    })
    mongoose.connection.on("error", (err) => {
        if (err) {
            console.log("not connected to mongodb due to %s", err);
            process.exit();
        }
    })
}

app.get('/', (req, res) => {
    res.json('Welcome to Tracker App');
});

server.listen(config.PORT, () => {
    console.log("Server is listening on port " + config.PORT);
    startMongo(config.mongo);
});