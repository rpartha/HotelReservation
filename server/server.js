const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const path = require('path');
const request = require('request');
const config = require('./config');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next){
	request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.tokenId, function (err, response, bodyString){
		if (err) throw err;
		var body = JSON.parse(bodyString);
		req.cid = body.sub;
		req.name = body.name;
		req.email = body.email;
		next();
	});
});
app.use(express.static(path.resolve(__dirname + '/../' + 'front_end')));

const pool = mysql.createPool({
	connectionLimit: 5,
	host: config.MYSQL_HOST,
	user: config.MYSQL_USER,
	password: config.MYSQL_PASSWORD,
	database: config.MYSQL_DATABASE,
});

function generateUniqueID(table, column, next){
	const id = crypto.randomBytes(5).toString("hex");
	pool.query('SELECT * FROM ? WHERE ?=?', [table, column, id], function(err, results, fields){
		if (err) throw err;
		if (results.length == 0){
			return next(id);
		} else {
			generateUniqueID(table, column, next);
		}
	});
};

app.get('/', function (req, res){
	res.sendFile(path.join(__dirname + '/../front_end/login.html'));
});

// required parameters: address, phone
app.post('/register', function(req, res){
	pool.query('INSERT INTO Customer VALUES (?,?,?,?,?)', [req.cid,req.email,req.body.address,req.body.phone,req.name], function(err, results){
		if (err) throw err;
		res.json(results);
	});
});

app.post('/user', function(req, res){
	pool.query('SELECT * FROM Customer WHERE CID=?', [req.cid], function(err, results, fields){
		if (err) throw err;
		var user = {
			name: req.name,
			email: req.email
		};
		if (results.length == 0){
			user.registered = false;
		} else {
			user.registered = true;
			user.address = results[0].Address;
			user.phone = results[0].Phone_no;
		}
		res.json(user);
	});
});

const port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("hotel_reservation_api listening on port " + port);
});