// Try to write this file based on the staff.js model before next week.

import { db_conn } from "../database.js";

export function getAllOrdersByStatusWithProduct(status) {
    return db_conn.query(
        `
        SELECT * FROM orders
        INNER JOIN product
        ON orders.product_id = product.product_id
        WHERE orders.order_status = ?
    `,
        [status]
    );
}

export function getOrderWithProductById(order_id) {
    return db_conn.query(
        `
        SELECT *
        FROM orders
        INNER JOIN product
        ON orders.product_id = product.product_id
        WHERE orders.order_id = ?
    `,
        [order_id]
    );
}

// Create
export function createOrder(
    product_id,
    first_name,
    last_name,
    email,
    phone
) {

    return db_conn.query(
        `
    INSERT INTO orders (product_id, customer_first_name, customer_last_name, customer_email, customer_phone, order_status, order_datetime)
    VALUES (?, ?, ?, ?, ?, 'pending', NOW())
`,
        [product_id, first_name, last_name, email, phone]
    );
}


export function updateOrderStatusById(order_id, status) {
    return db_conn.query(
        `
        UPDATE orders
        SET order_status = ?
        WHERE order_id = ?
    `,
        [status, order_id]
    );
}

// Read
export function getAllOrders() {
    return db_conn.query(`SELECT * FROM orders`)
}

export function getOrderById(order_id) {
    return db_conn.query(`SELECT * FROM orders WHERE order_id = ?`, [order_id])
}
// look up how to get the most recent data entry
export function getOrderByDate(order_date) {
    return db_conn.query(`SELECT * FROM orders WHERE order_date = ?`[order_date])
}

// Update
// we should have an order status here to look up new orders and modify the order status and product
export function updateOrderById(order_id,
    date,
    product_id,
    first_name,
    last_name,
    email,
    phone
) {
    return db_conn.query(
        `
        UPDATE orders
        SET order_date = ?, product_id = ?, customer_first_name = ?, customer_last_name = ?, customer_email, customer_phone = ?,
        WHERE order_id = ?
`,
        [date, product_id, first_name, last_name, email, phone, order_id]
    );
}
// Delete
export function deleteOrderById(order_id) {
    return db_conn.query(`DELETE FROM orders WHERE order_id = ?`, [order_id]);
}