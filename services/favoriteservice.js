model = require('../models/index.js')

var addFav = function(userID,radioN, stream , callback){

model.Favorite.create({
  userId:userID,
  radioName:radioN,
  radioStream:stream,

}).then(function(resfav){
  callback(resfav)
});

}


var findFav = function(userID,callback){
var fav=[];
model.Favorite.findAll({where: {userId: userID}}).then(function(radios){
  console.log("radioa 1 "+radios[0].radioName);
  console.log("radioa 2 "+radios[1].radioName);

  for (var i = 0; i< radios.length ; i++) {
      console.log("Radios names of favorite "+ radios[i].radioName)
      fav[i]=radios[i].radioName ;
  }
  callback(fav);
})

}



var findaFav = function(userID,radioN,callback){

model.Favorite.findOne({where: {userId: userID ,radioName:radioN}}).then(function(userFound){
  if(userFound){
  callback(true);
}else{
  callback(false);

}
})

}

var findRandFav = function(context,userID,callback){
  console.log("CALL findRandFav ");
    model.Favorite.findAll({where: {userId: userID }}).then(FavRadios=>{
        console.log("the favorite radios are "+FavRadios);
        RandomRadioNum=Math.floor((Math.random() * FavRadios.length));
        console.log("----------------"+FavRadios[RandomRadioNum].radioName+'----------------'+FavRadios[RandomRadioNum].radioStream);
        callback([FavRadios[RandomRadioNum].radioName,FavRadios[RandomRadioNum].radioStream]);
      })
}



var DeleteFav = function(context,userID,radioN , callback){

model.Favorite.destroy({where:{userId:userID,radioName:radioN}

}).then(function(resfav){
  callback(resfav)
});

}


module.exports.addFav = addFav;
module.exports.DeleteFav = DeleteFav;

module.exports.findFav = findFav;
module.exports.findaFav = findaFav;
module.exports.findRandFav =findRandFav;
