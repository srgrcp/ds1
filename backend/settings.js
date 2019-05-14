const variables = require('./variables')
bodyParser = require('body-parser')
mongoose = require('mongoose')
express = require('express')
morgan = require('morgan')
path = require("path")
app = express()

mongoose.connect(variables.mongoURL, {useNewUrlParser: true})
.then(db => console.log('db is connected'))
.catch(err => console.log(err))
app.set('port', process.env.PORT || 3000)
app.use(morgan('dev'))
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())