const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const AuthPort = require('authport');
const config = require('./config');

const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: 'VERY VERY SECRET',
  signed: true
};

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

AuthPort.on("auth", function(req, res, data) {
	res.json(data);
})

AuthPort.on("error", function(req, res, data) {
  // called when an error occurs during authentication
})

var google = AuthPort.createServer({
  	service: "google",
	id: config.OAUTH2_CLIENT_ID,
	secret: config.OAUTH2_CLIENT_SECRET,
	scope: ['https://www.googleapis.com/auth/userinfo.email']
})

const pool = mysql.createPool({
	connectionLimit: 5,
	host: 'hotelreservationdb.c3all2cpsbip.us-east-1.rds.amazonaws.com',
	user: 'archimedes',
	password: 'bogey-shoo-flair',
	database: 'hotelreservationdb',
	debug: true
});

app.get('/', function (req, res) {
	res.send("<html><a href=\"/auth/google\">LOG IN</a></html>");
});

app.get("/auth/:service", AuthPort.app)

function generateUniqueID(table, column, next){
	const id = crypto.randomBytes(5).toString("hex");
	pool.query('SELECT * FROM ? WHERE ?=?', [table, column, id], function(err, results, fields){
		if (err){
			return next(err);
		}
		if (results.length == 0){
			return next(null, id);
		} else {
			generateUniqueID(table, column, next);
		}
	});
}

const port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("hotel_reservation_api listening on port " + port);
});