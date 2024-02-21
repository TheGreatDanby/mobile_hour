// Try to write this file based on the staff.js model before next week.

import { db_conn } from "../database.js";

// Create
// todo (create a join between product and feature)
// todo (create a join between product and change log)
// export function createProduct(
//     name,
//     description,
//     price,
//     stock,
//     log,
// ) {

//     return db_conn.query(
//         `
//     INSERT INTO Product (product_name, product_description, product_price, product_stock, last_update_staff_id)
//     VALUES (?, ?, ?, ?, ?)
// `,
//         [name, description, price, stock, log]
//     );
// }

// Read
export function getAllProducts() {
    return db_conn.query(`SELECT * FROM product`)
}

export function getProductById(product_id) {
    return db_conn.query(`SELECT * FROM product WHERE product_id = ?`, [product_id])
}

export function getProductsBySearch(search_term) {
    return db_conn.query(
        `SELECT * FROM product WHERE product_name LIKE ?`,
        [`%${search_term}%`]
    );
}

// Update
// todo (create a join between product and feature)
// todo (create a join between product and change log)
export function updateProductById(product_id,
    name,
    feature,
    price,
    stock,
    log,
) {
    return db_conn.query(
        `
        UPDATE product
        SET product_name = ?, product_feature = ?, product_price = ?, product_stock = ?, last_update_staff_id = ?,
        WHERE product_id = ?
`,
        [name, feature, price, stock, log, product_id]
    );
}

// Delete
export function deleteProductById(product_id) {
    return db_conn.query(`DELETE FROM product WHERE product_id = ?`, [product_id]);
}

