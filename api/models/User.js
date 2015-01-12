/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  }
};

module.exports = {
 
  attributes: {
      name:{
        type:"string",
        minLength: 2
      },      
      email:{
        type:"email",
      },
      phone:{
        type:"string",
      },
      status:{
        type:"integer",
        defaultsTo:1
      },
      completed_activities_list:{
        type:"array",
        defaultsTo:[]
      },
      declined_activities_list:{
        type:"array",
        defaultsTo:[]
      },
      pending_activities_list:{
        type:"array",
        defaultsTo:[]
      },
      helped_in_activities_list:{
        type:"array",
        defaultsTo:[]
      },
      profile_id:{
        type:'text'
      }
  }
};
