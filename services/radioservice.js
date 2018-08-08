model = require('../models/index.js')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

var getRadioListFromCountry = function(context,CountryName,callback){
console.log("CALL getRadioListFromCountry ");
model.Country.findOne({where:{name: CountryName}})
.then(CountryInst => {return CountryInst.get();                        })
.then(countryData => {return model.Radio.findAll({where :{countryId: countryData.id}})
.then(countryRadios=>{
//generate 4 rand diff radio
var arr = []
if(countryRadios.length>4){
while(arr.length < 5){
    var randomnumber = Math.floor(Math.random()*countryRadios.length);
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;

}}else{
  for(var i=0;i<countryRadios.length;i++){
  arr[i]=i;
  }
}
console.log(arr);
var myArray = [];

    for(var i=0;i<countryRadios.length;i++){
myArray.push(countryRadios[arr[i]].name);
      if(i==4){
        break;
      }
    }
    myArray.push(countryRadios.length);
  console.log("result is this " +myArray);
    callback(myArray);

})
})
};

var getRadioFromCountry = function(context,countryName,callback){
  console.log("CALL getRadioFromCountry");
    model.Country.findOne({where:{name: countryName}})
    .then(CountryInst => {return CountryInst.get()})
    .then(countryData => {return model.Radio.findAll({where :{countryId: countryData.id}})
   // .then(countryRadios=> {return countryRadios.get()})
    .then(countryRadios=>{

        RandomRadioNum=Math.floor((Math.random() * countryRadios.length));
        console.log(countryRadios[RandomRadioNum].name);
        callback(countryRadios[RandomRadioNum].name);
})
})
}

var getRadioListByGenre = function(context,Genre,callback){
console.log("CALL getRadioListByGenre ");
model.Genre.findOne({where:{name: Genre}})
.then(GenreInst => {return GenreInst.get();                        })
.then(GenreData => {return model.Radio.findAll({where :{genreId: GenreData.id}})
.then(GenreRadios=>{
//generate 4 rand diff radio
console.log("=========="+GenreRadios.length);
var arr = [];

if(GenreRadios.length>4){
while(arr.length < 5){
    var randomnumber = Math.floor(Math.random()*GenreRadios.length);
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
}}else{
  for(var i=0;i<GenreRadios.length;i++){
  arr[i]=i;
  }
}
console.log(arr);

var myArray =[];
    for(var i=0;i<GenreRadios.length;i++){
myArray.push(GenreRadios[arr[i]].name);
      if(i==4){
        break;
      }
    }
    myArray.push(GenreRadios.length);
  console.log("result is this " +myArray);
    callback(myArray);
})
})
};

var getRadiosByGenre = function(context,genreName, callback){
  //{[ Op.iLike ]:'%'+
  console.log("genreName  = "+genreName);
    model.Genre.findOne({where :{name:genreName}})
    .then(GenreInst => {return GenreInst.get()})
    .then(genreData => {return model.Radio.findAll({where :{genreId: genreData.id}})
    .then(genreRadios=>{

        RandomRadioNum=Math.floor((Math.random() * genreRadios.length));
        console.log("------------radio random name ", genreRadios[RandomRadioNum].name);
        callback(genreRadios[RandomRadioNum].name);
})
})
}

module.exports.getRadioListByGenre = getRadioListByGenre
module.exports.getRadiosByGenre = getRadiosByGenre;
module.exports.getRadioFromCountry = getRadioFromCountry;
module.exports.getRadioListFromCountry = getRadioListFromCountry;
