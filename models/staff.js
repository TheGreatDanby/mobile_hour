import { db_conn } from "../database.js";

// todo change the word staff for user

// Create
export function createStaff(
    first_name,
    last_name,
    role,
    username,
    password
) {

    return db_conn.query(
        `
    INSERT INTO users (user_first_name, user_last_name, user_role, user_username, user_password)
    VALUES (?, ?, ?, ?, ?)
`,
        [first_name, last_name, role, username, password]
    );
}

// Read
export function getAllStaff() {
    return db_conn.query(`SELECT * FROM users`)
}

export function getStaffById(staff_id) {
    return db_conn.query(`SELECT * FROM users WHERE user_id = ?`, [staff_id])
}

export function getStaffByUsername(username) {
    return db_conn.query(`SELECT * FROM users WHERE user_username = ?`, [username])
}

// Update
export function updateStaffById(
    staff_id,
    first_name,
    last_name,
    role,
    username,
    password
) {
    return db_conn.query(
        `
        UPDATE users
        SET user_first_name = ?, user_last_name = ?, user_role = ?, user_username = ?, user_password = ?
        WHERE user_id = ?
`,
        [first_name, last_name, role, username, password, staff_id]
    );
}

// Delete
export function deleteStaffById(staff_id) {
    return db_conn.query(`DELETE FROM users WHERE staff_id = ?`, [staff_id]);
}