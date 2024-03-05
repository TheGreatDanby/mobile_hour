import mysql from "mysql2/promise"

export const db_conn = mysql.createPool({
    host: "127.0.0.1",
    user: "mobile-db-admin",
    password: "Pp687jgBTCooeDa9JP7c",
    database: "mobile"
});
