module.exports = {
	activity_setStatus:function(act_id, status, ret){
		//change status of challenge


        Activity.update({id:act_id}, {status:status}).exec(function(err, activity_obj){
            if(err){
                ret(null, 1);
            }

    	});  

    },
    activity_helper_added:function(act_id, helper_id, ret){     
 		Activity.findOne({id:act_id}).exec(function(err, act_obj){
 			if(err){
 					ret(-1, null);
 			}
 			act_obj.helpers_list.push(user_id);
 			act_obj.helpers_list.save(function(err){
 				if(err){
 					ret(-1,null);
 				}
 				ret(act_obj,1);
 			});
 		});
    },
        

};
