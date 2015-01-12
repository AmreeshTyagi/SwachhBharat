exports.verify_token = function(auth_token, auth_provider, callback) {
        if (auth_provider == "fb") {
            console.log("Start verifying process..");
            AuthService.verify_fb_token(auth_token, function(user) {
                if (typeof callback === "function") {
                    callback(user);
                }
            });
        }
    },

    exports.verify_fb_token = function(auth_token, callback) {
        console.log("verifying token..");
        AuthService.get_fb_app_access_token(auth_token, function(access_token) {
            console.log("ACCESS TOKEN: " + access_token);
            if (access_token.length > 0) {
                AuthService.get_debug_token(access_token, auth_token, function(debug_token) {
                    console.log("DEBUG TOKEN: " + debug_token);
                    if (debug_token.data.app_id == sails.config.appconfig.fb_app_id && debug_token.data.is_valid == true) {
                        AuthService.get_fb_user(auth_token, function(user) {
                            console.log("USER DATA: " + user);
                            if (typeof callback === "function") {
                                callback(user);
                            }
                        });
                    }
                    else {
                        if (typeof callback === "function") {
                            callback(0);
                        }
                    }
                });
            }
            else {
                if (typeof callback === "function") {
                    callback(0);
                }
            }
        });
    },

    exports.get_fb_user = function(auth_token, callback) {

        var http = require('https'),
            options = {
                host: sails.config.appconfig.fb_app_host,
                port: 443,
                path: "/me?access_token=" + auth_token,
                method: 'GET'
            };

        var fb_data = "";

        var fb_request = http.request(options, function(fb_response) {
            fb_response.on('error', function(e) {
                console.log("Error in creating fb access_token:" + e.message);
            });
            fb_response.on('data', function(chunk) {
                fb_data += chunk;
                console.log(fb_data);
            });
            fb_response.on('end', function() {
                var object = JSON.parse(fb_data);
                if (object.verified) {
                    if (typeof callback === "function") {
                        callback(object);
                    }
                }
                else {
                    console.log("ERROR: " + fb_data);
                    callback("");
                }
            });
        }).end();

        return fb_data;
    },

    exports.get_fb_app_access_token = function(auth_token, callback) {

        console.log("Start get_fb_app_access_token");
        var app_id = sails.config.appconfig.fb_app_id;
        var app_secret = sails.config.appconfig.fb_app_secret;
        var host = sails.config.appconfig.fb_app_host;

        var http = require('https'),
            options = {
                host: host,
                port: 443,
                path: "/oauth/access_token?client_id=" + app_id + "&client_secret=" + app_secret + "&grant_type=client_credentials",
                method: 'GET'
            };

        var fb_data = "";
        console.log(options);

        var fb_request = http.request(options, function(fb_response) {
            //  console.log("fb_response"+fb_response);
            fb_response.on('error', function(e) {
                console.log("Error in creating fb access_token:" + e.message);
            });
            fb_response.on('data', function(chunk) {
                //  console.log("chunk"+chunk);
                fb_data += chunk;
                //console.log(fb_data);
            });
            fb_response.on('end', function() {
                if (fb_data.indexOf("access_token") > -1) {
                    if (typeof callback === "function") {
                        callback(fb_data.split('=')[1]);
                    }
                }
                else {
                    console.log("ERROR: " + fb_data);
                    callback("");
                }
            });
        }).end();
    },

    exports.get_debug_token = function(access_token, auth_token, callback) {
        console.log("Start get_debug_token");
        var http = require('https'),
            options = {
                host: sails.config.appconfig.fb_app_host,
                port: 443,
                path: "/debug_token?input_token=" + auth_token + "&access_token=" + access_token,
                method: 'GET'
            };

        var fb_data = "";

        var fb_request = http.request(options, function(fb_response) {
            fb_response.on('error', function(e) {
                console.log("Error in debugging token data:" + e.message);
            });
            fb_response.on('data', function(chunk) {
                fb_data += chunk;
                console.log(fb_data);
            });
            fb_response.on('end', function() {
                var object = JSON.parse(fb_data);
                if (object.data.is_valid) {
                    if (typeof callback === "function") {
                        callback(object);
                    }
                }
                else {
                    console.log("ERROR: " + fb_data);
                    callback("");
                }
            });
        }).end();

    },

    exports.get_long_lived_token = function(auth_token, callback) {
        console.log("Start get_long_lived_token");
        var http = require('https'),
            options = {
                host: sails.config.appconfig.fb_app_host,
                port: 443,
                path: "/oauth/access_token?grant_type=fb_exchange_token&client_id=" + sails.config.appconfig.fb_app_id + "&client_secret=" + sails.config.appconfig.fb_app_secret + "&fb_exchange_token=" + auth_token,
                method: 'GET'
            };

        var fb_data = "";

        var fb_request = http.request(options, function(fb_response) {
            fb_response.on('error', function(e) {
                console.log("Error in get_long_lived_token:" + e.message);
            });
            fb_response.on('data', function(chunk) {
                fb_data += chunk;
                console.log(fb_data);
            });
            fb_response.on('end', function() {
                if (fb_data.indexOf("access_token") > -1) {
                    if (typeof callback === "function") {
                        callback(fb_data.split('=')[1].split('&')[0]);
                    }
                }
                else {
                    console.log("ERROR: " + fb_data);
                    callback("");
                }
            });
        }).end();

    },

    exports.authenticate_user = function(user_id, auth_token,callback) {
        console.log("Calling authenticate_user for:" + user_id + " " + auth_token);
        User.findOne().where({
            user_id: user_id
        }).exec(function(err, usr) {
            if (err) {
                return true;
            }
            else if (usr) { //User Found in DB
                if (usr.auth_token == auth_token && usr.status == 1) {
                    console.log("USER AUTHENTICATED...");
                    callback(true);
                }
                else {
                    callback(false);
                }
            }
            else {
                callback(false);
            }
        });
    }