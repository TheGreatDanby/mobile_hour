import express, { request, response } from "express";

const cartController = express.Router();

cartController.get ("/cart", (request, response) => {
    // access session shopping cart items

    // render page using shopping card items
})

cartController.post ("checkout", (request, response) => {
    // create an order now in the database 
    
    // get the session shopping cart items

    // loop through items, inserting a new order lon for each that
    // recreance the order id.

    // redirect to order status page 
})

cartController.post("/add_to_cart", (request,response) => {
    // add the item id and details to session shopping cart items
});

cartController.post("/remove_from_cart", (request,response) => {
    // remove the item by id from the session shopping cart items
});