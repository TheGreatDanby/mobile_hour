import express, { response } from "express";
import access_control from "../access_control.js";
import { getAllChanges } from "../models/product_changelog.js";

const changelogController = express.Router();

changelogController.get(
    "/product_changelog_admin",
    access_control(["manager"]),
    (request, response) => {
        // query all changelog entries
        getAllChanges().then(([changes]) => {
            // Render a changelog list page
            response
                .status(200)
                .render("product_changelog.ejs", {
                    changes: changes,
                    access_role: request.session.user.access_role,
                });
        });

    }
);

// Endpoints here

export default changelogController;