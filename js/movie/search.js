define(['api','utils'], function(API, Utils) {

  var exports = {};


  function GenreInputView () {
    var template = document.querySelector("#genre-input");
    this.dom = document.importNode(template.content, true);
    this.label = this.dom.querySelector(".label");
    this.input = this.dom.querySelector(".input");

    var self = this;
    this.input.addEventListener("change", function (e) {
      if (self.onGenreChanged) {
        self.onGenreChanged(parseInt(e.target.value));
      }
    }, false);
  }

  GenreInputView.prototype.setLabel = function (label) {
    this.label.textContent = Utils.capitalizeString(label);
  }

  GenreInputView.prototype.setGenre = function (value) {
    this.input.value = value;
  }

  function GenreInput (view) {
    this.view = view || new GenreInputView();
    this.genreChangedCallback = null;

    this.view.onGenreChanged = GenreInput.prototype.onGenreChanged.bind(this);
  }

  GenreInput.prototype.setGenre = function (genre) {
    this.view.setLabel(genre.genre);
    this.view.setGenre(genre.id);
  }

  GenreInput.prototype.onGenreChanged = function (id) {
    if (this.genreChangedCallback) {
      this.genreChangedCallback(id);
    }
  }

  /*
    Search view
   */
  function SearchView() {
    var template = document.querySelector("#search");
    this.dom = document.importNode(template.content, true);
    this.form = this.dom.querySelector(".search-form");
    this.title = this.dom.querySelector(".title");
    this.genres = this.dom.querySelector(".genres");
    this.random = this.dom.querySelector(".random");
  }

  SearchView.prototype.addGenreInput = function (item) {
    this.genres.appendChild(item.view.dom);
  }

  SearchView.prototype.onSearch = function (callback) {
    var self = this;
    this.form.addEventListener("submit", function (e) {
      e.preventDefault();
      callback();
    },false);
  }

  SearchView.prototype.onRandom = function (callback) {
    var self = this;
    this.random.addEventListener("click", function (e) {
      e.preventDefault();
      callback();
    },false); 
  }

  /*
    Search model
   */
  function SearchModel () {
    this.title = undefined;
    this.genres = undefined;
    this.runtime = undefined;
    this.year = undefined;
  }

  SearchModel.prototype.setTitle = function (title) {
    this.title = title === "" ? undefined : title;
  }

  SearchModel.prototype.setGenre = function (id) {
    if (this.genres) {
      if (this.genres.indexOf(id) === -1) {
        this.genres.push(id);
      } else if (this.genres.indexOf(id) > -1) {
        this.genres.splice(this.genres.indexOf(id), 1);
      }
      if (this.genres.length === 0) {
        this.genres = undefined;
      }
    } else {
      this.genres = [];
      this.genres.push(id);
    }
  }

  SearchModel.prototype.setRuntime = function (runtime) {
    this.runtime = runtime === 0 ? undefined : runtime;
  }

  SearchModel.prototype.setYear = function (year) {
    this.year = (year === 0 || year < 0) ? undefined : year;
  }

  /*
    Search presenter
   */
  function Search (view) {
    this.view = view || new SearchView();
    this.searchResultCallback = null;
    this.randomResultCallback = null;

    this.view.onSearch(Search.prototype.search.bind(this));
    this.view.onRandom(Search.prototype.random.bind(this));

    this.model = new SearchModel();

  }

  Search.prototype.setGenre = function (id) {
    this.model.setGenre(id);
  }

  Search.prototype.setTitle = function (title) {
    this.model.setTitle(title);
  }

  Search.prototype.setRuntime = function (runtime) {
    this.model.setRuntime(runtime);
  }
  
  Search.prototype.setYear = function (year) {
    this.model.setYear(year);
  }

  Search.prototype.addGenre = function (genre) {
    var item = new GenreInput();    
    item.genreChangedCallback = Search.prototype.setGenre.bind(this);
    item.setGenre(genre);
    this.view.addGenreInput(item);
  }

  Search.prototype.search = function () {
    var self = this;
    if (this.searchResultCallback) {
      API.search(self.model, function (r) {
        self.searchResultCallback(r);
      });
    }
  }

  Search.prototype.random = function () {
    if (this.randomResultCallback) {
      API.random(function (movie) {
        this.randomResultCallback(movie);
      }, this);
    }
  }

  return Search;

});
