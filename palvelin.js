
'use strict';

const axios = require('axios');

var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');

//const jwt = require('jsonwebtoken');
const { application, response } = require('express');
//const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const lodash = require("lodash");
const ws = require('ws');
const clients = new Set();
const wss = new ws.Server({ noServer: true });




var port = 443;

var app = express();
//var mysql = require('mysql');

const { Pool, Client } = require("pg");
var EventEmitter = require('events');
var util = require('util');

function DbEventEmitter() {
    EventEmitter.call(this);
}

util.inherits(DbEventEmitter, EventEmitter);
var dbEventEmitter = new DbEventEmitter;


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Hollywood",
    password: "",  // poistettu GitHubin versiosta
    port: 5432,
})

pool.connect(function (err, client) {
    if (err) {
        console.log("66", err);
    }

    // Listen for all pg_notify channel messages
    client.on('notification', function (msg) {
        let payload = JSON.parse(msg.payload);
        dbEventEmitter.emit(msg.channel, payload);
    });

    // Designate which channels we are listening on. Add additional channels with multiple lines.
    console.log('tällä ollan');
    //client.query('tällä ollan');
});

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
//app.use(express.json())

const path = require('path')


app.get('/films', async (request, response) => {
    console.log("app.get")
    try {
        console.log("get films")
        var films = await pool.query('SELECT * FROM films')
            .then(function (response) {
                console.log(response)
                var leffat = response.rows
                console.log("leffat: ", leffat)
                return leffat
            })
            .catch(error => console.error(error))
        response.send(films)
    } catch (error) {
        response.json({ error: "jokin meni pieleen tietojen hakemisessa:" + error })
    }


})


/*
var server = https.createServer(options, app).listen(443, function () {
    console.log("Express server listening on port " + 443);
});
*/

var server = http.createServer(app).listen(443, function () {
    console.log("Express server listening on port " + 443);
});
