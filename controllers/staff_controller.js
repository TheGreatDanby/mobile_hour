import express, { query, request, response } from "express";
import bcrypt from "bcryptjs";
import { createStaff, deleteStaffById, getAllStaff, getStaffById, getStaffByUsername, updateStaffById } from "../models/staff.js";
import access_control from "../access_control.js";
// import { createChange } from "../models/changelog.js";


const staffController = express.Router();

// This endpoint will serve the login page view
staffController.get("/staff_login", (request, response) => {
    response.render("staff_login.ejs");
});

// This endpoint will accept login request 
staffController.post("/staff_login", (request, response) => {
    const login_username = request.body.username;
    const login_password = request.body.password;

    // these lines are just here for the debugging
    console.log(login_username);
    console.log(login_password);

    // Get a staff with a matching username
    getStaffByUsername(login_username).then(([staffs]) => {
        // Check if we got at least one staff member
        if (staffs.length >= 1) {
            const staff = staffs[0]; // get the first matching staff member
            // Compare the password hash from the database with the login password
            //      if the passwords match - login the user 
            if (bcrypt.compareSync(login_password, staff.user_password)) {
                request.session.user = {
                    staff_id: staff.user_id,
                    access_role: staff.user_role,
                };
                // login is complete - send ser to the order page
                response.redirect("/staff_admin");
            } else {
                //      send back an error - wrong password
                response.render("status.ejs", { status: "Invalid password" });
            }
        } else {
            // if no matching usernames - send back an error - no matching user
            response.render("status.ejs", { status: "Username not found" });

        }

    });
});
// This endpoint will handle logout request
staffController.get("/staff_logout", (request, response) => {
    // clear the the session (this make the backend forget the user is logged in)
    request.session.destroy()
    // redirect back to the homepage
    response.redirect("/")
});

// This endpoint with to serve the staff admin CRUD page and
// handel the create, read, update, delete action.
staffController.get("/staff_admin", access_control(["manager"]), (request, response) => {
    // This page has two modes:
    // 1) Show just the list and an empty edit form.
    // 2) Show the list and then edit form with the details of the current
    // edit-id staff member.

    // Access the edit_id form the url query string
    const edit_id = request.query.edit_id

    // If the edit_id has been specified then we show variant 2) otherwise show variant 1)
    if (edit_id) {
        // Show page variant 2)

        // Load the edit_id staff members details
        getStaffById(edit_id).then(([staffs]) => {
            // Did we find a matching staff member
            if (staffs.length > 0) {
                const staff = staffs[0]

                // We now have the staff member to edit. We still need
                // to load the list of all staff members.
                getAllStaff().then(([staffs]) => {
                    response
                        .status(200)
                        .render("staff_admin.ejs", {
                            access_role: request.session.user.access_role,
                            staffs: staffs,
                            edit_staff: staff,
                        });
                });
            };
        });
    } else {
        // Show page variant 1)

        getAllStaff().then(([staffs]) => {
            response
                .status(200)
                .render("staff_admin.ejs", {
                    access_role: request.session.user.access_role,
                    staffs: staffs,
                    edit_staff: {
                        staff_id: 0,
                        staff_first_name: "",
                        staff_last_name: "",
                        staff_access_role: "",
                        staff_username: "",
                        staff_password: "",

                    },
                });
        });
    };


});

// this endpoint defines the create, update and delete logic for
// the edit form. This cde runs whenever a button is pressed on the form.
staffController.post("/edit_staff", (request, response) => {
    // This endpoint has 3 possible actions:
    // (create) insert a new staff row into the datababes suing the
    // data in the form to populate the new row.
    // (Update) updates an existing row in the database by id (from the
    // hidden staff_id input form).
    // (Delete) deletes a staff row in the database by the id in the
    // hidden staff_id input of the form.

    // Access the form data from the request
    const edit_details = request.body;

    // Determine action based on form action
    if (edit_details.action == "create") {
        createStaff(
            edit_details.first_name,
            edit_details.last_name,
            edit_details.access_role,
            edit_details.username,
            bcrypt.hashSync(edit_details.password),
        ).then(([result]) => {
            // createChange(request.session.user.staff_id, `New staff member created with username ${edit_details.username}`,);
            response.redirect("/staff_admin");
        });

    } else if (edit_details.action == "update") {
        // If the password is NOT hashed.
        if (!edit_details.password.startsWith("$2a")) {
            // Hash the password
            edit_details.password = bcrypt.hashSync(edit_details.password);
        }

        updateStaffById(
            edit_details.staff_id,
            edit_details.first_name,
            edit_details.last_name,
            edit_details.access_role,
            edit_details.username,
            edit_details.password
        ).then(([result]) => {
            // createChange(request.session.user.staff_id, `Staff member with username ${edit_details.username} updated.`,);
            response.redirect("/staff_admin");
        });

    } else if (edit_details.action == "delete") {
        deleteStaffById(edit_details.staff_id).then(([result]) => {
            // createChange(request.session.user.staff_id, `Staff member with username ${edit_details.username} deleted.`,);

            response.redirect("/staff_admin");
        });

    }


});


staffController.get("/whoami", (request, response) => {
    if (request.session.user) {
        response.json(request.session.user);
    } else {
        response.json("No session");
    }
});
export default staffController;