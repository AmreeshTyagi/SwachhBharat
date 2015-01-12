/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var UserFunc = {

    login: function(req, res) {
        var auth_token = req.param("auth_token");
        var auth_provider = req.param("auth_provider");
        var auth_token_expiry = "";

        AuthService.verify_token(auth_token, auth_provider, function(user) {
            console.log("User Is: " + user);
            if (user) {
                User.findOne().where({
                    user_id: user.id
                }).exec(function(err, usr) {

                    console.log(err);
                    console.log(usr);
                    if (err) {
                        res.send(500, {
                            error: "DB Error1"
                        });
                    }
                    else if (usr) { //User Found in DB

                        AuthService.get_long_lived_token(auth_token, function(long_auth_token) {
                            console.log("LTOKEN: " + long_auth_token);

                            User.update({
                                user_id: usr.user_id
                            }, {
                                auth_token: long_auth_token,
                                auth_token_expiry: auth_token_expiry
                            }).exec(function(error, updated_user) {
                                if (error) {
                                    res.send(500, {
                                        error: "Error in Logging"
                                    });
                                }
                                else {
                                    console.log("usr.id:  " + usr.user_id);
                                    res.send(200, {
                                        success: true,
                                        auth_token: long_auth_token,
                                        user_id: usr.user_id
                                    });
                                }
                            });

                        });
                    }
                    else { //User not found in DB
                        Profile.create({
                            user_id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            nick_name: user.name,
                            about_me: "This is my profile on Swachh Bharat APP.",
                            gender: user.gender
                        }).exec(function(error, profile) {
                            if (error) {
                                res.send(500, {
                                    error: "Error in creating profile"
                                });
                            }
                            else {
                                ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;

                                AuthService.get_long_lived_token(auth_token, function(long_auth_token) {
                                    console.log("LTOKEN for new USER: " + long_auth_token);
                                    User.create({
                                        user_id: user.id,
                                        profile_id: profile.id,
                                        appid: sails.config.appconfig.fb_app_id,
                                        auth_token: long_auth_token,
                                        auth_provider: auth_provider,
                                        auth_token_expiry: auth_token_expiry
                                    }).exec(function(error, user_obj) {
                                        if (error) {
                                            res.send(500, {
                                                error: "DB Error"
                                            });
                                        }
                                        else {
                                            res.send(200, {
                                                success: true,
                                                auth_token: long_auth_token,
                                                user_id: user_obj.user_id
                                            });
                                        }
                                    });
                                });


                            }
                        });
                    }
                });
            }
            else {
                res.send(200, {
                    success: false
                });
            }
        });
    },

    create_ext: function(req, res) {
        var id = req.param("id");
        var app_id = req.param("app_id");
        var auth_token = req.param("auth_token");
        var auth_provider = req.param("auth_provider");
        var auth_token_expiry = req.param("auth_token_expiry");
        var email = req.param("email");
        User.findOne().where({
            id: id
        }).exec(function(err, usr) {
            console.log(usr)
            console.log(err)
            if (err) {
                res.send(500, {
                    error: "DB Error1"
                });
            }
            else {
                console.log(usr)
                if (usr) {
                    res.send(404, {
                        error: "User already Exist"
                    });

                }
                else {
                    Profile.create({
                        user_id: id
                    }).exec(function(error, profile) {
                        if (error) {
                            res.send(500, {
                                error: "Error in creating profile"
                            });
                        }
                        else {
                            ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;
                            var o_id = new ObjectID(id);
                            User.create({
                                id: o_id,
                                profile_id: profile.id,
                                appid: app_id,
                                auth_token: auth_token,
                                auth_provider: auth_provider,
                                auth_token_expiry: auth_token_expiry
                            }).exec(function(error, user_obj) {
                                if (error) {
                                    res.send(500, {
                                        error: "DB Error"
                                    });
                                }
                                else {
                                    res.send("OK");
                                }
                            });

                        }
                    });
                    //Create Empty Profile 
                }

            }
        });
    }
};


module.exports = UserFunc;