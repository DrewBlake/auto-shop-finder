// Initialize and add the map
/*function initMap() {
  // The location of Uluru
  var uluru = {lat: 33.6220542, lng: -84.36909179999999};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}*/

const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';

function getDataFromApi(callback) {
  const query = {
    location: '33.62,-84.36',
    rankby: 'distance',
    type: 'car_repair',
    key: 'AIzaSyDXM1Agyu1TixKQJWNTzvwf-ITCGijsuBk'
    
  }
  $.getJSON(GOOGLE_PLACES_URL, query, callback);
}



function renderResult(result) {
  return `<p>${result.name}</p>`;
}

function displayNearByData(data) {
  const results = data.results.map((item, index) => renderResult(item));
  $('.js-show-result').html(results);
  console.log('hello1');

}

function renderForm() {
  return `
      <form action="#" class="js-search-form">
        <label for="query"><h2>Enter a city or zip code</h2></label>
        <input type="text" id="query" class="js-query" placeholder="Example: Atlanta or 30297" required>
        <button type="submit">Search</button>
      </form>
      <div id="userInput"></div>`;
}

function displayForm() {
  $("#userForm").html(renderForm);
}

 function handleSearchButtonClick() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    console.log(query);
    // clear out the input
    $("#userInput").html(`<p>The location you entered is ${query}</p>`);
    queryTarget.val("");
 });
}

function getLocation() {
    
        /*navigator.geolocation.getCurrentPosition(function(position){
          $(".js-show-result").html("latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
          console.log(position.coords.latitude);
        });*/
        if (navigator.geolocation) {
          console.log('geolocation');
        
          console.log('hello');
          let x = navigator.geolocation;
          console.log(x);
          
          x.getCurrentPosition(success, failure);

          function success(position) {
            let myLat = position.coords.latitude;
            let myLong = position.coords.longitude;
            $("#lat").html(`<p>Your Latitude is ${myLat}</p>`);
            $("#long").html(`<p>Your Longitude is ${myLong}</p>`);
            console.log('goodjob');
            
          }

          function failure() {
            
            $("#failure").html('<p>Cannot show your location unless you choose allow</p>');
            
          }
        } else {
          
          $("#failure").html('<p>Geolocation is not supported by Your browser</p>');
        }
        
}
/*function showPosition(position) {
    $('.js-show-result').html(`<p>Latitude:
    <br>Longitude: </p>`);
    //console.log(`${position.coords.latitude}`); 
}
*/

function handleAnywhereButtonClick() {
  $('.js-location-anywhere').on('click', function(event) {
    //$("#lat").remove();
    //$("#long").remove();
    //$("failure").remove();
    displayForm();
    handleSearchButtonClick();
  });
}

function handleLocationButtonClick() {
  $('.js-location-near-me').on('click', function(event) {
    //$("#long").remove();
    getLocation();
    //getDataFromApi(displayNearByData);
  });
}

function runApp() {
  //success();
  //initMap();
  handleLocationButtonClick();
  handleAnywhereButtonClick();
  //showPosition();
  //handleLocationButtonClick();
}

$(runApp);

//$(getLocation);

