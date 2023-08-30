// Connecting to the mysql databases
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'LMP10012004',
    database: 'employees'
});

connection.connect((err) => {
    if (err) { 
    throw err;
    console.log('Error connecting to the MySQL database.')
    }
});


module.exports = connection;