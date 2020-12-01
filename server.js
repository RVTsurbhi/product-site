const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const helmet = require('helmet');
const cors = require('cors');
const path = require('path')

//import from inside modules
const dbConnection = require('./settings/dbSetting');
const errorHandler = require('./utils/errorHandler');
const routes = require('./routers/apis');

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//routes
app.use('/api', routes);
app.use(express.static(__dirname + 'public'));

//views
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(errorHandler)

//create server
const http = require('http');
const server = http.createServer(app);

server.listen(process.env.PORT || 3001, ()=>
    console.log(`Server is running on port - ${process.env.PORT}`)    
)

