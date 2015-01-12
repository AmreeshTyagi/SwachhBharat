/**
* Activity.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  status:{ 
        type:"integer",
        defaultsTo:0
      },
      comment_list:{
        type:"array",
        defaultsTo:[]
      },
      is_deleted:{
        type:"integer",
        defaultsTo:0
      },
      helpers_list:{
        type:"array",
        defaultsTo:[]
      },
  }
};

