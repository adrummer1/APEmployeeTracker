async function main() {

    const mysql = require('mysql2');

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3302,
        user: 'root',
        password: process.env.MYSQL_PASSWORD,
        database: 'employees_db'
    });

    connection.connect((err) => {
        if (err) throw err;
        console.log('Error connecting to the MySQL database.')
    });
};

main();

module.exports = connection;