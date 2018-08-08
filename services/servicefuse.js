Fuse = require('../node_modules/fuse.js');
 var list = require("./RadiosDb.json");


var options = { // parameters for the fuzzy search
  shouldSort: true,
  //includeScore: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength:10,
  keys: [
    "id",
    "name.value"
]
};
/*var options1 = { // parameters to check whether the exact radio Name exists
  shouldSort: true,
  //includeScore: true,
  //threshold: 0.0, //the difference
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength:10,
  keys: [
    "id",
    "name.value"
]
};*/
var DoesRadioExist = function (context,UserInput,callback){ //will search for an exact match
  var fuse = new Fuse(list, options); // "list" is the item array
  var Searchresult = fuse.search(UserInput);
console.log("i got in here ");
  if (Searchresult === undefined || Searchresult.length == 0) {
    // ChannelName provided by the user does not exist
      console.log("result empty or does not exist");
      callback(null);
      console.log("CALLBACK(NULL)");

  } else {
var myArray = [];

    for(var i=0;i<Searchresult.length;i++){
myArray.push(Searchresult[i].name.value);
      if(i==3){
        break;
      }
    }
  console.log("result is this " +myArray);
    callback(myArray);
  }
};

module.exports.DoesRadioExist = DoesRadioExist;
