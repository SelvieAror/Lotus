// const mysql = require('mysql2');
// require('dotenv').config();

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err.stack);
//         return;
//     }
//     console.log('Connected to MySQL database.');
// });

// module.exports = db;

// const mysql = require('mysql')
// const app = require('express')

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Mydatabase123456',
// })

// app.get('/createdb', (req, res) => {
//     let sql = 'CREATE DATABASE nodemysql'
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result)
//         res.send('database created')
//     })
// })

// db.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });