module.exports = {
	add_comment:function(req, ret){
        var user_id= req.param("id");
        var activity_id= req.param("activity_id");
        var comment_body = req.param("comment_body");
        Comment.create({comment_by:user_id,activity_id:activity_id, comment_body:comment_body}).exec(function(error, user_obj) {
            if (error) {
                ret(-1, null)
            } else {
                ret(null, user_obj)
            }
        });
    },
    comment_liked:function(req, ret){
        var c_id = req.param("c_id");
        var comment_liked_by = req.param("comment_liked_by");
        Comment.finOne({comment_id:cid}).exec(function(err, comment_obj){
            comment_obj.comment_liked_by.push(comment_liked_by);
            comment_obj.save(function(err){
                if(err){
                    ret(null, 1);
                }
            });

        });
    }

};

