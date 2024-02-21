import mysql from "mysql2/promise"

export const db_conn = mysql.createPool({
    host: "localhost",
    user: "mobile_root",
    password: "waterfall@sun",
    database: "mobile_hour"
});