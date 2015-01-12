/**
 * ChallengesController
 *
 * @description :: Server-side logic for managing challenges
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create_challenge:function(req, res){
	    //var id = req.param("id");
	   // var auth_token = req.param("auth_token");
	    //var auth_provider = req.param("auth_provider");
	   // var auth_token_expiry = req.param("auth_token_expiry");
	   var user_id = req.headers['sb-user-id'];
	    var data = JSON.parse(req.param("data"));
		data.chal_created_by=user_id;
	 	// UserService.UserAuthentication(req, function(err, options)
		// {
			// if(err){
			// 	res.send(500,"No data");
			// }
			Challenges.create(data).exec(function(err, challenge){
	 			if(challenge){
	 			    res.send(challenge);
	            }else{
	               	res.send(500,  { error: "DB Error" });
	            }
			});
		// });
 	}
};

