
const model = (function() {
  // Private links 
  var page = 1;
  var data =[];
  var current_page_url;
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
      this.movies =`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`;
      return this.movies;
    },
    get_base_url : function(){
      return base_url;
    },

    get_next_page: function() {
      page+=1;
      this.movies =`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`
      return this.movies
    },
    get_previous_page: function() {
      page-=1;
      this.movies =`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`
      return this.movies
    },
    get_page: function() {
      
      return page;
    },
    set_current_page : function(data){
      if(data===undefined){
      return `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=1`
      }
    var current_page = data;
    return current_page;
    },
    
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
           
               
                
                <div class="card card_class">
                   
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


  $.ajax({
    url: movies_data,
    method: 'GET',
    dataType: 'JSON',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYjNlYmNlMzUxNDQ4NTViZmVhM2I3YzQ0MzdhZGFlZiIsInN1YiI6IjY0NzcyMTAzODlkOTdmMDExNjJhZjdiNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.U0wj-_a8CfVtWx15P2QJliZodktG24KHxsL5_sMo0uQ'
      },
    success: function(data) {
     
      model.data = [];
      renderHello(data);
      stats(data);
      model.data.push(data.results)

      
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
      
      const {title,vote_average,poster_path} = movie;
    
      var first_page =  new display_first_page();
      first_page.append_page();
      const template = document.getElementById('temp').innerHTML;
     
      const rendered = Mustache.render(template, {poster_path,title,vote_average} );
      document.getElementById('parent_temp').innerHTML = rendered;
    });
  
    
  }

};


function stats(data){


//var top_rated;
var rating=0;
$("#current_page").text("Current Page: " + model.get_page())
$("#number_movies").text("Number of Movies:" + data.results.length);

for(var i = 0 ; i<data.results.length;i++){

var rt = data.results[i].vote_average;

if(rt>rating){
  var index = i;
  rating = rt;

}

}
$("#Top_rated").text("Rating:" + data.results[index].title)
$("#rating").text("Top Rated:" +  rating);






}






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

eventsMediator.on("card-clicked",function(movie_title){
debugger
modal(movie_title);




})

function current_api(data){


  var fetched_data = data
  return {

    f_data : fetched_data
  }
}



function modal(title){


 
  
  
  
 
debugger
  var modal_img;
  var modal_title = title;
  var modal_rating;
  var modal_overview;

  var data =model.data[0];
  for(var i=0;i<data.length;i++){
    debugger
    if(data[i].title == title){

      modal_img = model.get_base_url() + data[i].poster_path
      modal_rating = data[i].vote_average;
      modal_overview = data[i].overview;

    }
    
  }
   
  

  $("#img-modal").attr("src",modal_img);
    
  $("#title").text(modal_title);
  
  $("#rating").text("IMDB RATING: " + modal_rating)
  $("#description").text("Description:  " + modal_overview)
  //show the modal on the web page
  $('#myModal').modal('show');
}


$(document).ready(function(){
//Create card and append in body

fetch_api();



$(".footer").bind('click', function(e) {


debugger
  var event = e.target.id;
 
if(event == 'previous'){
 
  if(model.get_page() != 1){
    eventsMediator.emit('page_change', model.get_previous_page());
   // model.current_page_url = model.get_next_page();

 }
}


if(event =='next'){
  eventsMediator.emit('page_change', model.get_next_page());


  //model.current_page_url = model.get_next_page();


}


})




$(document).on('click', '.card', function(e) {


var movie = e.target.closest(".card");

var tit = $(movie).find(".card-text");

var title = tit.text();

eventsMediator.emit("card-clicked",title);

})




});