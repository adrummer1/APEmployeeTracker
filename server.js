async function main() {

    const mysql = require('mysql2');

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'test'
    });
};