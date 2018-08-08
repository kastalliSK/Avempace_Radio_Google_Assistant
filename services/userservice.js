
model = require('../models/index.js')
var createUser = function(userID, callback){

model.User.create({
  userId:  userID,
}).then(function(resuser){
  callback(resuser)
});

}


var findUsers = function(User,callback){

model.User.findAll().then(function(users){
  callback(users);
})

}

var findaUser = function(userID,callback){

model.User.findOne({where: {userId: userID}}).then(function(userFound){
  if(userFound){
  callback(true);
}else{
  callback(false);

}
})

}



module.exports.createUser = createUser;

module.exports.findUsers = findUsers;
module.exports.findaUser = findaUser;
