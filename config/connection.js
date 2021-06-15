require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	dialect: 'mysql2',
	port: 3306,
	password: process.env.DB_PASSWORD,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
});

module.exports = connection;
