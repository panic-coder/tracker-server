module.exports = {
    "isProduction": false,
    "PORT": process.env.PORT,
    "mongo": {
        "url": process.env.DB,
        "options": {
            "useNewUrlParser": true
        },
        "createIndex": {
            "useCreateIndex": true
        }
    },
}