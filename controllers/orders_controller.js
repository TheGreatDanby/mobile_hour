import express, { request, response } from "express";
import validator from "validator";
import { createOrder, getOrderById, getOrderWithProductById, getAllOrdersByStatusWithProduct, updateOrderStatusById,  } from "../models/order.js";
import access_control from "../access_control.js";

const orderController = express.Router();

orderController.post("/create_order", (request, response) => {
    // check if the request has order details in the body
    if (request.body) {
        //  access the data in the request body (this is the from data)
        const order_details = request.body;


        // validate each input and send back an error if invalid

        // this if statement will run if we input invalid
        if (!/[0-9]{1,}/.test(order_details.product_id)) {
            response.status(400).render("status.ejs", {
                status: "Invalid product ID",
                message: "Please pick another product",
            });
            return;
        }
        if (!/^[a-zA-Z-]{2,}$/.test(order_details.customer_first_name)) {
            response.status(400).render("status.ejs", {
                status: "Invalid first name",
                message: "First name must be letters",
            });
            // important - return early so the end point doesn't run any further
            return;
        }
        if (!/^[a-zA-Z-]{2,}$/.test(order_details.customer_last_name)) {
            response.status(400).render("status.ejs", {
                status: "Invalid last name",
                message: "Last name must be letters",
            });
            // important - return early so the end point doesn't run any further
            return;
        }
        if (!/^[+0-9 ]{8,}$/.test(order_details.customer_phone)) {
            response.status(400).render("status.ejs", {
                status: "Invalid phone number",
                message: "Phone number must be a valid format",
            });
            return;
        }
        // if (!/^\S{1,}@\S{1,}[.]\S{1,}$/.test(order_details.customer_email)) {
        if (!validator.isEmail(order_details.customer_email)) {       
            response.status(400).render("status.ejs", {
                status: "Invalid email",
                message: "email must be a valid format",
            });
            return;
        }
        if (!/^[a-zA-Z-+0-9 ]{2,}$/.test(order_details.customer_address)) {
            response.status(400).render("status.ejs", {
                status: "Invalid address",
                message: "Address must be letters adn numbers",
            });
            // important - return early so the end point doesn't run any further
            return;
        }
        validator.isMobilePhoneLocales['en-AU']


        // call the model function to create an order
        createOrder(
            validator.escape(order_details.product_id),
            validator.escape(order_details.customer_first_name),
            validator.escape(order_details.customer_last_name),
            validator.escape(order_details.customer_email),
            validator.escape(order_details.customer_phone),
            validator.escape(order_details.customer_address)
        ).then(([result]) => {
        
        // createOrderLines(
        //     order_line.product_id,
        //     order_line.quantity,
        //     order_line.order_id
        // ).then(([result]) => {

        // })
            // TODO: now that we've created the order, we need to take the order ID
            // TODO: we've inserted and use it to create the order_lines, THEN redirect
            // then redirect to the order confirmation page 
            response.redirect("/order_confirmation?id=" + result.insertId);
        });
    }
});

orderController.get("/order_confirmation", (request, response) => {
    const order_id = request.query.id;

    // check that we actually have an oder ID
    if (order_id) {
        getOrderWithProductById(order_id)
            .then(([orders_with_products]) => {
                // check that we found at least one order
                if (orders_with_products.length > 0) {
                    const order_with_product = orders_with_products[0]

                    // Render the order confirmation page with the order/product data
                    response.status(200).render("order_confirmation.ejs", {
                        order_with_product: order_with_product,
                    });
                }
            });
    }
});

orderController.get("/order_admin",access_control(["manager", "sales"]), (request, response) => {
    let order_status = request.query.status

    // TODO: add validation to check for valid order status filter


    // if an order status filter was NOT provided we
    // set a default order status filter of "pending"
    if (!order_status) {
        order_status = "pending";

    }


    // get orders by status model function
    getAllOrdersByStatusWithProduct(order_status)
        .then(([order_with_product]) => {
            // render the order admin view with the order rows
            response.status(200).render("order_admin.ejs", {
                access_role: request.session.user.access_role,
                orders: order_with_product,

            })
        })

    // render the order admin view with the order rows
});

orderController.post("/order_admin", access_control(["manager", "sales"]),(request,response) => {
    const edit_details = request.body;

    updateOrderStatusById(edit_details.order_id, edit_details.status)
    .then(([result]) => {
            if (result.affectedRows > 0){
                response.redirect("/order_admin")
            } else {
                response.status(500).render("status.ejs", {
                    status: "Failed to update order status",
                    message: "no records updated",
                });
            }
        })
        .catch((error) => {
            response.status(500).render("status.ejs", {
                status: "Query error",
                message: "Failed to execute update query",
            });
        });
});

export default orderController; 