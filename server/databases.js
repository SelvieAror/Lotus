const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
    } else {
        console.log("Connected to MySQL Database!");
    }
});


// userQueries.js
const db = require('./db');

function findUserByEmail(email, cb) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return cb(err);
    // Return the first result if found, otherwise null
    return cb(null, results.length ? results[0] : null);
  });
}

function findUserById(id, cb) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return cb(err);
    return cb(null, results.length ? results[0] : null);
  });
}

module.exports = { findUserByEmail, findUserById };


module.exports = db;
