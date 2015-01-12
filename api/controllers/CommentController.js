/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	add_comment: function(req, ret){
	    var id = req.param("id");
	    Comment.create({comment_by:req.user_id,comment_to:req.comment_to}).exec(function(error, user_obj) {
	        if (error) {
	            res.send(500, {error: "DB Error"});
	        } else {
	            res.send("OK");
		    }
		});
	},
};

