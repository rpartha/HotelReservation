const express = require('express');
const session = require('express-session');
const parser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const everyauth = require('everyauth');

const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: 'TOPOPODP',
  signed: true
};

const app = express();
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());
app.use(session(sessionConfig));
app.use(everyauth.middleware(app));

const pool = mysql.createPool({
	connectionLimit: 5,
	host: 'hotelreservationdb.c3all2cpsbip.us-east-1.rds.amazonaws.com',
	user: 'archimedes',
	password: 'bogey-shoo-flair',
	database: 'hotelreservationdb',
	debug: true
});

everyauth.everymodule.findUserById( function (userId, callback) {
	callback(null, {user: 'AKHIL', id: 3434});
});
everyauth.debug = true;
everyauth.google
	.appId('CLIENT ID')
	.appSecret('CLIENT SECRET')
	.redirectPath('/')
	.scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
	.findOrCreateUser( function (session, accessToken, accessTokenExtra, googleUserMetadata) {
		console.log(googleUserMetadata);
		var user = {
			user: 'AKHIL',
			id: 3434
		};
		return user;
	});

app.get('/', function (req, res) {
	console.log(req.loggedIn);
	console.log(req.user);  // FTW!
	res.json(req.user);
});

app.get('/login', function(req, res){
	res.send("click <a href='/auth/google'>here to login</a>");
});

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