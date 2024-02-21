import { db_conn } from "../database.js";

// Read - Get all changelog entries
export function getAllChanges() {
    return db_conn.query(`
    SELECT * FROM staff_changelog
    INNER JOIN users ON staff_changelog.changelog_staff_id = users.user_id
    `);

}

// Create - Insert a new changelog entry
export function createChange(staff_id, description) {
    return db_conn.query(`
    INSERT INTO staff_changelog (changelog_staff_id, changelog_date, changelog_description)
    VALUES (?, NOW(), ?)
    `,
    [staff_id, description]
    );


}