const model = (function() {
  // Private links 
  var page = 1;
  const configuration_link = "https://api.themoviedb.org/3/configuration";
  const movies = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`;
  const base_url = "https://image.tmdb.org/t/p/w500/"

  // const apiUrl = `https://api.themoviedb.org/3/movie/trending?api_key=${apiKey}&page=${page}`;
  // return an object that contains the value of the link i want
  return {
    get_configuration_link: function() { 
      return configuration_link;
    },
    get_movies: function() {
      
      return movies;
    },
    get_base_url : function(){
      return base_url;
    },

    get_next_page: function() {
      page +=1;
      return `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`
    },
    get_previous_page: function() {
      page-=1;
      return `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`;
    },
    get_page: function() {
      
      return page;
    }
    
  };
})();


//console.log(model.getConfigurationLink()); // To get config. utl
// console.log(model.getMoviesEndpoint()); //To get movies url





function display_first_page() {

  var temp = `
  <div class="col-md-3 gx-4 gy-4" id="parent_temp">
  </div>

   <script id="temp" type="x-tmpl-mustache">

   <div class="wrapper">
           
               
                
                <div class="card" style="max-height:500px">
                   
                    <img class="card-img-top img-fluid" src="${model.get_base_url()}{{poster_path}}" alt="Card image cap">
                    <div class="card-body d-flex flex-column text-center">
                        <p class="card-text">{{title}}</p>
                        <p class = "rating">{{vote_average}}</p>
                    </div>
                   
                </div>
               

  </div>
            
        </script>

  `
  

//object to have public access to it.

return {
  append_page: function() {
    $("#row").prepend(temp);
  },


  template : temp,
}




};



function fetch_api(page){


  if(page == undefined){
  var movies_data = model.get_movies();
  }
  else{
    var movies_data = page;
  }

debugger
  $.ajax({
    url: movies_data,
    method: 'GET',
    dataType: 'JSON',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYjNlYmNlMzUxNDQ4NTViZmVhM2I3YzQ0MzdhZGFlZiIsInN1YiI6IjY0NzcyMTAzODlkOTdmMDExNjJhZjdiNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.U0wj-_a8CfVtWx15P2QJliZodktG24KHxsL5_sMo0uQ'
      },
    success: function(data) {
     
      
      renderHello(data);

      
    },
    error: function(err) {
      console.log('error:' + err)
    }
    });

}

function renderHello(data) {

  if(data != null){
    var movies = data.results;
    movies.reverse(); //to display movies in correct order
    movies.forEach(function(movie) {
      console.log(movie)
      debugger
      const {title,vote_average,poster_path} = movie;
    
      var first_page =  new display_first_page();
      first_page.append_page();
      const template = document.getElementById('temp').innerHTML;
     
      const rendered = Mustache.render(template, {poster_path,title,vote_average} );
      document.getElementById('parent_temp').innerHTML = rendered;
    });
  
    
  }

};







var eventsMediator = {
  events: {},
  on: function (eventName, callbackfn) {
    this.events[eventName] = this.events[eventName]
      ? this.events[eventName]
      : [];
    this.events[eventName].push(callbackfn);
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (callBackfn) {
        callBackfn(data);
      });
    }
  },
};

eventsMediator.on("page_change", function (url) {


debugger
  $("#row").empty();
  fetch_api(url);


})

$(document).ready(function(){
//Create card and append in body

fetch_api();



$(".footer").bind('click', function(e) {


debugger
  var event = e.target.id;
 
if(event == 'previous'){
 
  if(model.get_page() != 1){
    eventsMediator.emit('page_change', model.get_previous_page());

 }
}


if(event =='next'){
  eventsMediator.emit('page_change', model.get_next_page());

}


})

//Bind using mustache js library





});