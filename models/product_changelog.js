import { db_conn } from "../database.js";

// Read - Get all changelog entries
export function getAllChanges() {
    return db_conn.query(`
    SELECT * FROM changelog
    INNER JOIN users ON changelog.changelog_user_id = users.user_id
    ORDER BY changelog_change_date DESC
    `);

}

// Create - Insert a new changelog entry
export function createChange(staff_id, description, product_id) {
    return db_conn.query(`
    INSERT INTO changelog (changelog_user_id, changelog_change_date, changelog_change_description, changelog_product_id)
    VALUES (?, NOW(), ?, ?)
    `,
    [staff_id, description, product_id]
    );


}