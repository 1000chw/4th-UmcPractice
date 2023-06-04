import mysql from "mysql2/promise";

const dbconfig = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'chw66772368*',
    database: 'db2',

    multipleStatements: true
})

export default dbconfig;