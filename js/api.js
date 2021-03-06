define([],function() 
{
  var api = {};

  /**
     API
     This file contains all of the request that can be made to the server.
     the api object is the one that will contain all of the functions that are exported.
     see bottom of the file to see what get's exported or add an export of a function.

     Uses the default XMLHttpRequest to perform all requests.
  **/

  var fetch = function(dest, success, error, failure) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", dest, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    
    // If the request timeouts.
    xhr.ontimeout = failure.bind(xhr, xhr);
    
    // If things go as planned, run the success function that was
    // supplied.  if not, the failure function.
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(JSON.parse(xhr.response));
        }
      }
    }
    
    // If shit goes wrong, we want to know and why.
    xhr.onerror = error.bind(xhr, xhr);
    
    // Fetch the data
    xhr.send(null);
  }

  var send = function(type, dest, data, success, error, failure, OK, ERROR) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, dest, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    
    // If the request timeouts.
    xhr.ontimeout = failure.bind(xhr, xhr);
    
    if (!OK) {
      OK = 200;
    }   

    // If things go as planned, run the success function that was
    // supplied.  if not, the failure function.
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === OK) {
          success(JSON.parse(xhr.response));
        } else if (xhr.status === ERROR) {
          error(JSON.parse(xhr.response));
        } else {
          failure(xhr.response);
        }
      }
    }
    
    // If shit goes wrong, we want to know and why.
    xhr.onerror = error.bind(xhr, xhr);
    
    // Sends the data as a JSON object.
    xhr.send(JSON.stringify(data));
  };

  var login = function (data, success, error, failure) {
    send("PUT",
         "/user/login",
         data,
         success,
         error,
         failure,
        202,
        400);
  }    

  var search = function (dest, data, success, error, failure) {
    send("PUT",
         dest,
         data,
         success,
         error,
         failure);
  }

  
  var register = function (data, success, error, failure) {
    send("POST",
         "/user/register",
         data,
         success,
         error,
         failure,
        201,
        400);
  }
  
  var random = function (success) {
    fetch("/search/random",
          success,
          function (xhr) {
            console.log("Failed to get random");
          },
          function (xhr) {
            console.log("Failed to get random");
          });
  }
  
  var rateMovie = function (id,rating,user,success,error) {
    var req = {user_id: user, rating: rating, movie: id};
    send("PUT",
         "/movie/rating",
         req,
         success,
         function (resp) {
           console.log("Error on rating movie" + resp);
         },
         function (xhr) {
           console.log("Failure" + xhr);
         });
  }

  var fetchRatedMovies = function (user, success) {
    var req = {user:user};
    send("PUT",
         "/user/rated",
         req,
         success,
         function (resp) {
           console.log("Error on rating movie" + resp);
         },
         function (xhr) {
           console.log("Failure" + xhr);
         });
  }

  var fetchGenres = function (success) {
    fetch("/movie/genres",
          success,
          function (xhr) {
            console.log("Failed to get genres");
          },
          function (xhr) {
            console.log("Failed to get genres");
          });
  }

  var fetchMovieId = function (id, success) {
    var req = {movie: id};
    send("PUT",
         "/movie/id",
         req,
         success,
         function (xhr) {
           console.log("Failed to get genres");
         },
         function (xhr) {
           console.log("Failed to get genres");
         });
  }

  var fetchMovieIdWithUser = function (movie, user, success) {
    var req = {movie: movie, user: user};
    send("PUT",
         "/movie/id",
         req,
         success,
         function (xhr) {
           console.log("Failed to get genres");
         },
         function (xhr) {
           console.log("Failed to get genres");
         });
  }
  
  var searchWithAttributes = function (attrs, success) {
    search("/search/movie",
           attrs,
           success,
           function (xhr) {
             console.log("Failed to search");
           },
           function (xhr) {
             console.log("Failed to search");
           });
  }

  /**
     SearchWithUser : function, data, user id -> Movies
     Expects a search function and a user Id to add to the search
     Add the id to the data model
   **/
  var searchWithUser = function (attrs, success) {
    search("/search/movie/user",
           attrs,
           success,
           function (xhr) {
             console.log("Failed to search with user");
           },
           function (xhr) {
             console.log("Failed to search with user");
           });
  };


  var registerUser = function (user, success, error) {
    register(user,
             success,
             error,
             function (xhr) {
               console.log("Failed to create user");
             });
  }
 
  var movieRegister = function (data, success, error) {
    send("POST",
         "/movie/register",
         data,
         success,
         error,
         function (xhr) {
	   console.log("Failed to submit move");
	 },
        202,
        400);
  }
 
  var loginUser = function (user, success, error) {
    login(user,
          success,
          error,
          function (xhr) {
            console.log("Failed to login");
          });
  }

  api.rate = rateMovie; 
  api.random = random;
  api.login = loginUser;
  api.register = registerUser;
  api.registerMovie = movieRegister;
  api.search = searchWithAttributes;
  api.searchWithUser = searchWithUser;
  api.fetchGenres = fetchGenres;
  api.fetchRated = fetchRatedMovies;
  api.fetchMovieId = fetchMovieId;
  api.fetchMovieSummary = fetchMovieId;
  api.fetchMovieSummaryUser = fetchMovieIdWithUser;


  return api;
});
