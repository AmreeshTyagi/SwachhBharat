module.exports = function(req, res, next) {
    console.log("req.isAuthenticated before:" + req.isAuthenticated);
    var auth_token = req.headers['sb-auth-token'];
    var user_id = req.headers['sb-user-id'];
    req.isAuthenticated = false;
    AuthService.authenticate_user(user_id, auth_token, function(success) {
        if (success) {
            req.isAuthenticated = success;
            console.log("User authenticated: " + req.isAuthenticated);
            next();
        }
        else {
            console.log("Unauthorized access.");
           res.send(200, {success:false,message: "You are not permitted to perform this action."});
        }
    });
}