var Sequelize = require('sequelize');
const UserModel = require('../models/userG')
const CountryModel = require('../models/country')
const GenreModel = require('../models/genre')
const RadioModel = require('../models/radio')
const FavoriteModel = require('../models/favoriteG')


/*
const userService = require('../services/userservice.js');
const radioService = require('../services/radioservice.js');

*/
var pg = require('pg');
pg.defaults.ssl = true;


const sequelize = new Sequelize('AvempaceVoiceAssistantRadioManager', 'postgres', 'postgres', {

  host: '54.37.64.178',
  port: 5432 ,
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})


const User = UserModel(sequelize, Sequelize)
const Country = CountryModel(sequelize, Sequelize)
const Genre = GenreModel(sequelize, Sequelize)
const Radio = RadioModel(sequelize, Sequelize)
const Favorite = FavoriteModel(sequelize, Sequelize)


/**
 * orm specification for the relation between tables
 * hasMany for one to many relatiuon
 * Belongsto fo one to one relation
 * HasOne for one to one relation
 * belongstoMany for many to many relation
 */
 //const RadioCountry = sequelize.define(' Radio_Country', {})
 //const GenreRadio = sequelize.define(' Genre_Radio', {})

    Radio.belongsTo(Country);
    Radio.belongsTo(Genre);
    Radio.belongsTo(Country);
  //  Genre.belongsToMany(Radio, { through:  GenreRadio, unique: false,  })


/*
userService.findUsers(User, function(result){
      console.log("all users are here ---->");
      console.log("---"+JSON.stringify(result));
    })*/
/*
userService.createUser(User,"salma"," salma@hotmail.com","meme", function(result){
          console.log("this is a new user  ---->");
          console.log("---"+result);
          console.log("---"+JSON.stringify(result));

        })
*/
/*
var getRadioByCountryy =function(CountryName,callback){
  console.log("--------in the index ----"+CountryName.value);
radioService.getRadioByCountry(Country,Radio,CountryName.value, function(result){

  console.log("------------> the getRadiosByCountry resulta in index is ---> :"+JSON.stringify(result[0]));

 for (var i = 0, len = result.length; i < len; ++i) {
      console.log("Radios nuber "+i+" is  : "+ result[i].name)
  }

})
callback(result);
}*/

/*var getRadioByCountry = function(context,Country,Radio,countryName,callback){

Country.findOne({where:{name:countryName}})
.then(CountryInst => {return CountryInst.get()})
.then(countryData => {return Radio.findAll({where :{countryId: countryData.id}})
// .then(countryRadios=> {return countryRadios.get()})
.then(countryRadios=>{
callback(countryRadios)
})
})
};*/
/*
getRadioByCountry(Country,Radio,"Canada", function(res){
    console.log("----------getRadioByCountryService.getRadioByCountryy in app .js ------------");
    //console.log("------------> the getRadiosByCountry resulta is ---> :"+JSON.stringify(result));

    for (var i = 0, len = res.length; i < len; ++i) {
        console.log("Radios number "+i+" is  : "+ res[i].name)
    }

  })

*/
//module.exports.getRadioByCountry = getRadioByCountry;

/*
sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  })*/

    module.exports = {
      User ,
      Country,
      Genre,
      Radio,
      Favorite
    }



module.exports.sequelize = sequelize;
