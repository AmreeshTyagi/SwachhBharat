/**
* Challenges.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
		chal_prev_assigned_to:{
				type:"array",
   			    defaultsTo:[]
		},
		chal_prev_assigned_by:{
				type:"array",
   			    defaultsTo:[]
		},
		chal_video_list:{
				type:"array",
   			    defaultsTo:[]
		},
		chal_pic_list:{
				type:"array",
   			    defaultsTo:[]
		},


  }
};

