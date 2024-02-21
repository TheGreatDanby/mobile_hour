import express from "express";
import session from "express-session";
import { themeChange } from 'theme-change';

// Create and express application instance and define a port to listen on.
const app = express();
const port = 8080;

// themeChange(light);
// Express session middleware automatically a session cookie
// that is used t ogive persistent state between request, making the
// application (backend) stateful and thus overcoming the stateless nature of HTTP
app.use(session({
    secret: "telefonzelle",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


// Enable the ejs view engine
app.set("view engine", "ejs");

// enable support for url-encoded request bodies (from posts)
app.use(express.urlencoded({ extended: true }));

// Link up the controller files 
import productController from "./controllers/product_controller.js";
app.use(productController);
import orderController from "./controllers/orders_controller.js";
app.use(orderController);
import staffController from "./controllers/staff_controller.js";
app.use(staffController);
import changelogController from "./controllers/changelog.js";
app.use(changelogController);
import productChangelogController from "./controllers/product_changelog_controller.js";
app.use(productChangelogController);

// Redirect requests to root to the product page
app.get("/", (request, response) => {
    response.status(301).redirect("/product_list");
});

// Serve static resources
app.use(express.static("static"));

// This is a test endpoint
app.get("/hello", (request, response) => {
    response.json("Hello, World");
});

// Start the backend express server
app.listen(port, () => {
    console.log("Express server started on http://localhost:" + port);
});

"/product_changelog_admin"