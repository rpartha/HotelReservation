const express = require('express');
const parser = require('body-parser');
const hasher = require('password-hash');
const crypto = require('crypto');
const mysql = require('mysql');

const app = express();
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());
const pool = mysql.createPool({
	connectionLimit: 5,
	host: 'hotelreservationdb.c3all2cpsbip.us-east-1.rds.amazonaws.com',
	user: 'archimedes',
	password: 'bogey-shoo-flair',
	database: 'hotelreservationdb',
	debug: true
});

function generateUniqueID(table, column, next){
	const id = crypto.randomBytes(5).toString("hex");
	pool.query('SELECT * FROM ? WHERE ?=?', [table, column, id], function(err, results, fields){
		if (err){
			return next(err);
		}
		if (results.length == 0){
			return next(false, id);
		} else {
			generateUniqueID(table, column, next);
		}
	});
}

const port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("hotel_reservation_api listening on port " + port);
});