var methods = require('../helpers/methods.js');
var omdb = require('omdb-client');
var currmedia;
var mediaType;
var person


/**
 * [respondToDF description]
 * This method is the main control method that gets the requests from app.js
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]} res  [description]
 */
exports.respondToDF =  (req, res) => {
  console.log("we are processing...")
  console.log(req.body.queryResult.intent.displayName)
  console.log(req.body)
  var output_string = proccess_request(req, res)
};

/**
 * [proccess_request description]
 * This function is ment to proccess the dialogflow voice request and excute the requird actions.
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]} red [description]
 */
function proccess_request(req,res){
  // simple console print out to indecate we are in proceess request\
  console.log("in process_request")
  // declars the most imortant variable of all time.
  var async = require('async');
  // declars a string
  var output_String = "Well, if you are hearing this something went wrong, so it might be a good start to tell you the invocation words. if this is your first time using the app please say 'help'"
  console.log(req.body.queryResult.intent.displayName === "add-friends")
  console.log(req.body.queryResult.parameters["any"])

  console.log(mediaType === "movie")
  console.log(mediaType === 'movie')


  if(req.body.queryResult.intent.displayName === "connect"){
    console.log("this is not implemented")
  }else if(req.body.queryResult.intent.displayName === "Text-to-speach-test-invoke"){

    console.log("we are getting a person to send to")
    console.log("search Johny")
    comsole.log("test")
    var Message = req.body.queryResult.parameters["any"]

    console.log(req.body.queryResult.parameters["any"]);

    output_String = "the message you want to send is" + Message



  }else if(req.body.queryResult.intent.displayName === "search-Friends"){
    console.log("adding friends");

    if(req.body.queryResult.intent.displayName["sys.given-name"] && req.body.queryResult.intent.displayName["sys.last-name"]){
      var fullName = req.body.queryResult.intent.displayName["sys.given-name"] + " " + req.body.queryResult.intent.displayName["sys.last-name"]
      methods.search_users(fullName)
    }


  } else if(req.body.queryResult.intent.displayName === "movie-search" && req.body.queryResult.parameters["any"]){
    mediaType = "movie"
    console.log("we in  movie search ")

    var movieName = req.body.queryResult.parameters["any"]

    console.log("movie name below")
    console.log(movieName)

    var a = methods.create_omdb_params(movieName)

    async.series([
      function(callback){
        methods.getMovieData(movieName, callback);
      },
    ], function(err, results){
      if(err){
        res.status(400);
        res.json(err);
      } else {
        //send result
        const data = results[0];
        console.log(data.Title)
        console.log("loading book...")

      // output_String = data.Title + " " + data.Year + " " + data.Plot
        output_String = "your search has completed the movie you searched for is "
        + data.Title + " it was released " + data.Year + " and the director is "+
        data.Director

        currmedia = data
        return res.json({
          "fulfillmentMessages": [],
          "fulfillmentText": output_String,
          "payload": {"slack":{"text":output_String}},
          "outputContexts": [],
          "source": "Test Source",
          "followupEventInput": {}
        })
      }
    })
  }else if(req.body.queryResult.intent.displayName === "add-friends" && req.body.queryResult.parameters["any"]){

    async.series([
      function(callback){
        methods.search_users(req.body.queryResult.parameters["any"], callback);
      },
    ], function(err, results){
      if(err){
        res.status(400);
        res.json(err);
      } else {
        //send result
        const data = results[0];

       output_String = data
        return res.json({
          "fulfillmentMessages": [],
          "fulfillmentText": output_String,
          "payload": {"slack":{"text":output_String}},
          "outputContexts": [],
          "source": "Test Source",
          "followupEventInput": {}
        })
      }
    })

  }else if(req.body.queryResult.intent.displayName === "books" && req.body.queryResult.parameters["any"]){

    console.log("we in books ")

    var book = req.body.queryResult.parameters["any"]
    mediaType = "book"
    console.log("movie name below")
    console.log(movieName)
    console.log(book)

    async.series([
      function(callback){

        methods.search_book_title(book, callback);
      },
    ], function(err, results){
      if(err){
        res.status(400);
        res.json(err);
      } else {
        //send result
        const data = results[0];

        output_String = "your search has completed.  The book you sarched for is "
        + data.title + " and the author is "+ data.authors

        currmedia = data
        return res.json({
          "fulfillmentMessages": [],
          "fulfillmentText": output_String,
          "payload": {"slack":{"text":output_String}},
          "outputContexts": [],
          "source": "Test Source",
          "followupEventInput": {}
        })
      }
    })

  }else if(req.body.queryResult.intent.displayName === "tv-show" && req.body.queryResult.parameters["any"]){

    console.log("we in  movie search ")

    var movieName = req.body.queryResult.parameters["any"]

    console.log("movie name below")
    console.log(movieName)

    var a = methods.create_omdb_params(movieName)

    async.series([
      function(callback){
        methods.getMovieData(movieName, callback);
      },
    ], function(err, results){
      if(err){
        res.status(400);
        res.json(err);
      } else {
        //send result
        const data = results[0];

      //  output_String = data.Title + " " + data.Year + " " + data.Plot
        output_String = "your search has completed the movie you sarched for is"
        + data.Title + " it was released " + data.Year + " and the director is "+
        data.Director

        currmedia = data
        return res.json({
          "fulfillmentMessages": [],
          "fulfillmentText": output_String,
          "payload": {"slack":{"text":output_String}},
          "outputContexts": [],
          "source": "Test Source",
          "followupEventInput": {}
        })
      }
    })

  }else if(req.body.queryResult.intent.displayName === "Help"){
    output_String = "The commands to activate searches are as followed. "+
    " Series: tv-show search." +
    " film/movie: movie search. " +
    "read: book search." +
    " a sample command would be as followed. " +
    " I want to watch the film departed. "+
    " i want to read IT. "+
    " i want to watch the series friends. "


    return res.json({
      "fulfillmentMessages": [],
      "fulfillmentText": output_String,
      "payload": {"slack":{"text":output_String}},
      "outputContexts": [],
      "source": "Test Source",
      "followupEventInput": {}
    })

  } else if(req.body.queryResult.intent.displayName === "search-media"){
    console.log("search media")
    if(mediaType === "movie" && typeof currmedia != 'undefined'){
      if(typeof currmedia != 'undefined'){
        output_String = "what would you like the search"
      if(req.body.queryResult.parameters["search-director"]){
        console.log("we searching fam")
        output_String = " The director of " + currMedia + " is " + currMedia.Direcor
      }else if(req.body.queryResult.parameters["search-year"]){
        output_String = " The year " + currMedia + " was released is " + currMedia.Year
      }else {
        output_String = currmedia.Plot
      }
    }


  }else if(mediaType === "book" && typeof currmedia != 'undefined'){
    if(typeof currmedia != 'undefined'){
      output_String = "what would you like the search"
    if(req.body.queryResult.parameters["search-director"]){
      console.log("we searching fam")
      output_String = " The director of " + currMedia + " is " + currMedia.Direcor
    }else if(req.body.queryResult.parameters["search-year"]){
      output_String = " The year " + currMedia + " was released is " + currMedia.Year
    }else {
      output_String = currmedia.description
    }
  }
  }else{
    output_String = "your must enter what media you would like to search"
  }

  return res.json({
    "fulfillmentMessages": [],
    "fulfillmentText": output_String,
    "payload": {"slack":{"text":output_String}},
    "outputContexts": [],
    "source": "Test Source",
    "followupEventInput": {}
  })
}else{
  return res.json({
    "fulfillmentMessages": [],
    "fulfillmentText": output_String,
    "payload": {"slack":{"text":output_String}},
    "outputContexts": [],
    "source": "Test Source",
    "followupEventInput": {}
  })

  }
}

function getMovieData(title) {
	var params = methods.create_omdb_params(title);
  var data
	omdb.get(params, function(err, data) {
		data = data ||
		   {title: title,
       year: year}
	});
  return data
}
function create_omdb_params(title){
	//declare and return functions
  console.log(title)
	var params = {
    	apiKey: 'f7cb9dc5',
    	title: title

	}
  console.log(params)
	return params;
}
