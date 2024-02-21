// Try to write this file based on the staff.js model before next week.

import { db_conn } from "../database.js";

export function getAllOrdersByStatusWithProduct(status) {
    return db_conn.query(
        `
        SELECT * FROM orders
        INNER JOIN product
        ON orders.order_product_id = product.product_id
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
        ON orders.order_product_id = product.product_id
        WHERE orders.order_id = ?
    `,
        [order_id]
    );
}

// Create
// TODO create a join between orders and products

export function createOrder(
    product_id,
    first_name,
    last_name,
    email,
    phone,
    address
) {

    return db_conn.query(
        `INSERT INTO orders (
            order_customer_first_name,
            order_customer_last_name,
            order_customer_email,
            order_customer_phone,
            order_customer_address,
            order_product_id,
            order_status,
            order_date)
        VALUES ( ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
        [first_name, last_name, email, phone, address, product_id]
    );
}

// // TODO: INSERT rows into order_lines with the order and product IDs, 
// // TODO: after the order has been made (otherwise there won't be an order ID)

// // TODO: update order.controller to work with the new query

// export function createOrderLines(
//     product_id,
//     quantity,
//     order_id
// ) {
//     return db_conn.query(
//         `
//     INSERT INTO order_lines (order_line_product_id, order_line_quantity, order_line_order_id)
//     VALUE (?, ?, ?)
//     `,
//         [product_id, quantity, order_id]);
// }


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
// TODO create a join between orders and products
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
        SET order_date = ?, product_id = ?, user_first_name = ?, user_last_name = ?, user_email, user_phone = ?,
        WHERE order_id = ?
`,
        [date, product_id, first_name, last_name, email, phone, order_id]
    );
}
// Delete
export function deleteOrderById(order_id) {
    return db_conn.query(`DELETE FROM orders WHERE order_id = ?`, [order_id]);
}