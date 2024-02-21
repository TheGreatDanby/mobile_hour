import express from "express";
import validator from "validator";

import {
    createProduct,
    deleteProductById,
    getAllProducts,
    getAllProductsWithLastUpdatedStaff,
    getProductById,
    getProductsBySearch,
    updateProductById,
    updateFeatureById,
    createFeatures,
    getProductsByIdAndFeatures,
} from "../models/products.js";
import access_control from "../access_control.js";
import { createChange } from "../models/product_changelog.js";



const productController = express.Router();

productController.get("/product_list", (request, response) => {
    if (request.query.search_term) {
        getProductsBySearch(request.query.search_term).then(([products]) => {
            response.render("product_list.ejs", { products: products });
        });
    } else {
        getAllProducts().then(([products]) => {
            response.render("product_list.ejs", { products: products });
        });
    }
});

productController.get("/product_checkout", (request, response) => {
    if (request.query.id) {
        if (!/[0-9]{1,}/.test(request.query.id)) {
            response.render("status.ejs", {
                status: "Invalid product ID",
                message: "Please pick another product.",
            });
            return;
        }

        getProductById(request.query.id).then(([products]) => {
            if (products.length > 0) {
                let product = products[0];
                response.render("product_checkout.ejs", { product: product });
            }
        });
    }
});

productController.get(
    "/product_admin",
    access_control(["manager", "stock"]),
    (request, response) => {
        const edit_id = request.query.edit_id;
        if (edit_id) {
            getProductsByIdAndFeatures(edit_id).then(([products]) => {
                // console.log(products)
                if (products.length > 0) {
                    const edit_product = products[0];

                    getAllProductsWithLastUpdatedStaff().then(([products]) => {
                        response.render("product_admin.ejs", {
                            products: products,
                            edit_product: edit_product,
                            access_role: request.session.user.access_role,
                            validator: validator
                        });
                    });
                }
            });
        } else {
            getAllProductsWithLastUpdatedStaff().then(([products]) => {
                response.render("product_admin.ejs", {
                    products: products,
                    edit_product: {
                        product_id: 0,
                        name: "",
                        stock: 0,
                        price: 0,
                        description: "",
                    },
                    access_role: request.session.user.access_role,
                    validator: validator
                });
            });
        }
    }
);

