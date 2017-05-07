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
	pool.query('SELECT * FROM ' + table + ' WHERE ?=?', [column, id], function(err, results, fields){
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

// required parameters: street, city, country, state, zip
app.post('/addhotel', function(req, res){
	generateUniqueID('Hotel', 'HotelId', function(id){
		pool.query('INSERT INTO Hotel VALUES (?,?,?,?,?,?)', [id,req.body.street,req.body.city,req.body.country,req.body.state,req.body.zip], function(err, results){
			if (err) throw err;
			res.json(results);
		});
	});
});

// required parameters: hotelid, roomno, price, cap, floorno, desc, type
app.post('/addroom', function(req, res){
	pool.query('INSERT INTO Room VALUES (?,?,?,?,?,?,?)', [req.body.hotelid,req.body.roomno,req.body.price,req.body.cap,req.body.floorno,req.body.desc,req.body.type], function(err, results){
		if (err) throw err;
		res.json(results);
	});
});

// required parameters: cid, hotelid, stype, btype, roomno, rating, text
app.post('/addreview', function(req, res){
	generateUniqueID('Review', 'ReviewId', function(id){
		pool.query('INSERT INTO Review VALUES (?,?,?,?,?,?,?,?)', [req.body.cid,id,req.body.hotelid,req.body.stype,req.body.btype,req.body.roomno,req.body.rating,req.body.text], function(err, results){
			if (err) throw err;
			res.json(results);
		});
	});
});

const port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("hotel_reservation_api listening on port " + port);
});