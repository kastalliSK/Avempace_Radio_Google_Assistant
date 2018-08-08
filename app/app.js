'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');
                                  //
var RadioService = require ('../services/database.js');


var RadioS = require ('../services/servicefuse.js');
//var Sequelize = require('sequelize');

const userService = require('../services/userservice.js');
const radioService = require('../services/radioservice.js');
const favoriteService = require('../services/favoriteservice.js');



//const indexService  = require('../models/index.js');
//const { User, Radio, Country, Genre } = require('../models/index.js') ;

const config = {
    logging: true,

};

const app = new App(config);

//console.log(urlGet(radio));

//const song = 'http://1.ice1.firststreaming.com:8000/kwhl_fm.aac';

// =================================================================================
// App Logic
// =================================================================================



app.setHandler({

  'LAUNCH': function() {
    var id = this.googleAction().getRequest().originalDetectIntentRequest.payload.user.userId;
    console.log("------------------id is = ", id);
//  console.log("---------------"+ this.user().getId.platform.getUserId());

    /////
    //this.setSessionAttribute('userID',id);
    this.user().data.userID = id;

    userService.findaUser(id, function(result){
      if(result==false){
        userService.createUser(id, function(res){
  console.log("the user is created -- > "+ res);
    })
  }else {
    console.log("-----the user is already included in the table -----");
  }
  })

    this.toIntent('HelloIntent');
  },

  'HelloIntent': function() {
      this.ask('Hello! thank you for choosing this app  .. if you want help say.. : Help ');
  },
  'HelpIntent': function() {
    let help = "thank you for choosing this app!!  .. we have stored for you 21000000 radios! . if u want to play a radio say . play a radio called name of the radio! , for exemple .play a radio called mosaique fm! . do not worry . if i did not undrestand you well . i will give you three alternative radios .. . If you want to know some radios of a certain country, you can say, list me radios from countryname!. If you want to listen to a random radio from a certain country, you can say : i want to  play a radio from the country countryname!. for exemple . i want to play a radio from the country canada!... we have also stored 267 genres.  If you want some radios of certain genre that you like, you can say, list me some radios from the genrename radios. For exemple list me some love song radios.  If you want to listen to a random radio from a certain genre, you can say, play a radio from the genrename genre!  i can store the radios u like to your favourites. "
    let helpy = ". . . If you would like to add the last radio you listened to to your favourites, you should say, add this radio to my favourites!. If you want to see which radios you have added to your favourites, you should say, list me my favourite radios. If you want to listen to a random radio from your favourite list, you can say, play me a radio from my favourite list. And finally, if you wish to delete the last radio you listened to from your favourites, you should say, delete this radio from my favourites..      . . enjoy!"
      this.ask(help +helpy)
  },

  'NameIntent': function(name) {

    let speech = 'Hello  ' + name.value + ', nice to meet you! what do you want me to do for you?';
    let reprompt = 'Hey , ' + name.value + ',  What can i do ?';
      this.ask(speech, reprompt);
  },

//////////////////////////////////////////////////////////////////////////////
////////////////////find all radios in favorits///what are my favorites/what radios do i have in the list of favorites////////////

'FavoIntent': function() {
  var userIDD =this.user().data.userID;
  var context= this;
  console.log("the id is = "+ userIDD);

  favoriteService.findFav(userIDD,function(result){
    console.log("====> in the end all favorite radios are "+ JSON.stringify(result));
    if(result.length>0){
    var speech=result[0];
    for (var i = 1; i< result.length ; i++) {
        speech=speech+" . and . "+result[i]
        if(i==10){
          break;
        }
    }
let reprompt = 'you have ' +result.length + ' favorite radios  . they are .:'+speech;
    context.tell(reprompt);
  }else{
    context.tell("you have no favorite radios! . if you want to add a radio in your favorite list .play the radio then say : i want to add this radio to my favorits");
  }
  })
},
/////////////////////////////find rand in favorite : play a radio from favorites /////////////////////////////////
'ByFavIntent': function() {
      var userIDD =this.user().data.userID;
      var context=this;
      favoriteService.findRandFav(context,userIDD,function(radioFound){
          console.log("Fav RADIOFOUND ====>" + radioFound )
            context.user().data.radiofav = radioFound[0] ;
            context.user().data.streamfav = radioFound[1] ;

        //  context.setSessionAttribute('RadioName', radioFound);
          context.user().data.RadioRand = radioFound;
          context.followUpState('PlayConfirmationStateFavoritePlay')
          .ask("the radio called "+radioFound[0]+" is in your favorite list , do you want me to play it for you ?");
      })
},

/////////////////////confirmation for random favorites////yes /no ////////////////////
'PlayConfirmationStateFavoritePlay': {

    'YesIntent': function() {

    //  this.setSessionAttribute('radiofav',RadioName);
        var RadioData =this.user().data.RadioRand;

      console.log("you said yes -----> Radio is : "+ RadioData) ;
      var context = this;

            context.user().data.RadioNameToDelete=RadioData[0]; //if u want to delete from favorits

            context.googleAction().audioPlayer().play(RadioData[1], 'First song');   // Adds audio file to the response
            context.googleAction().showSuggestionChips(['Stop', 'Pause']);
          //  context.ask('okey ! i will play the radio called,' + liste[count].name + 'from'+ +'enjoy ! ');
           context.tell('ok ! i will play ' +  RadioData[0] + '... you can delete it from your favorits by saying , i want to delete this radio from favorites ! ');



    },

    'NoIntent': function() {
      this.followUpState('PlayConfirmationStateFavoritePlay.ConfirmResearchRandomRadio')
          .ask("Okay then. Would you like me to choose another radio ?")
        },


    'ConfirmResearchRandomRadio': {
        'YesIntent': function() {
               var userIDD =this.user().data.userID;
                var context =this;
                favoriteService.findRandFav(context,userIDD,function(radioFound){
                    console.log("Fav RADIOFOUND ====>" + radioFound )

                    context.user().data.RadioRand = radioFound;

                    context.followUpState('PlayConfirmationStateFavoritePlay')
                    .ask(radioFound[0]+" is in your favorite list too , do you want me to play it for you ?");

                })
            },


        'NoIntent': function() {
            this.tell("ok");

        },
    },

          // Other intents in the x
  },

///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////add the current radio to favorite intent/////////////////////////////////////////////
////////////////////////////////////////////////i want to add this radio to my favorites/////////////////////
////////////////////////////////////////////////add this radio to my favorites
'PauseIntent': function() {
  //let radioname = this.getSessionAttribute('radiofav');
  var radioname =this.user().data.radiofav
    console.log("-----> Radio can be added to favorits : "+ radioname) ;
    if(!radioname){
      this.ask("if you want to add a radio to your favorite list , you need to play it first ");

    }else{
      this.followUpState('PlayConfirmationStateAddfav').ask("You confirm adding "+ radioname + "to your favorite radios?");

    }
    //console.log(radioName)
},

'PlayConfirmationStateAddfav': {

    'YesIntent': function() {

    //let value1 = this.getSessionAttribute('radiofav');
    //let stream1 = this.getSessionAttribute('streamfav');
    //let userIDD = this.getSessionAttribute('userID');

        var value1 =this.user().data.radiofav;
          var stream1 =this.user().data.streamfav;
            var userIDD =this.user().data.userID;

      var context= this ;

      console.log("going to add the radio : "+ value1+" to favorites , its stream is "+stream1) ;
      // favorites service
      favoriteService.findaFav(userIDD,value1,function(result){
          if(result==false){
        favoriteService.addFav(userIDD,value1, stream1 ,function(res){
            console.log("----------------------==== > the radio OF the user "+ userIDD +"added to favorites --> "+ JSON.stringify(res));
            context.tell("adding to favorits")
        })
    }else{
      context.tell("the radio is already in your favorites ! ")
    }
   })
    },

    'NoIntent': function() {
      let speech = 'i did not add it to favorits!';
      this.tell(speech);
    },

  },

///////////////////////////delete from favorites//////////////
////////play a radio //then////i want to delete this radio to from favorites !//////////
////////////////////////////// delete this radio to from favorites
'DeleteIntent': function() {
  //let radioname = this.getSessionAttribute('radiofav');

  var RadioDelete =this.user().data.RadioNameToDelete;
  var userIDD =this.user().data.userID;
  var context=this;
  if(!RadioDelete){
    this.ask("if you want to delete a radio from your favorite list , you need to play it first ");
  }else{
    favoriteService.findaFav(userIDD,RadioDelete,function(result){
        if(result==true){
          console.log("-----> Radio can be Deleted from favorits : "+ RadioDelete) ;
          context.followUpState('PlayConfirmationStateDeletefav').ask("You confirm Deleting "+ RadioDelete + "from your favorite radios?");

  }else{
    context.tell("the radio "+RadioDelete+" is not in favorites ! ")
  }
 })
}
},

'PlayConfirmationStateDeletefav': {

    'YesIntent': function() {

    //let value1 = this.getSessionAttribute('radiofav');
    //let stream1 = this.getSessionAttribute('streamfav');
    //let userIDD = this.getSessionAttribute('userID');
           var RadioDelete =this.user().data.RadioNameToDelete;
           var userIDD =this.user().data.userID;
           var context= this ;

      console.log("going to Delete the radio : "+ RadioDelete+" from favorites , its stream is ") ;
      // favorites service

        favoriteService.DeleteFav(context,userIDD,RadioDelete,function(res){
            console.log("----------------------==== > the radio OF the user = "+ userIDD+"   the name isss = "+RadioDelete+" --- deleting from favorits");
            context.tell("deleting "+RadioDelete+" from favorits")
        })


    },

    'NoIntent': function() {

      var RadioDelete =this.user().data.RadioNameToDelete;
      let speech = RadioDelete +' not deleted from favorits!';
      this.tell(speech);
    },

  },




////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////list five country radios//////////////////////////////////
/////////////////////////////////////////////////what radios do you have from country
/////////////////////////////////////////////////list me radios from country

    'CountryListRadiosIntent': function(country) {
       var context=this;
        radioService.getRadioListFromCountry(context,country.value,countryList => {

            console.log(countryList);
            var speech=countryList[0];
  for(var i=1;i<countryList.length-1 ;i++){
     speech=speech+". and ."+countryList[i]
  }
            console.log(speech);
            context.tell("i have found "+countryList[countryList.length-1]+" radios from " + country.value +" . here are 5 random names : " + speech)

        })

        //this.tell("CHECK CONSOLE FOR RADIOS THAT BELONG TO COUNTRY" + country.value)
        console.log("COUNTRY     VALUE IS"+ country.value)
    },


///////////////////////////////////////////find rand radio by country /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////play a radio from country/////i want to play a radio from country/////////////////

  'ByCountryIntent': function(countryName) {

        var context=this;
        radioService.getRadioFromCountry(context,countryName.value,function(radioFound){
            console.log("RADIOFOUND ====>" + radioFound )


            context.setSessionAttribute('RadioName', radioFound);
            context.setSessionAttribute('ICameFrom','ByCountryIntent')
            context.setSessionAttribute('NameCountry',countryName.value)


            context.followUpState('PlayConfirmationStateCountry')
            .ask("I have found this interesting radio from "+countryName.value+" called " + radioFound + " Do you want me to play it?");


        })

        console.log("COUNTRY     VALUE IS"+ countryName.value)
  },


  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////list five genre radios//////////////////////////////////


      'GenreListRadiosIntent': function(GenreN) {
        let inputs = this.googleAction().getRequest().queryResult.parameters.GenreN;

         var context=this;
         console.log("-----GenreN ------"+JSON.stringify(GenreN));
         console.log("-----GenreN ------"+JSON.stringify(inputs));

          radioService.getRadioListByGenre(context,inputs,genreList => {

            console.log(genreList);
            var speech=genreList[0];
  for(var i=0;i<genreList.length-1 ;i++){
     speech=speech+". and ."+genreList[i]
  }
            console.log(speech);
            context.tell("i have found "+genreList[genreList.length-1]+" radios from " + inputs+" . here are 5 random names : " + speech)


          })

          //this.tell("CHECK CONSOLE FOR RADIOS THAT BELONG TO COUNTRY" + country.value)

      },


  ///////////////////////////////////////////find a random radio by Genre /////////////////////////////////////////////////

  'ByGenreIntent': function(genreName) {

console.log("----genreName-----"+genreName);
        var context=this;
        radioService.getRadiosByGenre(context,genreName.value,function(radioFound){
            console.log("RADIOFOUND ====>" + radioFound )


            context.setSessionAttribute('RadioName', radioFound);
            context.setSessionAttribute('ICameFrom','ByGenreIntent')
            context.setSessionAttribute('GenreName',genreName.value)
            console.log("do the confirmation ask now -------------------------");
            context.followUpState('PlayConfirmationStateCountry')
            .ask("I have found this interesting "+genreName.value+" radio called " + radioFound + " Do you want me to play it?");


        })

        console.log("genreName VALUE IS "+ genreName.value)



  },
////////////////////////////////////confiramation for Genre and Country////////////

  'PlayConfirmationStateCountry': {

      'YesIntent': function() {
        let RadioName = this.getSessionAttribute('RadioName');
        // this.setSessionAttribute('radiofav',RadioName);
        this.user().data.radiofav = RadioName ;
        console.log("you said yes -----> Radio is : "+ RadioName) ;
        var context = this;

        RadioService.getRadioStream(context, RadioName ,function(result){
            console.log("the Result: "+result);

            if(!result){
            context.tell('Radio  stream is not found');
            }else{
              //context.setSessionAttribute('streamfav',result);
             context.user().data.streamfav = result ;
             context.user().data.RadioNameToDelete=RadioName; //if u want to delete from favorits

              context.googleAction().audioPlayer().play(result, 'First song');   // Adds audio file to the response
              context.googleAction().showSuggestionChips(['Stop', 'Pause']);
              context.tell('okey ! i will play ' +  RadioName + '... you can add it to your favorits by saying , i want to add this radio to my favorits ! ');

            }
          })

      },

      'NoIntent': function() {
        this.followUpState('PlayConfirmationStateCountry.ConfirmResearchRandomRadio')
            .ask("Okay then. Would you like me to choose another radio ?")
          },


      'ConfirmResearchRandomRadio': {
          'YesIntent': function() {
              let RedirectToIntent = this.getSessionAttribute('ICameFrom');
              console.log("am in the RedirectToIntent = yes  "+RedirectToIntent );

              if (RedirectToIntent=="ByCountryIntent"){
                  console.log("am in the RedirectToIntent = yes  "+RedirectToIntent )
                  let countryName = this.getSessionAttribute('NameCountry');

                  var context=this;
                  radioService.getRadioFromCountry(context,countryName,function(radioFound){

                      console.log("RADIOFOUND ====>" + radioFound )
                      context.setSessionAttribute('RadioName', radioFound);
                      context.setSessionAttribute('ICameFrom','ByCountryIntent')
                      context.setSessionAttribute('NameCountry',countryName)
                      context.followUpState('PlayConfirmationStateCountry')
                      .ask("Oh I have found an other interesting radio from "+countryName+" called  " + radioFound + " Do you want me to play it?");
                  })

              } else if (RedirectToIntent=="ByGenreIntent"){
                  console.log("you r in RedirectToIntent= yes ByGenreIntent = "+RedirectToIntent)
                  let GenreName = this.getSessionAttribute('GenreName');
                  var context =this;

                  radioService.getRadiosByGenre(context,GenreName,function(radioFound){
                      console.log("RADIOFOUND ====>" + radioFound )


                      context.setSessionAttribute('RadioName', radioFound);
                      context.setSessionAttribute('ICameFrom','ByGenreIntent')
                      context.setSessionAttribute('GenreName',GenreName)

                      context.followUpState('PlayConfirmationStateCountry')
                      .ask("Oh I have found an other interesting "+ GenreName +" radio called" + radioFound + "Do you want me to play it?");
                  })
              }
          },

          'NoIntent': function() {
              this.tell("ok");

          },
      },

            // Other intents in the x
    },



///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////find radio by Name /////////////////////////////////////////////////

///////////////////////////////THE 3 RADIO INTENTS////////////////////////////////////////////////////

//////////////// ////////////////////radio one/////////////////////////////////////////////
    'RadioIntent': function(radioNameOne) {

      if(!radioNameOne || !radioNameOne.value){

              let inputs = this.googleAction().getRequest().queryResult.queryText;
              var res = inputs.substring(4, inputs.length);
              console.log("-----> Radio was undefined  : "+ JSON.stringify(radioNameOne)+ '-----> radio name  is now : '+ res);
              var context = this;

              RadioS.DoesRadioExist(context,res,function(result2){
                console.log("The new name corrected after fuse  is : "+ result2);

                if(result2.length==0){
                context.tell('Radio not found');

                }else{
    context.setSessionAttribute('optionNumber',result2.length);
                  console.log('the new name iiiiiiiis --->'+ result2[0] );
                  for(var i=0;i<result2.length;i++){
                      context.setSessionAttribute('radioN'+(i+1),result2[i]);
                  }
                //  context.setSessionAttribute('radioN1',result2[0]);
                  //context.setSessionAttribute('radioN2',result2[1]);
                  //context.setSessionAttribute('radioN3',result2[2]);

                  context.followUpState('PlayConfirmationStateTwo').ask(' let me see if i got it right ! Did u say the radio is called '+ result2[0] +' ?');



                  }
              })

      }else{

        console.log("-----> Radio one found easy : "+JSON.stringify(radioNameOne));
        this.setSessionAttribute('radioN',radioNameOne.value);
        this.followUpState('PlayConfirmationState').ask('i found it ! Do you want me to play the radio called '+radioNameOne.value+' ?');

        }
    },



//////////////////////////////////////////radio two ///////////////////////////////////////////

    'RadioIntentTwo': function(radioNameTwo) {

      if(!radioNameTwo.value){

        let inputs = this.googleAction().getRequest().queryResult.queryText;
        var res = inputs.substring(5, inputs.length);
        console.log("-----> Radio was undefined  : "+ JSON.stringify(radioNameTwo)+ '-----> radio name  is now : '+ res);
        var context = this;

        RadioS.DoesRadioExist(context,res,function(result2){
          console.log("The new name corrected after fuse  is : "+ result2);

          if(result2.length==0){
          context.tell('Radio not found');

          }else{

            console.log('the new name iiiiiiiis --->'+ result2[0] );
            for(var i=0;i<result2.length;i++){
                context.setSessionAttribute('radioN'+(i+1),result2[i]);
            }
                context.setSessionAttribute('optionNumber',result2.length);
          //  context.setSessionAttribute('radioN1',result2[0]);
            //context.setSessionAttribute('radioN2',result2[1]);
            //context.setSessionAttribute('radioN3',result2[2]);

            context.followUpState('PlayConfirmationStateTwo').ask(' let me see if i got it right ! Did u say the radio is called '+ result2[0] +' ?');

            }
        })

      }else{

      this.setSessionAttribute('radioN',radioNameTwo.value);
      this.followUpState('PlayConfirmationState').ask('Do you want me to play a radio called '+radioNameTwo.value+' ?');
      console.log("-----> Radio Two : "+JSON.stringify(radioNameTwo));

      }
      },

      ///////////////////////////////////////radio three ////////////////////////////////////////////////

          'RadioIntentThree': function(radioNameThree) {

            if(!radioNameThree.value){

              let inputs = this.googleAction().getRequest().queryResult.queryText;
              var res = inputs.substring(4, inputs.length);
              console.log("-----> Radio was undefined  : "+ JSON.stringify(radioNameThree)+ '-----> radio name  is now : '+ res);
              var context = this;

              RadioS.DoesRadioExist(context,res,function(result2){
                console.log("The new name corrected after fuse  is : "+ result2);

                if(result2.length==0){
                context.tell('Radio not found');

                }else{

                  console.log('the new name iiiiiiiis --->'+ result2[0] );
                  context.setSessionAttribute('optionNumber',result2.length);

                  console.log("------------"+result2.length);
                  for(var i=0;i<result2.length;i++){
                      context.setSessionAttribute('radioN'+(i+1),result2[i]);
                  }
                //  context.setSessionAttribute('radioN1',result2[0]);
                  //context.setSessionAttribute('radioN2',result2[1]);
                  //context.setSessionAttribute('radioN3',result2[2]);

                  context.followUpState('PlayConfirmationStateTwo').ask(' let me see if i got it right ! Did u say the radio is called '+ result2[0] +' ?');

                  }
              })

            }else{

            this.setSessionAttribute('radioN',radioNameThree.value);
            console.log('radio name is = ',radioNameThree.value);
            this.followUpState('PlayConfirmationState').ask('Do you want me to play the radio called '+radioNameThree.value+' ?');
            console.log("-----> Radio Three well found : "+JSON.stringify(radioNameThree));
            }

            },
//////////////////////////////end of radio intents////////////////////////////////

//////////////////////confirmation if  radio name undefined////////////////////////////////////////
///////////////////////////////////// first confirmation  if undefined//////////
      'PlayConfirmationStateTwo': {

          'YesIntent': function() {
            let value2 = this.getSessionAttribute('radioN1');
          //  this.setSessionAttribute('radiofav',value2);
            this.user().data.radiofav = value2 ;
            console.log("you said yes -----> Radio first guess : "+ value2) ;
            var context = this;

            RadioService.getRadioStream(context,value2,function(result){
                console.log("getRadioStream the Result: "+result);
                if(!result){
                context.ask('Radio  stream is in the  2nd intent but it is not found');
                }else{
                  //context.setSessionAttribute('streamfav',result);
                  context.user().data.streamfav = result ;

                  console.log("------------1audio player");
                  context.googleAction().audioPlayer().play(result, 'First song');   // Adds audio file to the response
                  console.log("------------2audio player");

                  context.googleAction().showSuggestionChips(['Stop', 'Pause']);
                  console.log("------------3audio player");

                  context.tell('ok! the radio ,' + value2 + ', is going to take a bit to play , you can add it to your favorits by saying , i want to add this radio to my favorits ,! ');

                }
              })

          },

          'NoIntent': function() {

            let long= this.getSessionAttribute('optionNumber');
            console.log("----------------"+long);
            if(long>1){
              let value2 = this.getSessionAttribute('radioN2');
              console.log("you said No -----> Try Radio 2nd guess : "+ value2) ;

              this.followUpState('PlayConfirmationStateThree').ask('you said no !   is it called  '+ value2 + ' then ? ');

            }else{
              this.tell('i did not find the radio')
            }
            },
    // Other intents in the state
      },


/////////////////////////////////////////////// scd confirmation if undefined///////////////////////////

      'PlayConfirmationStateThree': {

          'YesIntent': function() {
            let value3 = this.getSessionAttribute('radioN2');
            //this.setSessionAttribute('radiofav',value3);
            this.user().data.radiofav = value3 ;
            console.log("you said yes -----> Radio two : "+ value3) ;
            var context = this;

            RadioService.getRadioStream(context,value3,function(result){
                console.log("the Result: "+result);

                if(!result){
                context.tell('Radio is in the  thirt intent but it is not found');

                }else{

                  //context.setSessionAttribute('streamfav',result);
                  context.user().data.streamfav = result ;
                  context.user().data.RadioNameToDelete=value3; //if u want to delete from favorits

                  context.googleAction().audioPlayer().play(result, 'First song');   // Adds audio file to the response
                  context.googleAction().showSuggestionChips(['Stop', 'Pause']);
                  context.tell('ok , playing ' + value3 + ' ! you can add it to your favorits by saying , i want to add this radio to my favorits ! ');

                }
              })

          },

          'NoIntent': function() {
            let long= this.getSessionAttribute('optionNumber');
            if(long>2){
              let value2 = this.getSessionAttribute('radioN3');
              console.log("you said No -----> Try Radio 2nd guess : "+ value2) ;

              this.followUpState('PlayConfirmationStateFour').ask('you said no again !   is it called  '+ value2 + ' then ? ');

            }else{
              this.tell('i did not find the radio')
            }
          },
    // Other intents in the state
      },


  //////////////////////////////////////////////// third confirmation if undefined////////////

      'PlayConfirmationStateFour': {

          'YesIntent': function() {

            let value1 = this.getSessionAttribute('radioN3');
            //this.setSessionAttribute('radiofav',value1);
            this.user().data.radiofav = value1;
            console.log("you said yes -----> Radio 3rd  try  : "+ value1) ;
            var context = this;

            RadioService.getRadioStream(context,value1,function(result){
                console.log("the Result: "+result);
                if(!result){
                context.ask('Radio stream not found, what radio u want to play then ?');
                }else{
                  //context.setSessionAttribute('streamfav',result);
                  context.user().data.streamfav = result ;
                  context.user().data.RadioNameToDelete=value1; //if u want to delete from favorits


                  context.googleAction().audioPlayer().play(result, 'First song');   // Adds audio file to the response
                  context.googleAction().showSuggestionChips(['Stop', 'Pause']);
                  context.tell('finally You said Yes ! i will play the ,' + value1 + ' , radio ! if you like it you can add it to your favorits by saying , i want to add this radio to my favorits ,! ');
                  }
              })
          },

          'NoIntent': function() {
            let speech = 'you said no again after i gave you 3 options  ? Can u spell the name please ?! ';
            this.ask(speech);
          },


          // Other intents in the state
      },
//////////////////////////////end of confirmation if undefined/////////
/////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////>>>>>
/////////////// confirmation state for the good ones
/////////////////////////////////////////////////////////////////////////////////>>>>>>>>>
    'PlayConfirmationState': {

        'YesIntent': function() {

          let value1 = this.getSessionAttribute('radioN');
          console.log("you said yes -----> Radio one : "+ value1) ;
        //  this.setSessionAttribute('radiofav',value1);
          this.user().data.radiofav = value1 ;

          console.log("-----> Radio can be added to favorits : "+ value1) ;
          var context = this;

          RadioService.getRadioStream(context,value1,function(result,aContextToUse){
              console.log("----> getRadioStream Result: "+result);
              //context.setSessionAttribute('streamfav',result);
              context.user().data.streamfav = result ;
              context.user().data.RadioNameToDelete=value1; //if u want to delete from favorits


              if(!result){
              aContextToUse.ask('Radio stream not found, what radio u want to play then ?');
              }else{

                console.log("Audio Player Play");
                aContextToUse.googleAction().audioPlayer().play(result, 'First song');   // Adds audio file to the response
                aContextToUse.googleAction().showSuggestionChips(['Stop', 'Pause']);
                aContextToUse.tell('ok! i will play ,' + value1 + 'after a bit  , if you like it you can add it to your favourites by saying , i want to add this radio to my favourites ! ');
                }
            })
        },

        'NoIntent': function() {
          let speech = 'you said no! , i guess i did not get it right ! what radio u want to play then ?';
          this.ask(speech);
        },


        // Other intents in the state
    },


    ///////////////////////////////////////////////////

    'AUDIOPLAYER': {
        /**
         * Gets triggered, if the session is still active (audio started with ask() instead of tell()) and the song is finished
         */
        'GoogleAction.Finished': function() {
            this.tell('the end');
        },
    },
});

module.exports.app = app;