productController.post(
    "/edit_product",
    access_control(["manager", "stock"]),
    (request, response) => {
        const edit_details = request.body;

        if (!/^[0-9]{1,}$/.test(edit_details.feature_weight_g)) {
            response.status(400).render("status.ejs", {
                status: "Invalid weight value",
                message: "Please numbers only",
            });
            return;
        }

        if (!/^[0-9]{1,}$/.test(edit_details.feature_width_mm)) {
            response.status(400).render("status.ejs", {
                status: "Invalid width value",
                message: "Please numbers only",
            });
            return;
        }
        if (!/^[0-9]{1,}$/.test(edit_details.feature_height_mm)) {
            response.status(400).render("status.ejs", {
                status: "Invalid heigth value",
                message: "Please numbers only",
            });
            return;
        } if (!/^[0-9]{1,}$/.test(edit_details.feature_depth_mm)) {
            response.status(400).render("status.ejs", {
                status: "Invalid depth value",
                message: "Please numbers only",
            });
            return;
        } if (!/^[\w.\s]{1,}$/.test(edit_details.feature_operating_system)) {
            response.status(400).render("status.ejs", {
                status: "Invalid Operating System value",
                message: "Please text and numbers only",
            });
            return;
        } if (!/^[0-9.\"\s\w]{1,}$/.test(edit_details.feature_screen_size)) {
            response.status(400).render("status.ejs", {
                status: "Invalid Screen Size value",
                message: "Please numbers and . only",
            });
            return;
        } if (!/^[0-9x\s]{1,}$/.test(edit_details.feature_screen_resolution)) {
            response.status(400).render("status.ejs", {
                status: "Invalid Screen Resolution value",
                message: "Please numbers and x only",
            });
            return;
        } if (!/^[.\s\w&\-()]{1,}$/.test(edit_details.feature_cpu)) {
            response.status(400).render("status.ejs", {
                status: "Invalid CPU value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[\w\s]{1,}$/.test(edit_details.feature_ram)) {
            response.status(400).render("status.ejs", {
                status: "Invalid RAM value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[\w\,\s]{1,}$/.test(edit_details.feature_storage)) {
            response.status(400).render("status.ejs", {
                status: "Invalid Storage value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[\w\s]{1,}$/.test(edit_details.feature_battery)) {
            response.status(400).render("status.ejs", {
                status: "Invalid battery value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[\w()\"\s\/.,]{1,}$/.test(edit_details.feature_rear_camera)) {
            response.status(400).render("status.ejs", {
                status: "Invalid rear camera value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[\w()\"\s\/.,]{1,}$/.test(edit_details.feature_front_camera)) {
            response.status(400).render("status.ejs", {
                status: "Invalid front camera value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[\w\s]{1,}$/.test(edit_details.name)) {
            response.status(400).render("status.ejs", {
                status: "Invalid Name value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[\w\s]{1,}$/.test(edit_details.model)) {
            response.status(400).render("status.ejs", {
                status: "Invalid model value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[\w]{1,}$/.test(edit_details.manufacturer)) {
            response.status(400).render("status.ejs", {
                status: "Invalid manufacturer value",
                message: "Please numbers and text only",
            });
            return;
        } if (!/^[0-9]{1,}$/.test(edit_details.stock)) {
            response.status(400).render("status.ejs", {
                status: "Invalid stock value",
                message: "Please numbers only",
            });
            return;
        } if (!/^[0-9]{1,}$/.test(edit_details.price)) {
            response.status(400).render("status.ejs", {
                status: "Invalid price value",
                message: "Please numbers only",
            });
            return;
        } if (!/^[^<>]{1,}$/.test(edit_details.description)) {
            response.status(400).render("status.ejs", {
                status: "Invalid description value",
                message: "Please standard text only",
            });
            return;
        }


        if (edit_details.action == "create") {
            // TODO
            createFeatures(
                validator.escape(edit_details.feature_weight_g),
                validator.escape(edit_details.feature_height_mm),
                validator.escape(edit_details.feature_width_mm),
                validator.escape(edit_details.feature_depth_mm),
                validator.escape(edit_details.feature_operating_system),
                validator.escape(edit_details.feature_screen_size),
                validator.escape(edit_details.feature_screen_resolution),
                validator.escape(edit_details.feature_cpu),
                validator.escape(edit_details.feature_ram),
                validator.escape(edit_details.feature_storage),
                validator.escape(edit_details.feature_battery),
                validator.escape(edit_details.feature_rear_camera),
                validator.escape(edit_details.feature_front_camera),
            ).then(([result]) => {
                const feature_id = result.insertId;
                createProduct(
                    feature_id,
                    validator.escape(edit_details.name),
                    validator.escape(edit_details.model),
                    validator.escape(edit_details.manufacturer),
                    validator.escape(edit_details.stock),
                    validator.escape(edit_details.price),
                    validator.escape(edit_details.description),
                    request.session.user.staff_id
                ).then(([product_result]) => {
                    const product_id = product_result.insertId;
                    createChange(request.session.user.staff_id, `${edit_details.manufacturer} ${edit_details.name} with product ID ${product_id} was created.`, product_id,);
                    response.redirect("/product_admin");
                });
            });
        } else if (edit_details.action == "update") {
            updateProductById(
                validator.escape(edit_details.product_id),
                validator.escape(edit_details.name),
                validator.escape(edit_details.model),
                validator.escape(edit_details.manufacturer),
                validator.escape(edit_details.stock),
                validator.escape(edit_details.price),
                validator.escape(edit_details.description),
                request.session.user.staff_id
            ).then(([result]) => {
                updateFeatureById(
                    validator.escape(edit_details.feature_id),
                    validator.escape(edit_details.feature_weight_g),
                    validator.escape(edit_details.feature_height_mm),
                    validator.escape(edit_details.feature_width_mm),
                    validator.escape(edit_details.feature_depth_mm),
                    validator.escape(edit_details.feature_operating_system),
                    validator.escape(edit_details.feature_screen_size),
                    validator.escape(edit_details.feature_screen_resolution),
                    validator.escape(edit_details.feature_cpu),
                    validator.escape(edit_details.feature_ram),
                    validator.escape(edit_details.feature_storage),
                    validator.escape(edit_details.feature_battery),
                    validator.escape(edit_details.feature_rear_camera),
                    validator.escape(edit_details.feature_front_camera),
                ).then(([result]) => {
                    console.log(`updated product details with:`, edit_details)

                    createChange(request.session.user.staff_id, `${edit_details.manufacturer} ${edit_details.name} with product ID ${edit_details.product_id} was updated.`, edit_details.product_id,);
                    response.redirect("/product_admin");
                }).catch(error => {
                    console.log(`update product error`, error)
                })
            })
        }
        else if (edit_details.action == "delete") {
            deleteProductById(edit_details.product_id).then(([result]) => {
                // TODO: the delete changelog does not work
                // TODO: createChange(request.session.user.staff_id, `${edit_details.manufacturer} ${edit_details.name} with product ID ${edit_details.product_id} was deleted.`, edit_details.product_id,);
                response.redirect("/product_admin");
            }).catch(error => {
                response.status(500).render("status.ejs", {
                    status: "Product Error",
                    message: "Product can't be deleted. Orders are depended on it.",
                })
            });
        }

    }
)

export default productController;
