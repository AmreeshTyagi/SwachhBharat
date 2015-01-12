/**
 * ActivityController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create_ext:function(req, res){
	    var id = req.param("id");
	    var auth_token = req.param("auth_token");
	    var auth_provider = req.param("auth_provider");
	    var auth_token_expiry = req.param("auth_token_expiry");
	    var data = JSON.parse(req.param("data"));
	    data.assigned_by=id;
	 	UserService.UserAuthentication(req, function(err, options)
		{
			if(err){
				res.send(500,"No data");
			}
			Activity.create(data).exec(function(err, challenge){
	 			if(data.chal_id){
	 					//Edit challenge and set status to assigned
	 					ChallengeService.challenge_assigned(id, data.chal_id, data.chal_assigned_to, function(err, chal_obj){
	 						if(err){
	 							res(500);
	 						}
	 					})


	 			    res.send("OK")
	            }else{
	               	res.send(500,  { error: "DB Error" })
	            }


			});
		});
 	},
 	assign_challenge:function(req, res){
 		var id = req.param("id");
	    var auth_token = req.param("auth_token");
	    var auth_provider = req.param("auth_provider");
	    var auth_token_expiry = req.param("auth_token_expiry");
	    var act_id = req.param("act_id");
	    var chal_id = req.param("chal_id");
	    data.assigned_by=id;
	 	UserService.UserAuthentication(req, function(err, options)
		{
			Activity.update({id: act_id}, {chal_id:chal_id}).exec(function(err, act_obj){
				if(err){
					res.send(500);
				}
				ChallengeService.challenge_assigned(id, chal_id, act_obj.assigned_to, function(err, res){
						if(err){
							res.send(500);
						}
						res.send(200);
				});

			});

		});
 	},
 	add_comment:function(req, res){
 		var id = req.param("id");
	    var auth_token = req.param("auth_token");
	    var auth_provider = req.param("auth_provider");
	    var auth_token_expiry = req.param("auth_token_expiry");
	    var activity_id = req.param("activity_id");
	 	UserService.UserAuthentication(req, function(err, options)
		{
			if(err){
				res.send(500,"No data");
			}
			CommentService.add_comment(req, function(err, commentObj){
				if(err){
					 res.send(500)
				}else
				{
					Activity.findOne().where({id:activity_id}).exec(function (err, activityObj) {
						activityObj.comment_list.push(commentObj.id);
						activityObj.save(function(err){
							if(err){
								res.send(500);
							}
						});
					});
				}
			});

		});
 	},
 	add_hepler:function(req, res){
 		var id = req.param("id");
	    var auth_token = req.param("auth_token");
	    var auth_provider = req.param("auth_provider");
	    var auth_token_expiry = req.param("auth_token_expiry");
	    var activity_id = req.param("activity_id");
	    var data = JSON.parse(req.param("data"));
	 	UserService.UserAuthentication(req, function(err, options)
		{
			if(err){
				res.send(500,"No data");
			}


		    Activity.findOne({id:act_id}).exec(function(err, act_obj){
	            for (helper in data.helper_list)
	            {
	            	act_obj.helper_list.push(helper);
	            	UserService.helped_in_activity(helper, act_id, function(err, ret){
	            		if(err){
	            			act_obj.helper_list.pop(helper);
	            		}

	            	});
	            }
	            user_obj.save(function(err){
	                if(err){
	                    ret(null, 1);
	                }
	            });

            }); 
		});
 	},

};

