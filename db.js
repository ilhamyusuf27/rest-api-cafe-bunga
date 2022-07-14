const { Pool, Client } = require('pg');
require('dotenv').config();

console.log(process.env.DB_URI);

let connection;

if (process.env.ENV_MODE === 'prod') {
	connection = new Client({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	});
} else {
	connection = new Pool({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		password: process.env.DB_PASS,
		port: process.env.DB_PORT,
	});
}

module.exports = connection;
