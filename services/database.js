
var pg = require("pg");


//var connectionString = "postgres://postgres@54.37.64.178:5432/AvempaceVoiceAssistantRadioManager";

const config = {
    user: 'postgres',
    database: 'AvempaceVoiceAssistantRadioManager',
    password: 'postgres',
    port: 5432 ,
    host : '54.37.64.178'

};


var getRadioStream = function(context,name, callback){

console.log("Query for Radio: "+name);
const pool = new pg.Pool(config);

  const results = [];
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
          callback(err);
       }
       const query = client.query('SELECT stream FROM radios where name = $1',[name],function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               callback(null);
           }
           if(!result || result.rows.length ==0){
             callback(null);
           }else {
              var stream_url = result.rows[0].stream;
              console.log("the stream ------> " + stream_url);
                callback(stream_url,context);
           }


          // var myJSON = JSON.stringify(result.rows);
          // i=1;
        //  var resu = myJSON.substring(12,1000);
        /*   while (resu[i]!=="\"") {
                 i++;
               };
           var resuu = resu.substring(0,i);*/


    });
    });

  };


var getNamesByCountries = function(context,country, callback){

const pool = new pg.Pool(config);

  const results = [];
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
          callback(err);
       }
       const query = client.query('SELECT * FROM radios where countrieID = $1',[country],function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               callback(null);
           }
           if(!result || result.rows.length ==0){
             callback(null);
           }else {
              var stream_url = result.rows[0].stream;
              console.log("the stream ------> " + stream_url);
                callback(stream_url);
           }


          // var myJSON = JSON.stringify(result.rows);
          // i=1;
        //  var resu = myJSON.substring(12,1000);
        /*   while (resu[i]!=="\"") {
                 i++;
               };
           var resuu = resu.substring(0,i);*/


    });
    });

  };

module.exports.getRadioStream = getRadioStream;
