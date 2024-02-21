import express, { request, response } from "express";
import { getAllProducts, getProductById, getProductsBySearch } from "../models/products.js";

// This line creates a router that connects all od the end point functions
// in this files up to the rest of the node application
// 
// Routers direct incoming request to the related end point.
const productController = express.Router();

productController.get("/product_list", (request, response) => {
    // If the user has provided search terms
    if (request.query.search_term) {
        getProductsBySearch(request.query.search_term).then(([products]) => {
            response.status(200).render("product_list.ejs", { products: products });

        });
    // Ask the model for products based on the search terms

    } else { // otherwise
    // ask for the list of products from the database (model)
    getAllProducts().then(([products]) => {
        // this code will run when the databasequery has finished and
        // the result are available to us.

        // Render the product list view and send it back to the browser
        response.status(200).render("product_list.ejs", { products: products });
    });
}

});

productController.get("/product_checkout", (request, response) => {
    // Check if the user has selected a product
    if(request.query.id){
    // Get the product that has been selected by it's ID (from the model)
        getProductById(request.query.id).then(([products]) => {
            // Check if at least one product came back
            if (products.length > 0){
                // get teh first product
                const product = products[0];
                // Render the checkout page with the product details 

            response.status(200).render("product_checkout.ejs", {product: product});
        }
        });
            
    }
});

// This line makes the controller available to the server.js
export default productController;