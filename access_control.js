// define a higher-order function that returns a middleware function
// to restrict access to specific users roles in the session variable 
// 
// takes as input an ary of allowed roles as strings 
export default function access_control(allowed_roles) {

    return function (request, response, next) {
        // check if the user is logged in (do they have a session)
        if (request.session.user != null) {

            // check if the user has o ne of the allowed roles
            if (allowed_roles.includes(request.session.user.access_role)) {
                // if they do: ket their request through
                next();
                // otherwise
            } else {
                // send bck an error: access denied
                response.status(403).render("status.ejs", {
                    status: "Access Denied",
                    message: "Invalid access role",
                });
            }
        } else {
            // otherwise (if logged in)
            // send back an error: not logged in
            response.status(401).render("status.ejs", {
                status: "Access Denied",
                message: "Not logged in",
            });
        }
    };
}