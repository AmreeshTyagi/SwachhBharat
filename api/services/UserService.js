module.exports = {
	UserAuthentication: function(req, ret){
    var id = req.param("id");
    var app_id = req.param("app_id");
    var auth_token = req.param("auth_token");
    var auth_provider = req.param("auth_provider");
    var auth_token_expiry = req.param("auth_token_expiry");
    User.findOne().where({user_id:id}).exec(function(err, usr) 
    {
    if (err) {
            ret(-1, null);
            return;
        }
    else if(usr){       //User Found in DB
            if(usr.auth_token == auth_token &&( (new Date() - usr.updatedAt)< usr.auth_token_expiry)){
                ret(null,1);
                return;
                }
            else{
                ret(-2, null);
                return;
            }
    }
    else{
             ret(-3, null);
                return;
        }
    });
    },
    activity_declined:function(req, ret){
        var a_id = req.param("activity_id");
        var user_id = req.param("user_id");
        User.finOne({user_id:user_id}).exec(function(err, user_obj){
            user_obj.pending_activities_list.pop(a_id);
            user_obj.declined_activities_list.push(a_id);
            user_obj.save(function(err){
                if(err){
                    ret(null, 1);
                }
            });

        });
    },
    activity_accepted:function(req, ret){
        var a_id = req.param("activity_id");
        var user_id = req.param("user_id");
        User.findOne({user_id:user_id}).exec(function(err, user_obj){
            user_obj.pending_activities_list.pop(a_id);
            user_obj.accepted_activities_list.push(a_id);
            user_obj.save(function(err){
                if(err){
                    ret(null, 1);
                }
            });

        });            
    },
    helped_in_activity:function(req, ret){
        var a_id = req.param("activity_id");
        var user_id = req.param("user_id");
        User.findOne({user_id:user_id}).exec(function(err, user_obj){
            user_obj.helped_in_activities_list.push(a_id);
            user_obj.save(function(err){
                if(err){
                    ret(null, 1);
                }
            });

        });        
    },
    assigned_activity:function(req, ret){
        var a_id = req.param("activity_id");
        var user_id = req.param("user_id");
        var assigned_to = req.param("assigned_to");
        User.findOne({user_id:assigned_to}).exec(function(err, user_obj){
            user_obj.pending_activities_list.push(a_id);
            user_obj.save(function(err){
                if(err){
                    ret(null, 1);
                }
            });

        });        
    },

};