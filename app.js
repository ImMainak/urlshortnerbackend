import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// var createError = require('http-errors');
// var express = require('express');
// var fs = require('fs');
// var bodyParser = require('body-parser');
// var path = require('path');
import createError from "http-errors";
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
// const cookieParser = require('cookie-parser');
require('dotenv').config({path: __dirname + '/.env'})
var app = express();

// REMOVE X-POWERED-BY FROM RESPONSE HEADER
app.disable('x-powered-by');
// REMOVE SERVER FROM RESPONSE HEADER
app.disable('Server');

/* LOAD MYSQL DB */
require('./config/dbConfig.cjs');

app.use(bodyParser.json({
    limit: '50mb'
})); // support json encoded bodies


app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
})); // support encoded bodies

app.use(cookieParser());

/* using middleware */
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS,HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,access-token,x-http-method-override,x-access-token,authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type,expire');
    next();
});

global.appPath = __dirname;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.static(__dirname + '/uploads'));
app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Load the constants
global.constants = require(global.appPath + '/config/constants.cjs');


import apiRouter from './routes/apiRoutes.js';
import websiteRouter from './routes/websiteRoutes.js';
import userRouter from './routes/userRoutes.js';
// var socketFunc = require('./helpers/socketFunctions');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP / HTTPS server.
 */

var server = require('http').createServer(app); // Create HTTP Server
console.log(process.env.ENVIRONMENT);

// Socket Configuration
// const io = require('socket.io')(server);

// io.of("/joinToSocket").on('connection', (socket) => { 
//     console.log("Socket is Connected...")
//     socketFunc.socketResponse(socket);
// });



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/*
 * Listen to all http response here
 */
function InterceptorForAllResponse(req, res, next) {
    var oldSend = res.send;
    res.send = function(data) {
        // arguments[0] (or `data`) contains the response body        
        oldSend.apply(res, arguments);
    }
    next();
}

app.use(InterceptorForAllResponse);

//------------------------------------------- ROUTES ----------------------------------------------//
app.use("/", apiRouter); // API Routes
app.use("/web", websiteRouter); // Website Routes
app.use("/user", userRouter); // User Routes
//------------------------------------------- ROUTES ----------------------------------------------//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.log(err);
    res.status(err.status || 500).json('error');
});


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on', bind);
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// module.exports = app;
