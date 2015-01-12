module.exports = {
    challenge_assigned:function(req, ret){
    	//update assigned to and by
    	//
    	var chal_id = req.param("chal_id");
        var user_id = req.param("id");
        var assigned_to = req.param("assigned_to");

        challange.update({chal_id:chal_id}, {chal_assigned_to:chal_assigned_to, chal_assigned_by:user_id, chal_assigned_on: new Date(), chal_status:0}).exec(function(err, chal_obj){
            if(err){
                ret(null, 1);
            }
    	});       
    },
    challenge_unassigned:function(req, ret){
        //move assigned to and by to prev list
        var chal_id = req.param("chal_id");
        var user_id = req.param("id");
        var assigned_to = req.param("assigned_to");

        Challenge.findOne({id:chal_id}).exec(function(err, chal_obj){
            chal_obj.chal_prev_assigned_to.push(chal_obj.chal_assigned_to);
            chal_obj.chal_prev_assigned_by.push(chal_obj.chal_assigned_by);
            chal_obj.chal_assigned_to="";
            chal_obj.chal_assigned_to="";
            chal_obj.chal_status = 0;
            chal_obj.save(function(err){
                if(err){
                    ret(null, 1);
                }
            });

        })

    },
    challenge_completed:function(req, ret){
        //update completed by and on
    }

};