/**
 * ProfileController
 *
 * @description :: Server-side logic for managing profiles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	  profile: function(req, res) {
        Profile.findOne().where({
            user_id: req.headers['sb-user-id']
        }).exec(function(err, profile) {
            if (err) {
                 console.log(err);
                res.send(500, {
                    error: "DB Error1"
                });
            }
            else if (profile) { //User Found in DB
            console.log("sending profile..");
            console.log(profile);
                res.send(200, {
                    success: true,
                    profile: profile
                });
            }
        });
    },

	update_ext:function(req, res){
    var id = req.param("id");
    var auth_token = req.param("auth_token");
    var auth_provider = req.param("auth_provider");
    var auth_token_expiry = req.param("auth_token_expiry");
    var data = req.param("data");
 	UserService.UserAuthentication(req, function(err, options)
	{
		console.log(err)
		console.log(options)
		if(err) 
    	{
    		res.send(500)
   	 	}else{	//
   	 		console.log("help")
   	 						console.log(data)
   	 						console.log(JSON.parse(data))
 			Profile.update({user_id:id}, JSON.parse(data)).exec(function(err, usr) {
 				//Profile.update({user_id:id}, {"first_name":"Prince","lsat_name":"Dhiman","nick_name":"Helo","about_me":"123456"}).exec(function(err, usr) {
 				console.log("Profile")
 				console.log(data)
 				console.log(err)
				console.log(usr)
 				if(usr){
 				    res.send("OK")
            	}else{
                	res.send(500,  { error: "DB Error" })
            	}
 			});
    	}
	});
    
},

up:function(req, res){
    var id = req.param("id");
	console.log(UserService.find());
}


};

