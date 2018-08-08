const userService = require('./services/userservice.js');





userService.findUsers(user,res, function(result){
  console.log("all users are here ---->");
  console.log("---"+result);
  console.log("---"+JSON.stringify(result));

})

const userService = require('../services/userservice.js');





userService.findUsers(user, function(result){
  console.log("all users are here ---->");
  console.log("---"+result);
  console.log("---"+JSON.stringify(result));

})
